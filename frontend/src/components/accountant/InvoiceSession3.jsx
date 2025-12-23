import { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaDownload, FaFileImage, FaTimes, FaUpload, FaTrashAlt } from 'react-icons/fa';
import React from 'react'
const invoices = [
  {
    id: 'HD-2025-001',
    invoiceNumber: 'INV-2025-001',
    customer: 'Công ty ABC',
    amount: 50000000,
    date: '15/12/2025',
    dueDate: '30/12/2025',
    status: 'Đã thanh toán',
    createdBy: 'Nguyễn Văn A',
    description: 'Dịch vụ tư vấn kỹ thuật',
    documents: ['invoice_001.jpg', 'invoice_001.pdf'],
  },
  {
    id: 'HD-2025-002',
    invoiceNumber: 'INV-2025-002',
    customer: 'Công ty XYZ',
    amount: 75000000,
    date: '14/12/2025',
    dueDate: '29/12/2025',
    status: 'Chờ thanh toán',
    createdBy: 'Trần Thị B',
    description: 'Phần mềm quản lý dự án',
    documents: ['invoice_002.pdf'],
  },
  {
    id: 'HD-2025-003',
    invoiceNumber: 'INV-2025-003',
    customer: 'Công ty DEF',
    amount: 120000000,
    date: '13/12/2025',
    dueDate: '28/12/2025',
    status: 'Đã thanh toán',
    createdBy: 'Lê Văn C',
    description: 'Hợp đồng bảo trì hệ thống',
    documents: ['invoice_003.jpg', 'invoice_003_scan.pdf'],
  },
  {
    id: 'HD-2025-004',
    invoiceNumber: 'INV-2025-004',
    customer: 'Công ty GHI',
    amount: 35000000,
    date: '12/12/2025',
    dueDate: '27/12/2025',
    status: 'Chờ thanh toán',
    createdBy: 'Phạm Thị D',
    description: 'Đào tạo phần mềm',
    documents: [],
  },
  {
    id: 'HD-2025-005',
    invoiceNumber: 'INV-2025-005',
    customer: 'Công ty JKL',
    amount: 90000000,
    date: '11/12/2025',
    dueDate: '26/12/2025',
    status: 'Đã hủy',
    createdBy: 'Hoàng Văn E',
    description: 'Tư vấn thiết kế',
    documents: ['invoice_005.pdf'],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Đã thanh toán':
      return 'bg-emerald-100 text-emerald-800';
    case 'Chờ thanh toán':
      return 'bg-yellow-100 text-yellow-800';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
};

const InvoiceSession3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '',
    customer: '',
    amount: '',
    date: '',
    dueDate: '',
    description: '',
    status: 'Chờ thanh toán',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleInputChange = (field, value) => {
    setInvoiceForm({ ...invoiceForm, [field]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Invoice data:', invoiceForm);
    console.log('Uploaded files:', uploadedFiles);
    // TODO: Gọi API để tạo hóa đơn
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInvoiceForm({
      invoiceNumber: '',
      customer: '',
      amount: '',
      date: '',
      dueDate: '',
      description: '',
      status: 'Chờ thanh toán',
    });
    setUploadedFiles([]);
  };

  return (
    <section className="px-6">
      <div className="rounded-2xl bg-white shadow-sm px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Danh sách hóa đơn</h3>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý hóa đơn và chứng từ
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Tạo hóa đơn mới
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm số hóa đơn, khách hàng, mô tả..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số hóa đơn
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hạn thanh toán
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tài liệu
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-blue-600">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900">{invoice.customer}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{invoice.description}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{invoice.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{invoice.dueDate}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {invoice.documents.length > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <FaFileImage className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600">{invoice.documents.length}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem chi tiết">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Tải xuống">
                        <FaDownload className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors" title="Chỉnh sửa">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị 1-5 của 245 kết quả
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal tạo hóa đơn */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tạo hóa đơn mới</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Điền thông tin và tải lên tài liệu hóa đơn
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {/* Thông tin hóa đơn */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số hóa đơn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      placeholder="VD: INV-2025-001"
                      className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.customer}
                      onChange={(e) => handleInputChange('customer', e.target.value)}
                      placeholder="Tên khách hàng"
                      className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="VD: 50000000"
                      className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={invoiceForm.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Chờ thanh toán">Chờ thanh toán</option>
                      <option value="Đã thanh toán">Đã thanh toán</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={invoiceForm.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hạn thanh toán <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={invoiceForm.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={invoiceForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả về hóa đơn..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Upload tài liệu */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tài liệu hóa đơn (Ảnh/Tài liệu) <span className="text-red-500">*</span>
                  </label>
                  {uploadedFiles.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="invoice-files"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="invoice-files"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                          <FaUpload className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Tải lên ảnh/tài liệu hóa đơn
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG (tối đa 10MB mỗi file)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                              <FaFileImage className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id="invoice-files-add"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="invoice-files-add"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaPlus className="w-5 h-5 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            Thêm file khác
                          </p>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Tạo hóa đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default InvoiceSession3;

