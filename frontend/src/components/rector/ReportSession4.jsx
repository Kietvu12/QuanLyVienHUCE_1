import { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload, FaChartLine, FaClock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { baoCaoAPI } from '../../services/api';
import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getActionLabel = (trang_thai, ngay_gui) => {
  if (trang_thai === 'da_phe_duyet') return 'Đã duyệt';
  if (trang_thai === 'cho_phe_duyet' && ngay_gui) return 'Đã gửi';
  if (trang_thai === 'cho_phe_duyet') return 'Chờ duyệt';
  if (trang_thai === 'tu_choi') return 'Từ chối';
  return 'Chưa xác định';
};

const getReportType = (tieu_de) => {
  if (!tieu_de) return 'Báo cáo';
  const title = tieu_de.toLowerCase();
  if (title.includes('doanh thu') || title.includes('thu')) return 'Báo cáo doanh thu';
  if (title.includes('đề tài') || title.includes('nghiên cứu')) return 'Báo cáo đề tài';
  if (title.includes('nhân sự') || title.includes('nhân viên')) return 'Báo cáo nhân sự';
  if (title.includes('tài sản')) return 'Báo cáo tài sản';
  if (title.includes('tài chính') || title.includes('bctc')) return 'Báo cáo tài chính';
  return 'Báo cáo';
};

const getActionColor = (action) => {
  switch (action) {
    case 'Đã duyệt':
      return 'bg-emerald-100 text-emerald-800';
    case 'Đã gửi':
      return 'bg-blue-100 text-blue-800';
    case 'Chờ duyệt':
      return 'bg-yellow-100 text-yellow-800';
    case 'Từ chối':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReportSession4 = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    totalDownloads: 0,
    completionRate: 0,
    processing: 0,
    choPheDuyet: 0,
    tuChoi: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const params = {
          id_vien: user.id_vien || undefined,
          id_nguoi_tao: user.id,
          limit: 1000,
        };

        const response = await baoCaoAPI.getAll(params);
        
        if (response.success) {
          const reports = response.data || [];
          
          // Sắp xếp theo ngày tạo mới nhất
          const sortedReports = [...reports].sort((a, b) => {
            return new Date(b.ngay_tao) - new Date(a.ngay_tao);
          });

          // Lấy 5 báo cáo gần nhất
          const recent = sortedReports.slice(0, 5).map(report => ({
            id: report.id,
            name: report.tieu_de,
            type: getReportType(report.tieu_de),
            user: report.nguoiTao?.ho_ten || report.nguoiTao?.username || 'N/A',
            action: getActionLabel(report.trang_thai, report.ngay_gui),
            date: formatDate(report.ngay_tao),
            time: formatTime(report.ngay_tao),
            trang_thai: report.trang_thai,
          }));
          setRecentReports(recent);

          // Tính thống kê
          const stats = {
            total: reports.length,
            totalDownloads: 0, // Chưa có trường này trong DB
            completionRate: reports.length > 0 
              ? Math.round((reports.filter(r => r.trang_thai === 'da_phe_duyet').length / reports.length) * 100)
              : 0,
            processing: reports.filter(r => r.trang_thai === 'cho_phe_duyet').length,
            choPheDuyet: reports.filter(r => r.trang_thai === 'cho_phe_duyet').length,
            tuChoi: reports.filter(r => r.trang_thai === 'tu_choi').length,
          };
          setStatistics(stats);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const statisticsCards = [
    {
      label: 'Báo cáo đã tạo',
      value: statistics.total.toString(),
      icon: FaFileAlt,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Tổng lượt tải',
      value: statistics.totalDownloads > 0 ? statistics.totalDownloads.toLocaleString() : '-',
      icon: FaDownload,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Tỷ lệ hoàn thành',
      value: `${statistics.completionRate}%`,
      icon: FaChartLine,
      iconBg: 'bg-purple-500',
    },
    {
      label: 'Đang xử lý',
      value: statistics.processing.toString(),
      icon: FaClock,
      iconBg: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <section className="px-6">
        <div className="flex items-center justify-center p-8">
          <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mr-2" />
          <span className="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hoạt động gần đây */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
              <p className="text-sm text-gray-500 mt-1">
                Lịch sử tạo và tải báo cáo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có hoạt động nào
              </div>
            ) : (
              recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(report.action)}`}>
                  <span className="text-xs font-semibold">{report.action.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {report.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {report.type} - {report.user}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{report.date}</p>
                      <p className="text-xs text-gray-400">{report.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {report.action}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Thống kê */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Thống kê</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng quan báo cáo
            </p>
          </div>

          <div className="space-y-4">
            {statisticsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.iconBg} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thông tin bổ sung */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Thông tin quan trọng
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• {statistics.processing} báo cáo đang chờ duyệt</li>
              <li>• {statistics.choPheDuyet} báo cáo chờ phê duyệt</li>
              <li>• Tỷ lệ thành công: {statistics.completionRate}%</li>
            </ul>
          </div>

          {/* Cảnh báo */}
          {statistics.tuChoi > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <FaExclamationTriangle className="w-4 h-4" />
                Cảnh báo
              </h4>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• {statistics.tuChoi} báo cáo bị từ chối cần xử lý</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReportSession4;

