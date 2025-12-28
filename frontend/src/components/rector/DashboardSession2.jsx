import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FaTimes } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { nghiaVuNopAPI } from '../../services/api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value || 0) + ' đ';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const DashboardSession2 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tuNgay, setTuNgay] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  });
  const [denNgay, setDenNgay] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [donutData, setDonutData] = useState([
    { name: 'Đã nộp về trường', value: 0, color: '#4F46E5' },
    { name: 'Công nợ còn lại', value: 0, color: '#A5B4FC' },
  ]);
  const [barData, setBarData] = useState([]);
  const [tongNghiaVu, setTongNghiaVu] = useState(0);
  const [tongDaNop, setTongDaNop] = useState(0);
  const [tongCongNo, setTongCongNo] = useState(0);

  // Modal thanh toán công nợ
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [availableNghiaVuNop, setAvailableNghiaVuNop] = useState([]);
  const [debtFormData, setDebtFormData] = useState({
    id_nghia_vu: '',
    so_tien_thanh_toan: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCongNoData();
  }, [user?.id_vien, tuNgay, denNgay]);

  useEffect(() => {
    if (showPaymentModal) {
      fetchAvailableNghiaVuNop();
    }
  }, [showPaymentModal, user?.id_vien]);

  const fetchCongNoData = async () => {
    try {
      setLoading(true);
      const response = await nghiaVuNopAPI.getStatistics({
        id_vien: user?.id_vien,
        tu_ngay: tuNgay,
        den_ngay: denNgay
      });

      if (response.success) {
        const data = response.data;
        const tongNghiaVuPhaiNop = data.tong_nghia_vu_phai_nop || 0;
        const tongDaNopValue = data.tong_da_nop || 0;
        const tongCongNoValue = data.tong_cong_no || 0;

        setTongNghiaVu(tongNghiaVuPhaiNop);
        setTongDaNop(tongDaNopValue);
        setTongCongNo(tongCongNoValue);

        // Cập nhật donut data
        setDonutData([
          { name: 'Đã nộp về trường', value: tongDaNopValue, color: '#4F46E5' },
          { name: 'Công nợ còn lại', value: tongCongNoValue, color: '#A5B4FC' },
        ]);

        // Cập nhật bar data
        if (data.monthly_data) {
          setBarData(data.monthly_data);
        }
      }
    } catch (err) {
      console.error('Error fetching cong no data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableNghiaVuNop = async () => {
    try {
      const response = await nghiaVuNopAPI.getAll({
        id_vien: user?.id_vien,
        trang_thai: 'chua_nop',
        limit: 100
      });
      if (response.success) {
        setAvailableNghiaVuNop(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching nghia vu nop:', err);
    }
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
    setDebtFormData({
      id_nghia_vu: '',
      so_tien_thanh_toan: ''
    });
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setDebtFormData({
      id_nghia_vu: '',
      so_tien_thanh_toan: ''
    });
  };

  const handleDebtSubmit = async (e) => {
    e.preventDefault();
    if (!debtFormData.id_nghia_vu || !debtFormData.so_tien_thanh_toan) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const soTien = parseFloat(debtFormData.so_tien_thanh_toan.replace(/[^\d]/g, ''));
    if (soTien <= 0) {
      alert('Số tiền thanh toán phải lớn hơn 0');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        id_nghia_vu: parseInt(debtFormData.id_nghia_vu),
        so_tien_thanh_toan: soTien,
        id_vien: user?.id_vien
      };

      const response = await nghiaVuNopAPI.thanhToanCongNo(data);
      if (response.success) {
        alert('Thanh toán công nợ thành công!');
        handleClosePaymentModal();
        fetchCongNoData();
        // Dispatch event để các component khác tự động refresh
        window.dispatchEvent(new Event('expenseUpdated'));
      } else {
        alert(response.message || 'Lỗi khi thanh toán công nợ');
      }
    } catch (err) {
      console.error('Error paying debt:', err);
      alert(err.message || 'Lỗi khi thanh toán công nợ');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDonut = donutData.reduce((sum, item) => sum + item.value, 0);
  const formatPercent = (value) =>
    totalDonut > 0 ? Math.round((value / totalDonut) * 100) : 0;

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();
  return (
    <section className="px-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Card 1: Công nợ tháng - Donut chart */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5 flex flex-col lg:flex-row gap-8 relative">
          {/* Bên trái: tiêu đề + filter + legend */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Công nợ tháng {`${currentMonth}/${currentYear}`}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Tính đến ngày {formatDate(denNgay)}
              </p>

              {/* Filter date trên cùng */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  Từ ngày <span className="font-medium text-gray-500">{formatDate(tuNgay)}</span> đến ngày{' '}
                  <span className="font-medium text-gray-500">{formatDate(denNgay)}</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>Từ ngày</span>
                    <input
                      type="date"
                      value={tuNgay}
                      onChange={(e) => setTuNgay(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Đến ngày</span>
                    <input
                      type="date"
                      value={denNgay}
                      onChange={(e) => setDenNgay(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bên phải: biểu đồ donut phóng to + legend dưới chân */}
          <div className="flex items-center justify-center flex-1">
            {loading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Đang tải...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="60%"
                        outerRadius="95%"
                        stroke="none"
                      >
                        {donutData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, _name, props) => {
                          const payload = props?.payload ?? {};
                          const amount = value;
                          const label = payload.name ?? '';
                          const percent = formatPercent(amount);
                          const detail = `${formatCurrency(amount)} (${percent}%)`;
                          return [detail, label];
                        }}
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              {/* Legend dưới chân donut */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                  <span className="text-gray-600">
                    Đã nộp về trường
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A5B4FC]" />
                  <span className="text-gray-600">
                    Công nợ còn lại
                  </span>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Nghĩa vụ, Đã nộp, Công nợ - Góc dưới bên trái */}
          <div className="absolute left-6 bottom-6 bg-white/80 rounded-lg shadow px-4 py-3 text-xs space-y-1 min-w-[180px]">
            <p className="text-gray-600">
              Nghĩa vụ phải nộp:{' '}
              <span className="font-semibold text-gray-900">
                {formatCurrency(tongNghiaVu)}
              </span>
            </p>
            <p className="text-gray-600">
              Đã nộp:{' '}
              <span className="font-semibold text-gray-900">
                {formatCurrency(tongDaNop)}
              </span>
            </p>
            <p className="text-gray-600">
              Công nợ:{' '}
              <span className="font-semibold text-gray-900">
                {formatCurrency(tongCongNo)}
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: Công nợ theo tháng - Bar chart */}
        <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Công nợ theo tháng
              </h3>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {formatCurrency(tongCongNo)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Tính đến ngày {formatDate(denNgay)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenPaymentModal}
              className="px-4 py-1.5 rounded-full border border-[#E5E7EB] text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Thanh toán nhanh
            </button>
          </div>

          <div className="mt-5 h-40">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Đang tải...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ left: -20, right: 0, top: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#D1D5DB' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59,130,246,0.1)' }}
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value) => `${value} triệu đồng`}
                  />
                  <Bar
                    dataKey="nghiaVu"
                    fill="#E5E7EB"
                    radius={[6, 6, 0, 0]}
                    barSize={10}
                  />
                  <Bar
                    dataKey="daNop"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#3B82F6]" />
                <span className="text-gray-500">Nghĩa vụ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#E5E7EB]" />
                <span className="text-gray-500">Đã nộp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thanh toán công nợ */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Thanh toán công nợ</h2>
              <button
                onClick={handleClosePaymentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDebtSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn nghĩa vụ nộp <span className="text-red-500">*</span>
                </label>
                <select
                  value={debtFormData.id_nghia_vu}
                  onChange={(e) => setDebtFormData({ ...debtFormData, id_nghia_vu: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn nghĩa vụ nộp --</option>
                  {availableNghiaVuNop.map((nghiaVu) => {
                    const congNo = nghiaVu.congNo;
                    const congNoAmount = congNo ? parseFloat(congNo.cong_no) : (nghiaVu.so_tien_phai_nop ? parseFloat(nghiaVu.so_tien_phai_nop) : 0);
                    const soTienDaNop = congNo ? parseFloat(congNo.so_tien_da_nop) : 0;
                    return (
                      <option key={nghiaVu.id} value={nghiaVu.id}>
                        Nghĩa vụ #{nghiaVu.id} - Hạn nộp: {formatDate(nghiaVu.han_nop)} - Công nợ: {formatCurrency(congNoAmount)} - Đã nộp: {formatCurrency(soTienDaNop)}
                      </option>
                    );
                  })}
                </select>
                {debtFormData.id_nghia_vu && (() => {
                  const selectedNghiaVu = availableNghiaVuNop.find(nv => nv.id === parseInt(debtFormData.id_nghia_vu));
                  const congNo = selectedNghiaVu?.congNo;
                  const congNoAmount = congNo ? parseFloat(congNo.cong_no) : (selectedNghiaVu?.so_tien_phai_nop ? parseFloat(selectedNghiaVu.so_tien_phai_nop) : 0);
                  return (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Hạn nộp:</strong> {formatDate(selectedNghiaVu?.han_nop)}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Công nợ hiện tại:</strong> <span className="text-red-600 font-semibold">{formatCurrency(congNoAmount)}</span>
                      </p>
                      {congNo && (
                        <p className="text-xs text-gray-600">
                          <strong>Đã nộp:</strong> {formatCurrency(parseFloat(congNo.so_tien_da_nop))}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền thanh toán (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={debtFormData.so_tien_thanh_toan}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setDebtFormData({ ...debtFormData, so_tien_thanh_toan: value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền thanh toán"
                />
                {debtFormData.so_tien_thanh_toan && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Intl.NumberFormat('vi-VN').format(parseFloat(debtFormData.so_tien_thanh_toan) || 0)} đ
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Khi thanh toán công nợ, hệ thống sẽ tự động tạo một phiếu chi tương ứng với trạng thái "Đã tất toán".
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang thanh toán...' : 'Thanh toán công nợ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardSession2;


