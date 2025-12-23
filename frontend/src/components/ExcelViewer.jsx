import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import React from 'react';
const ExcelViewer = ({ filePath, fileName, defaultSheet = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);

  useEffect(() => {
    const loadExcelFile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Tải file từ URL
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Không thể tải file: ${fileName}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

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

          // Đọc format và bố cục
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

        setData(result);
        if (result.sheetNames.length > 0) {
          // Nếu có defaultSheet và nó tồn tại trong danh sách, chọn nó
          // Nếu không, chọn sheet đầu tiên
          if (defaultSheet && result.sheetNames.includes(defaultSheet)) {
            setSelectedSheet(defaultSheet);
          } else {
            setSelectedSheet(result.sheetNames[0]);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi đọc file Excel:', err);
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadExcelFile();
    }
  }, [filePath, fileName, defaultSheet]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mr-2" />
        <span className="text-gray-600">Đang tải file Excel...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
        <FaExclamationTriangle className="w-6 h-6 text-red-500 mr-2" />
        <span className="text-red-700">Lỗi: {error}</span>
      </div>
    );
  }

  if (!data || !selectedSheet) {
    return (
      <div className="p-8 text-center text-gray-500">
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  const currentSheetData = data.sheets[selectedSheet];
  const tableData = currentSheetData?.table || [];
  const merges = currentSheetData?.merges || [];
  const cellStyles = currentSheetData?.cellStyles || {};
  const cellFormats = currentSheetData?.cellFormats || {};
  const columnWidths = currentSheetData?.columnWidths || [];
  const rowHeights = currentSheetData?.rowHeights || [];

  // Helper function để lấy style cho cell
  const getCellStyle = (rowIndex, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
    const style = cellStyles[cellAddress];
    const format = cellFormats[cellAddress];
    
    if (!style && !format) return {};
    
    const cellStyle = {};
    
    // Font styles
    if (style?.font) {
      if (style.font.bold) cellStyle.fontWeight = 'bold';
      if (style.font.italic) cellStyle.fontStyle = 'italic';
      if (style.font.underline) cellStyle.textDecoration = 'underline';
      if (style.font.size) cellStyle.fontSize = `${style.font.size}pt`;
      if (style.font.name) cellStyle.fontFamily = style.font.name;
      if (style.font.color?.rgb) {
        cellStyle.color = `#${style.font.color.rgb}`;
      }
    }
    
    // Background color
    if (style?.fill?.rgb) {
      cellStyle.backgroundColor = `#${style.fill.rgb}`;
    }
    
    // Alignment
    if (style?.alignment) {
      if (style.alignment.horizontal) {
        cellStyle.textAlign = style.alignment.horizontal;
      }
      if (style.alignment.vertical) {
        cellStyle.verticalAlign = style.alignment.vertical;
      }
      if (style.alignment.wrapText) {
        cellStyle.whiteSpace = 'normal';
      }
      if (style.alignment.indent) {
        cellStyle.paddingLeft = `${style.alignment.indent * 10}px`;
      }
    }
    
    // Borders
    if (style?.border) {
      cellStyle.border = '1px solid #d1d5db';
      if (style.border.top) {
        cellStyle.borderTop = `${style.border.top.style || 'thin'} solid ${style.border.top.color?.rgb ? `#${style.border.top.color.rgb}` : '#000'}`;
      }
      if (style.border.bottom) {
        cellStyle.borderBottom = `${style.border.bottom.style || 'thin'} solid ${style.border.bottom.color?.rgb ? `#${style.border.bottom.color.rgb}` : '#000'}`;
      }
      if (style.border.left) {
        cellStyle.borderLeft = `${style.border.left.style || 'thin'} solid ${style.border.left.color?.rgb ? `#${style.border.left.color.rgb}` : '#000'}`;
      }
      if (style.border.right) {
        cellStyle.borderRight = `${style.border.right.style || 'thin'} solid ${style.border.right.color?.rgb ? `#${style.border.right.color.rgb}` : '#000'}`;
      }
    }
    
    // Merge cells
    if (format?.merge) {
      cellStyle.gridColumn = `span ${format.merge.cols}`;
      cellStyle.gridRow = `span ${format.merge.rows}`;
    }
    
    return cellStyle;
  };

  // Helper function để kiểm tra cell có bị merge không (không phải cell đầu)
  const isMergedCell = (rowIndex, colIndex) => {
    return merges.some(merge => {
      const start = XLSX.utils.decode_cell(merge.start);
      const end = XLSX.utils.decode_cell(merge.end);
      // Cell nằm trong vùng merge nhưng không phải là cell đầu
      return (
        rowIndex >= start.r && rowIndex <= end.r &&
        colIndex >= start.c && colIndex <= end.c &&
        !(rowIndex === start.r && colIndex === start.c)
      );
    });
  };

  // Helper function để lấy thông tin merge của cell
  const getMergeInfo = (rowIndex, colIndex) => {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
    const format = cellFormats[cellAddress];
    return format?.merge || null;
  };

  // Helper function để lấy column width
  const getColumnWidth = (colIndex) => {
    const col = columnWidths.find(c => c.index === colIndex);
    return col?.width ? `${col.width}px` : 'auto';
  };

  // Helper function để lấy row height
  const getRowHeight = (rowIndex) => {
    const row = rowHeights.find(r => r.index === rowIndex);
    return row?.height ? `${row.height}px` : 'auto';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaFileExcel className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{fileName}</h3>
            <p className="text-sm text-gray-500">
              {data.sheetNames.length} sheet(s) - Sheet hiện tại: {selectedSheet}
            </p>
          </div>
        </div>

        {/* Sheet selector */}
        {data.sheetNames.length > 1 && (
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {data.sheetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Format Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <span className="font-semibold">Merge cells:</span> {merges.length}
          </div>
          <div>
            <span className="font-semibold">Formatted cells:</span> {Object.keys(cellStyles).length}
          </div>
          <div>
            <span className="font-semibold">Columns:</span> {columnWidths.length}
          </div>
          <div>
            <span className="font-semibold">Rows:</span> {rowHeights.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full border-collapse" style={{ tableLayout: 'auto' }}>
          <colgroup>
            {tableData[0]?.map((_, colIndex) => (
              <col key={colIndex} style={{ width: getColumnWidth(colIndex) }} />
            ))}
          </colgroup>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ height: getRowHeight(rowIndex) }}
                className={rowIndex === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}
              >
                {row.map((cell, cellIndex) => {
                  // Bỏ qua cell bị merge (không phải cell đầu)
                  if (isMergedCell(rowIndex, cellIndex)) {
                    return null;
                  }
                  
                  const CellTag = rowIndex === 0 ? 'th' : 'td';
                  const cellStyle = getCellStyle(rowIndex, cellIndex);
                  const mergeInfo = getMergeInfo(rowIndex, cellIndex);
                  
                  return (
                    <CellTag
                      key={cellIndex}
                      style={cellStyle}
                      className="px-4 py-2 border border-gray-200 text-sm text-gray-700"
                      colSpan={mergeInfo ? mergeInfo.cols : 1}
                      rowSpan={mergeInfo ? mergeInfo.rows : 1}
                    >
                      {cell || ''}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500">
        Số dòng: {tableData.length} | Số cột: {tableData[0]?.length || 0} | 
        Merge cells: {merges.length} | Formatted: {Object.keys(cellStyles).length}
      </div>
    </div>
  );
};

export default ExcelViewer;

