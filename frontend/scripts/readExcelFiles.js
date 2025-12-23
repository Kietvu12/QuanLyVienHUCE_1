import * as XLSX from 'xlsx';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reportFiles = [
  'BCTC TH 2024 ( 03 biểu) - Copy.xlsx',
  'PL1 - PL2 Bao cao co so KH&CN nam 2024.xlsx',
];

/**
 * Đọc và hiển thị nội dung file Excel
 */
const readExcelFile = async (fileName) => {
  try {
    const filePath = join(__dirname, '../src/assets/Report', fileName);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📄 Đang đọc file: ${fileName}`);
    console.log('='.repeat(80));

    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    console.log(`\n✅ File có ${workbook.SheetNames.length} sheet(s):`);
    workbook.SheetNames.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });

    // Đọc từng sheet
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      console.log(`\n${'-'.repeat(80)}`);
      console.log(`📊 SHEET ${sheetIndex + 1}: ${sheetName}`);
      console.log('-'.repeat(80));

      const worksheet = workbook.Sheets[sheetName];
      
      // Đọc thông tin format và bố cục
      const merges = worksheet['!merges'] || [];
      const cols = worksheet['!cols'] || [];
      const rows = worksheet['!rows'] || [];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      console.log(`\n   📐 Thông tin bố cục:`);
      console.log(`      - Phạm vi: ${worksheet['!ref'] || 'A1'}`);
      console.log(`      - Số dòng: ${range.e.r + 1}, Số cột: ${range.e.c + 1}`);
      console.log(`      - Merge cells: ${merges.length} vùng`);
      if (merges.length > 0) {
        merges.slice(0, 5).forEach((merge, idx) => {
          const start = XLSX.utils.encode_cell(merge.s);
          const end = XLSX.utils.encode_cell(merge.e);
          console.log(`        ${idx + 1}. ${start}:${end}`);
        });
        if (merges.length > 5) {
          console.log(`        ... và ${merges.length - 5} vùng khác`);
        }
      }
      
      if (cols.length > 0) {
        console.log(`      - Độ rộng cột: ${cols.length} cột có thiết lập`);
      }
      
      // Đọc format của các cell
      console.log(`\n   🎨 Thông tin format:`);
      let formattedCells = 0;
      let mergedCells = 0;
      const cellFormats = {};
      
      // Duyệt qua tất cả các cell trong range
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          
          if (cell) {
            // Kiểm tra merge
            const isMerged = merges.some(m => {
              const start = XLSX.utils.encode_cell(m.s);
              return start === cellAddress;
            });
            
            if (isMerged) mergedCells++;
            
            // Đọc format
            if (cell.s) {
              formattedCells++;
              const style = cell.s;
              const formatInfo = [];
              
              if (style.font) {
                if (style.font.bold) formatInfo.push('Bold');
                if (style.font.italic) formatInfo.push('Italic');
                if (style.font.underline) formatInfo.push('Underline');
                if (style.font.color) {
                  const rgb = style.font.color.rgb || style.font.color.theme;
                  formatInfo.push(`FontColor:${rgb || 'theme'}`);
                }
                if (style.font.sz) formatInfo.push(`Size:${style.font.sz}`);
              }
              
              if (style.fill && style.fill.fgColor) {
                const bgColor = style.fill.fgColor.rgb || style.fill.fgColor.theme;
                formatInfo.push(`BG:${bgColor || 'theme'}`);
              }
              
              if (style.alignment) {
                const align = [];
                if (style.alignment.horizontal) align.push(`H:${style.alignment.horizontal}`);
                if (style.alignment.vertical) align.push(`V:${style.alignment.vertical}`);
                if (style.alignment.wrapText) align.push('Wrap');
                if (align.length > 0) formatInfo.push(align.join(','));
              }
              
              if (style.border) {
                const borders = [];
                if (style.border.top) borders.push('Top');
                if (style.border.bottom) borders.push('Bottom');
                if (style.border.left) borders.push('Left');
                if (style.border.right) borders.push('Right');
                if (borders.length > 0) formatInfo.push(`Border:${borders.join(',')}`);
              }
              
              if (formatInfo.length > 0) {
                cellFormats[cellAddress] = formatInfo.join(' | ');
              }
            }
            
            // Đọc number format
            if (cell.z) {
              // Number format code
            }
          }
        }
      }
      
      console.log(`      - Cells có format: ${formattedCells}`);
      console.log(`      - Cells được merge: ${mergedCells}`);
      
      if (Object.keys(cellFormats).length > 0) {
        console.log(`\n   📋 Một số cell có format:`);
        Object.entries(cellFormats).slice(0, 10).forEach(([addr, format]) => {
          const cell = worksheet[addr];
          const value = cell ? (cell.v || cell.w || '') : '';
          console.log(`      ${addr}: "${value.substring(0, 30)}" - ${format}`);
        });
        if (Object.keys(cellFormats).length > 10) {
          console.log(`      ... và ${Object.keys(cellFormats).length - 10} cell khác`);
        }
      }
      
      // Chuyển đổi sang JSON với header
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false,
      });

      // Hiển thị dữ liệu dạng bảng
      if (jsonData.length === 0) {
        console.log('\n   (Sheet trống)');
        return;
      }

      // Tìm số cột tối đa
      const maxCols = Math.max(...jsonData.map(row => row.length));
      
      // Hiển thị từng dòng
      jsonData.forEach((row, rowIndex) => {
        // Tạo dòng với đủ số cột
        const paddedRow = [...row, ...Array(maxCols - row.length).fill('')];
        
        // Hiển thị dòng
        const rowStr = paddedRow
          .map((cell, colIndex) => {
            const cellStr = String(cell || '').substring(0, 20); // Giới hạn 20 ký tự
            return cellStr.padEnd(20);
          })
          .join(' | ');
        
        // Header row
        if (rowIndex === 0) {
          console.log(`\n   ${rowStr}`);
          console.log(`   ${'-'.repeat(rowStr.length)}`);
        } else {
          console.log(`   ${rowStr}`);
        }
      });

      // Thống kê
      console.log(`\n   📈 Thống kê: ${jsonData.length} dòng, ${maxCols} cột`);
    });

  } catch (error) {
    console.error(`\n❌ Lỗi khi đọc file ${fileName}:`, error.message);
  }
};

/**
 * Đọc tất cả các file Excel
 */
const readAllFiles = async () => {
  console.log('\n🚀 Bắt đầu đọc các file Excel trong folder Report...\n');

  for (const fileName of reportFiles) {
    await readExcelFile(fileName);
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ Hoàn thành đọc tất cả các file Excel');
  console.log('='.repeat(80));
};

// Chạy script
readAllFiles().catch(console.error);

