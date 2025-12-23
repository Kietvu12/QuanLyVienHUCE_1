import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileExcel, FaFileWord, FaDownload, FaCheck } from 'react-icons/fa';
import ExcelViewer from '../../components/ExcelViewer';
import ActivityReportForm from '../../components/rector/ActivityReportForm';
import React from 'react';
// Import Excel files as URLs
import bctcFileUrl from '../../assets/Report/BCTC TH 2024 ( 03 biểu) - Copy.xlsx?url';
import plFileUrl from '../../assets/Report/PL1 - PL2 Bao cao co so KH&CN nam 2024.xlsx?url';
import docFileUrl from '../../assets/Report/Mẫu báo cáo hoạt động năm 2024  .doc?url';
const reportTemplates = [
  {
    id: 'bctc',
    name: 'Báo cáo tài chính (BCTC)',
    description: 'Báo cáo tình hình tài chính, kết quả hoạt động và lưu chuyển tiền tệ',
    file: 'BCTC TH 2024 ( 03 biểu) - Copy.xlsx',
    filePath: bctcFileUrl,
    sheets: ['BCTC TH B01', 'BCKQHĐ TH B02', 'BCLCTT TH B03'],
    defaultSheet: 'BCTC TH B01',
  },
  {
    id: 'pl1',
    name: 'Phụ lục 1 - Báo cáo hiện trạng nhân lực',
    description: 'Báo cáo về hiện trạng nhân lực của tổ chức KH&CN',
    file: 'PL1 - PL2 Bao cao co so KH&CN nam 2024.xlsx',
    filePath: plFileUrl,
    sheets: ['PL1 - BC hiện trạng nhân lực', 'PL2 - Thống kê hoạt động KH&CN'],
    defaultSheet: 'PL1 - BC hiện trạng nhân lực',
  },
  {
    id: 'activity-report',
    name: 'Mẫu báo cáo hoạt động năm 2024',
    description: 'Mẫu báo cáo hoạt động hàng năm của Viện',
    file: 'Mẫu báo cáo hoạt động năm 2024  .doc',
    filePath: docFileUrl,
    sheets: [],
    isDoc: true,
  },
];

const CreateReport = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportInfo, setReportInfo] = useState({
    name: '',
    type: '',
    description: '',
    period: '',
    year: new Date().getFullYear().toString(),
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setReportInfo({
      ...reportInfo,
      type: template.name,
    });
    setStep(2);
  };


  const handleNext = () => {
    if (step === 2) {
      // Validate form
      if (!reportInfo.name || !reportInfo.type) {
        alert('Vui lòng điền đầy đủ thông tin báo cáo');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Xử lý tạo báo cáo
      handleCreateReport();
    }
  };

  const handleCreateReport = () => {
    // Simulate creating report
    console.log('Creating report:', {
      ...reportInfo,
      template: selectedTemplate,
    });
    
    // Redirect back to report list
    setTimeout(() => {
      navigate('/rector/report');
    }, 1000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/rector/report')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại danh sách báo cáo</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Tạo báo cáo mới</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chọn template báo cáo từ danh sách có sẵn
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s ? <FaCheck className="w-5 h-5" /> : s}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    step >= s ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {s === 1 && 'Chọn template'}
                  {s === 2 && 'Thông tin báo cáo'}
                  {s === 3 && 'Xem trước & Xác nhận'}
                </span>
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > s ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Template */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  template.isDoc ? 'bg-blue-100' : 'bg-blue-100'
                }`}>
                  {template.isDoc ? (
                    <FaFileWord className="w-6 h-6 text-blue-600" />
                  ) : (
                    <FaFileExcel className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  {template.file && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {template.isDoc ? (
                        <FaFileWord className="w-3 h-3" />
                      ) : (
                        <FaFileExcel className="w-3 h-3" />
                      )}
                      <span>{template.file}</span>
                    </div>
                  )}
                  {template.sheets.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {template.sheets.length} sheet(s)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Report Information */}
      {step === 2 && (
        <div className="max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin báo cáo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên báo cáo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportInfo.name}
                  onChange={(e) =>
                    setReportInfo({ ...reportInfo, name: e.target.value })
                  }
                  placeholder="Nhập tên báo cáo"
                  className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại báo cáo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportInfo.type}
                  readOnly
                  className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỳ báo cáo
                  </label>
                  <input
                    type="text"
                    value={reportInfo.period}
                    onChange={(e) =>
                      setReportInfo({ ...reportInfo, period: e.target.value })
                    }
                    placeholder="VD: Tháng 12, Q4, Năm 2024"
                    className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm
                  </label>
                  <input
                    type="text"
                    value={reportInfo.year}
                    onChange={(e) =>
                      setReportInfo({ ...reportInfo, year: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={reportInfo.description}
                  onChange={(e) =>
                    setReportInfo({ ...reportInfo, description: e.target.value })
                  }
                  placeholder="Nhập mô tả báo cáo (tùy chọn)"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {selectedTemplate && selectedTemplate.isDoc && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaFileWord className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Template: {selectedTemplate.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        File: {selectedTemplate.file}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Định dạng: Microsoft Word (.doc)
                      </p>
                      <a
                        href={selectedTemplate.filePath}
                        download={selectedTemplate.file}
                        className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        <FaDownload className="w-3 h-3" />
                        Tải xuống mẫu
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate && !selectedTemplate.isDoc && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaFileExcel className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Template: {selectedTemplate.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        File: {selectedTemplate.file}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Sheet mặc định: <span className="font-semibold">{selectedTemplate.defaultSheet}</span>
                      </p>
                      {selectedTemplate.sheets.length > 1 && (
                        <p className="text-xs text-gray-600 mt-1">
                          Tất cả sheets trong file: {selectedTemplate.sheets.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Confirm */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Report Info Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin báo cáo
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tên báo cáo</p>
                <p className="text-sm font-medium text-gray-900">
                  {reportInfo.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Loại</p>
                <p className="text-sm font-medium text-gray-900">
                  {reportInfo.type}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Kỳ báo cáo</p>
                <p className="text-sm font-medium text-gray-900">
                  {reportInfo.period || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Năm</p>
                <p className="text-sm font-medium text-gray-900">
                  {reportInfo.year}
                </p>
              </div>
            </div>
            {reportInfo.description && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                <p className="text-sm text-gray-700">{reportInfo.description}</p>
              </div>
            )}
          </div>

          {/* Excel Preview */}
          {selectedTemplate && !selectedTemplate.isDoc && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Xem trước báo cáo
              </h2>
              {selectedTemplate.filePath ? (
                <ExcelViewer
                  filePath={selectedTemplate.filePath}
                  fileName={selectedTemplate.file}
                  defaultSheet={selectedTemplate.defaultSheet}
                />
              ) : null}
            </div>
          )}

          {/* DOC Form */}
          {selectedTemplate && selectedTemplate.isDoc && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Điền thông tin báo cáo
                  </h2>
                  <p className="text-sm text-gray-500">
                    Vui lòng điền đầy đủ thông tin theo mẫu báo cáo hoạt động
                  </p>
                </div>
                <a
                  href={selectedTemplate.filePath}
                  download={selectedTemplate.file}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaDownload className="w-4 h-4" />
                  Tải mẫu
                </a>
              </div>
              <ActivityReportForm
                reportInfo={reportInfo}
                onSubmit={handleCreateReport}
                onBack={() => setStep(2)}
              />
            </div>
          )}

          {/* Actions - Only show for non-DOC templates */}
          {selectedTemplate && !selectedTemplate.isDoc && (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleCreateReport}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaCheck className="w-4 h-4" />
                Tạo báo cáo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateReport;

