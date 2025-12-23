import * as XLSX from 'xlsx';

/**
 * Đọc file Excel và trả về dữ liệu
 * @param {string} filePath - Đường dẫn đến file Excel
 * @returns {Object} - Object chứa dữ liệu của các sheet
 */
export const readExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const result = {
      sheetNames: workbook.SheetNames,
      sheets: {},
    };

    // Đọc từng sheet
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      // Chuyển đổi sheet thành JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Sử dụng mảng mảng (array of arrays)
        defval: '', // Giá trị mặc định cho ô trống
        raw: false, // Chuyển đổi số thành chuỗi
      });
      
      // Chuyển đổi sang dạng bảng với header
      const tableData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false,
      });

      // Đọc thông tin format và bố cục
      const merges = worksheet['!merges'] || [];
      const cols = worksheet['!cols'] || [];
      const rows = worksheet['!rows'] || [];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      // Đọc format của từng cell
      const cellFormats = {};
      const cellStyles = {};
      
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          
          if (cell) {
            // Kiểm tra merge
            const mergeInfo = merges.find(m => {
              const start = XLSX.utils.encode_cell(m.s);
              return start === cellAddress;
            });
            
            if (mergeInfo) {
              cellFormats[cellAddress] = {
                ...cellFormats[cellAddress],
                merge: {
                  start: XLSX.utils.encode_cell(mergeInfo.s),
                  end: XLSX.utils.encode_cell(mergeInfo.e),
                  cols: mergeInfo.e.c - mergeInfo.s.c + 1,
                  rows: mergeInfo.e.r - mergeInfo.s.r + 1,
                },
              };
            }
            
            // Đọc style
            if (cell.s) {
              const style = cell.s;
              cellStyles[cellAddress] = {
                font: style.font ? {
                  bold: style.font.bold || false,
                  italic: style.font.italic || false,
                  underline: style.font.underline || false,
                  color: style.font.color ? {
                    rgb: style.font.color.rgb,
                    theme: style.font.color.theme,
                  } : null,
                  size: style.font.sz || null,
                  name: style.font.name || null,
                } : null,
                fill: style.fill && style.fill.fgColor ? {
                  rgb: style.fill.fgColor.rgb,
                  theme: style.fill.fgColor.theme,
                } : null,
                alignment: style.alignment ? {
                  horizontal: style.alignment.horizontal || null,
                  vertical: style.alignment.vertical || null,
                  wrapText: style.alignment.wrapText || false,
                  indent: style.alignment.indent || 0,
                } : null,
                border: style.border ? {
                  top: style.border.top ? {
                    style: style.border.top.style,
                    color: style.border.top.color,
                  } : null,
                  bottom: style.border.bottom ? {
                    style: style.border.bottom.style,
                    color: style.border.bottom.color,
                  } : null,
                  left: style.border.left ? {
                    style: style.border.left.style,
                    color: style.border.left.color,
                  } : null,
                  right: style.border.right ? {
                    style: style.border.right.style,
                    color: style.border.right.color,
                  } : null,
                } : null,
                numFmt: cell.z || null,
              };
            }
          }
        }
      }
      
      // Đọc column widths
      const columnWidths = cols.map((col, index) => ({
        index,
        width: col.wpx || col.width || null,
        hidden: col.hidden || false,
      }));
      
      // Đọc row heights
      const rowHeights = rows ? rows.map((row, index) => ({
        index,
        height: row.hpt || row.height || null,
        hidden: row.hidden || false,
      })) : [];

      result.sheets[sheetName] = {
        raw: jsonData,
        table: tableData,
        range: {
          s: { r: range.s.r, c: range.s.c },
          e: { r: range.e.r, c: range.e.c },
          ref: worksheet['!ref'] || 'A1',
        },
        merges: merges.map(m => ({
          start: XLSX.utils.encode_cell(m.s),
          end: XLSX.utils.encode_cell(m.e),
          cols: m.e.c - m.s.c + 1,
          rows: m.e.r - m.s.r + 1,
        })),
        columnWidths,
        rowHeights,
        cellFormats,
        cellStyles,
      };
    });

    return result;
  } catch (error) {
    console.error('Lỗi khi đọc file Excel:', error);
    throw error;
  }
};

/**
 * Đọc file Excel từ URL hoặc File object (cho browser)
 * @param {File|string|ArrayBuffer} file - File object, URL hoặc ArrayBuffer
 * @returns {Promise<Object>} - Promise trả về dữ liệu Excel
 */
export const readExcelFileFromBrowser = async (file) => {
  try {
    let arrayBuffer;
    
    if (file instanceof File) {
      // Đọc từ File object
      arrayBuffer = await file.arrayBuffer();
    } else if (file instanceof ArrayBuffer) {
      // Đã là ArrayBuffer
      arrayBuffer = file;
    } else if (typeof file === 'string') {
      // Đọc từ URL
      const response = await fetch(file);
      arrayBuffer = await response.arrayBuffer();
    } else {
      throw new Error('File không hợp lệ');
    }

    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    
    const result = {
      sheetNames: workbook.SheetNames,
      sheets: {},
    };

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            raw: false,
          });

          // Đọc format và bố cục (tương tự như trên)
          const merges = worksheet['!merges'] || [];
          const cols = worksheet['!cols'] || [];
          const rows = worksheet['!rows'] || [];
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
          
          const cellFormats = {};
          const cellStyles = {};
          
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = worksheet[cellAddress];
              
              if (cell) {
                const mergeInfo = merges.find(m => {
                  const start = XLSX.utils.encode_cell(m.s);
                  return start === cellAddress;
                });
                
                if (mergeInfo) {
                  cellFormats[cellAddress] = {
                    ...cellFormats[cellAddress],
                    merge: {
                      start: XLSX.utils.encode_cell(mergeInfo.s),
                      end: XLSX.utils.encode_cell(mergeInfo.e),
                      cols: mergeInfo.e.c - mergeInfo.s.c + 1,
                      rows: mergeInfo.e.r - mergeInfo.s.r + 1,
                    },
                  };
                }
                
                if (cell.s) {
                  const style = cell.s;
                  cellStyles[cellAddress] = {
                    font: style.font ? {
                      bold: style.font.bold || false,
                      italic: style.font.italic || false,
                      underline: style.font.underline || false,
                      color: style.font.color ? {
                        rgb: style.font.color.rgb,
                        theme: style.font.color.theme,
                      } : null,
                      size: style.font.sz || null,
                      name: style.font.name || null,
                    } : null,
                    fill: style.fill && style.fill.fgColor ? {
                      rgb: style.fill.fgColor.rgb,
                      theme: style.fill.fgColor.theme,
                    } : null,
                    alignment: style.alignment ? {
                      horizontal: style.alignment.horizontal || null,
                      vertical: style.alignment.vertical || null,
                      wrapText: style.alignment.wrapText || false,
                      indent: style.alignment.indent || 0,
                    } : null,
                    border: style.border ? {
                      top: style.border.top ? {
                        style: style.border.top.style,
                        color: style.border.top.color,
                      } : null,
                      bottom: style.border.bottom ? {
                        style: style.border.bottom.style,
                        color: style.border.bottom.color,
                      } : null,
                      left: style.border.left ? {
                        style: style.border.left.style,
                        color: style.border.left.color,
                      } : null,
                      right: style.border.right ? {
                        style: style.border.right.style,
                        color: style.border.right.color,
                      } : null,
                    } : null,
                    numFmt: cell.z || null,
                  };
                }
              }
            }
          }
          
          const columnWidths = cols.map((col, index) => ({
            index,
            width: col.wpx || col.width || null,
            hidden: col.hidden || false,
          }));
          
          const rowHeights = rows ? rows.map((row, index) => ({
            index,
            height: row.hpt || row.height || null,
            hidden: row.hidden || false,
          })) : [];

          result.sheets[sheetName] = {
            raw: jsonData,
            table: jsonData,
            range: {
              s: { r: range.s.r, c: range.s.c },
              e: { r: range.e.r, c: range.e.c },
              ref: worksheet['!ref'] || 'A1',
            },
            merges: merges.map(m => ({
              start: XLSX.utils.encode_cell(m.s),
              end: XLSX.utils.encode_cell(m.e),
              cols: m.e.c - m.s.c + 1,
              rows: m.e.r - m.s.r + 1,
            })),
            columnWidths,
            rowHeights,
            cellFormats,
            cellStyles,
          };
        });

    return result;
  } catch (error) {
    console.error('Lỗi khi đọc file Excel từ browser:', error);
    throw error;
  }
};

/**
 * Chuyển đổi dữ liệu Excel thành HTML table
 * @param {Array} data - Dữ liệu từ Excel (array of arrays)
 * @returns {string} - HTML string
 */
export const excelToHTML = (data) => {
  if (!data || data.length === 0) return '<p>Không có dữ liệu</p>';
  
  let html = '<table border="1" style="border-collapse: collapse; width: 100%;">';
  
  data.forEach((row, rowIndex) => {
    html += '<tr>';
    row.forEach((cell) => {
      const tag = rowIndex === 0 ? 'th' : 'td';
      html += `<${tag} style="padding: 8px; border: 1px solid #ddd;">${cell || ''}</${tag}>`;
    });
    html += '</tr>';
  });
  
  html += '</table>';
  return html;
};

