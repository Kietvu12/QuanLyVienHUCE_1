import { useState } from 'react';
import ExcelViewer from '../components/ExcelViewer';
import { FaFileExcel, FaList } from 'react-icons/fa';
import React from 'react';
const ReportViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const reportFiles = [
    {
      name: 'BCTC TH 2024 ( 03 biểu) - Copy.xlsx',
      path: new URL('../assets/Report/BCTC TH 2024 ( 03 biểu) - Copy.xlsx', import.meta.url).href,
      description: 'Báo cáo tài chính tổng hợp năm 2024',
    },
    {
      name: 'PL1 - PL2 Bao cao co so KH&CN nam 2024.xlsx',
      path: new URL('../assets/Report/PL1 - PL2 Bao cao co so KH&CN nam 2024.xlsx', import.meta.url).href,
      description: 'Phụ lục 1 - Phụ lục 2 Báo cáo cơ sở KH&CN năm 2024',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Xem báo cáo Excel</h1>
        <p className="text-sm text-gray-500">
          Chọn file Excel để xem nội dung
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Danh sách files */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <FaList className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">Danh sách báo cáo</h2>
            </div>

            <div className="space-y-2">
              {reportFiles.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedFile?.name === file.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FaFileExcel className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {file.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content - Excel viewer */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white shadow-sm p-6">
            {selectedFile ? (
              <ExcelViewer filePath={selectedFile.path} fileName={selectedFile.name} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <FaFileExcel className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Chọn một file báo cáo từ danh sách bên trái để xem nội dung
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;

