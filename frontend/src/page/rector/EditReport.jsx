import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaFileExcel, FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import ExcelViewer from '../../components/ExcelViewer';
import { baoCaoAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
import React from 'react';

const EditReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const basePath = user?.role ? `/${user.role}` : '/rector';
  const excelViewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(2); // Bắt đầu từ step 2 (thông tin báo cáo)
  const [reportInfo, setReportInfo] = useState({
    name: '',
    type: '',
    description: '',
    period: '',
    year: new Date().getFullYear().toString(),
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [excelWorkbook, setExcelWorkbook] = useState(null);
  const [existingFilePath, setExistingFilePath] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  // Load dữ liệu báo cáo hiện có
  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        alert('Không tìm thấy ID báo cáo');
        navigate(`${basePath}/report`);
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching report with ID:', id);
        const response = await baoCaoAPI.getById(id);
        console.log('Report API response:', response);
        
        if (response.success && response.data) {
          const report = response.data;
          console.log('Report data:', report);
          
          // Parse tên báo cáo để lấy thông tin
          const title = report.tieu_de || '';
          setReportInfo({
            name: title,
            type: title.split(' ')[0] || '',
            description: '',
            period: '',
            year: report.ngay_tao ? new Date(report.ngay_tao).getFullYear().toString() : new Date().getFullYear().toString(),
          });
          
          if (report.duong_dan_tai_lieu) {
            setExistingFilePath(report.duong_dan_tai_lieu);
            setCurrentFile(report.duong_dan_tai_lieu);
          }
        } else {
          console.error('API response not successful:', response);
          alert('Không tìm thấy báo cáo: ' + (response.message || 'Vui lòng thử lại'));
          navigate(`${basePath}/report`);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin báo cáo:', error);
        alert('Lỗi khi lấy thông tin báo cáo: ' + error.message);
        navigate(`${basePath}/report`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReport();
    } else {
      console.log('User not loaded yet, waiting...');
    }
  }, [id, user?.id, navigate]);

  const handleNext = () => {
    if (step === 2) {
      // Validate form
      if (!reportInfo.name) {
        alert('Vui lòng điền tên báo cáo');
        return;
      }
      setStep(3);
    }
  };

  // Hàm xử lý khi ExcelViewer export workbook
  const handleExcelExport = (workbook, fileName) => {
    // Lưu workbook để sử dụng khi cập nhật báo cáo
    setExcelWorkbook({ workbook, fileName });
    // Vẫn xuất file xuống máy
    XLSX.writeFile(workbook, fileName);
  };

  const handleUpdateReport = async () => {
    if (!user || !user.id) {
      alert('Vui lòng đăng nhập để cập nhật báo cáo');
      return;
    }

    setIsUpdating(true);
    try {
      // Lấy workbook từ ExcelViewer nếu có
      let filePath = existingFilePath;
      
      if (excelViewerRef.current) {
        // Lấy workbook từ ExcelViewer (tự động từ data hiện tại)
        const workbook = excelViewerRef.current.getWorkbook();
        
        if (workbook) {
          // Chuyển đổi workbook thành file và upload
          const fileName = excelWorkbook?.fileName || `${reportInfo.name || 'bao-cao'}.xlsx`;
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([wbout], { type: 'application/octet-stream' });
          const file = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          
          // Upload file lên server
          try {
            const uploadResponse = await baoCaoAPI.uploadFile(file);
            if (uploadResponse.success && uploadResponse.data) {
              filePath = uploadResponse.data.filePath;
            } else {
              throw new Error(uploadResponse.message || 'Upload file thất bại');
            }
          } catch (uploadError) {
            console.error('Lỗi khi upload file:', uploadError);
            alert('Lỗi khi upload file: ' + uploadError.message);
            setIsUpdating(false);
            return;
          }
        }
      }

      // Cập nhật báo cáo
      const baoCaoData = {
        tieu_de: reportInfo.name,
        duong_dan_tai_lieu: filePath,
      };

      const response = await baoCaoAPI.update(id, baoCaoData);
      
      if (response.success) {
        alert('Cập nhật báo cáo thành công!');
        navigate(`${basePath}/report`);
      } else {
        alert('Lỗi khi cập nhật báo cáo: ' + (response.message || 'Vui lòng thử lại'));
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật báo cáo:', error);
      alert('Lỗi khi cập nhật báo cáo: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mr-2" />
          <span className="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Xác định file path để hiển thị trong ExcelViewer
  // Backend serve static files tại /uploads, không phải /api/uploads
  const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      // Nếu có VITE_API_URL, loại bỏ /api nếu có
      return envUrl.replace('/api', '');
    }
    // Mặc định backend chạy ở port 3000
    return 'http://localhost:3000';
  };

  const excelFilePath = currentFile 
    ? (currentFile.startsWith('http') 
        ? currentFile 
        : currentFile.startsWith('/uploads/')
          ? `${getBaseUrl()}${currentFile}`
          : currentFile.startsWith('/')
            ? `${getBaseUrl()}${currentFile}`
            : `${getBaseUrl()}/uploads/${currentFile}`)
    : null;
  
  console.log('Excel file path:', excelFilePath);
  console.log('Current file:', currentFile);
  console.log('Base URL:', getBaseUrl());
  console.log('Report info:', reportInfo);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`${basePath}/report`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Quay lại danh sách báo cáo</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa báo cáo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cập nhật thông tin và nội dung báo cáo
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
                  Loại báo cáo
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

              {existingFilePath && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaFileExcel className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        File hiện tại
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {existingFilePath.split('/').pop()}
                      </p>
                      <a
                        href={excelFilePath || existingFilePath}
                        download
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        <FaDownload className="w-3 h-3" />
                        Tải xuống file hiện tại
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => navigate(`${basePath}/report`)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
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
          {excelFilePath ? (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chỉnh sửa báo cáo
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800">
                  💡 Chỉnh sửa dữ liệu trong bảng, sau đó click <strong>"Cập nhật báo cáo"</strong> ở dưới để lưu vào hệ thống
                </div>
              </div>
              <ExcelViewer
                ref={excelViewerRef}
                filePath={excelFilePath}
                fileName={reportInfo.name || 'bao-cao.xlsx'}
                onExport={handleExcelExport}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Báo cáo không có file đính kèm
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Báo cáo này không có file Excel đính kèm. Bạn chỉ có thể cập nhật thông tin báo cáo ở trên.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {excelFilePath && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Hướng dẫn:</strong> Chỉnh sửa dữ liệu trong bảng trên, sau đó click <strong>"Cập nhật báo cáo"</strong> để lưu vào hệ thống. 
                  Nút <strong>"Tải xuống Excel"</strong> chỉ để tải file xuống máy tính (tùy chọn).
                </p>
              </div>
            )}
            {!excelFilePath && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Lưu ý:</strong> Báo cáo này không có file Excel đính kèm. Bạn chỉ có thể cập nhật thông tin báo cáo.
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleUpdateReport}
                disabled={isUpdating}
                className="px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Lưu báo cáo vào hệ thống"
              >
                {isUpdating ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    Cập nhật báo cáo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditReport;

