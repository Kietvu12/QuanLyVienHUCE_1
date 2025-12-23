import { readExcelFile } from './readExcel';
import { readExcelFileFromBrowser } from './readExcel';

/**
 * Đọc tất cả các file Excel trong folder Report
 * Lưu ý: Trong môi trường browser, cần sử dụng import động
 */
export const readAllReportFiles = async () => {
  const reportFiles = [
    'BCTC TH 2024 ( 03 biểu) - Copy.xlsx',
    'PL1 - PL2 Bao cao co so KH&CN nam 2024.xlsx',
  ];

  const results = {};

  for (const fileName of reportFiles) {
    try {
      // Trong browser, sử dụng import động
      const filePath = `/src/assets/Report/${fileName}`;
      
      // Thử đọc từ URL (cho browser)
      const response = await fetch(filePath);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const data = await readExcelFileFromBrowser(arrayBuffer);
        results[fileName] = {
          success: true,
          data: data,
        };
      } else {
        results[fileName] = {
          success: false,
          error: `Không thể tải file: ${fileName}`,
        };
      }
    } catch (error) {
      results[fileName] = {
        success: false,
        error: error.message,
      };
    }
  }

  return results;
};

/**
 * Đọc một file Excel cụ thể
 */
export const readReportFile = async (fileName) => {
  try {
    const filePath = `/src/assets/Report/${fileName}`;
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`Không thể tải file: ${fileName}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const data = await readExcelFileFromBrowser(arrayBuffer);
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

