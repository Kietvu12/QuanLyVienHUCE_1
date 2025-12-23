import { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import React from 'react';
const ActivityReportForm = ({ reportInfo, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    // I. KHÁI QUÁT VỀ HOẠT ĐỘNG CỦA VIỆN
    section1: {
      // 1.1 Nhân lực
      personnel: {
        totalStaff: '',
        seniorStaff: '',
        juniorStaff: '',
        details: '',
      },
      // 1.2 Cơ sở vật chất
      facilities: {
        address: '',
        totalArea: '',
      },
      // 1.3 Lĩnh vực hoạt động chủ yếu
      mainActivities: '',
    },
    // II. TÌNH HÌNH THỰC HIỆN VÀ KẾT QUẢ HOẠT ĐỘNG KH&CN-LSX NĂM 2024
    section2: {
      // 2.1 Hoạt động khoa học công nghệ
      scientificActivities: '',
      // 2.2 Hoạt động đào tạo
      trainingActivities: '',
      // 2.3 Hoạt động tư vấn, chuyển giao công nghệ
      consultingActivities: '',
      // 2.4 Đầu tư cơ sở vật chất
      facilityInvestment: '',
    },
    // III. KẾ HOẠCH THỰC HIỆN NĂM 2025 VÀ ĐỀ XUẤT, KIẾN NGHỊ
    section3: {
      // 3.1 Kế hoạch hoạt động KH&CN-LSX năm 2025
      plan2025: '',
      // 3.2 Đề xuất và kiến nghị
      proposals: '',
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        ...reportInfo,
        formData,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* I. KHÁI QUÁT VỀ HOẠT ĐỘNG CỦA VIỆN */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          I. KHÁI QUÁT VỀ HOẠT ĐỘNG CỦA VIỆN
        </h2>

        {/* 1.1 Nhân lực */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            1.1 Nhân lực
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng cán bộ lãnh đạo viện chức của Trường <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.section1.personnel.totalStaff}
                onChange={(e) =>
                  handleNestedChange('section1', 'personnel', 'totalStaff', e.target.value)
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng cán bộ kỹ hợp đang lao động <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.section1.personnel.seniorStaff}
                onChange={(e) =>
                  handleNestedChange('section1', 'personnel', 'seniorStaff', e.target.value)
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng cán bộ kỹ hợp đang khác <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.section1.personnel.juniorStaff}
                onChange={(e) =>
                  handleNestedChange('section1', 'personnel', 'juniorStaff', e.target.value)
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chi tiết (kê khai theo phụ lục 1)
            </label>
            <textarea
              value={formData.section1.personnel.details}
              onChange={(e) =>
                handleNestedChange('section1', 'personnel', 'details', e.target.value)
              }
              rows={3}
              placeholder="Nhập chi tiết về nhân lực..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 1.2 Cơ sở vật chất */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            1.2 Cơ sở vật chất
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ văn phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.section1.facilities.address}
                onChange={(e) =>
                  handleNestedChange('section1', 'facilities', 'address', e.target.value)
                }
                placeholder="VD: P901 Nhà Thư Nghiệm"
                className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tổng diện tích sử dụng (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.section1.facilities.totalArea}
                onChange={(e) =>
                  handleNestedChange('section1', 'facilities', 'totalArea', e.target.value)
                }
                placeholder="VD: 130m²"
                className="w-full h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 1.3 Lĩnh vực hoạt động chủ yếu */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            1.3 Lĩnh vực hoạt động chủ yếu
          </h3>
          <textarea
            value={formData.section1.mainActivities}
            onChange={(e) => handleChange('section1', 'mainActivities', e.target.value)}
            rows={4}
            placeholder="VD: Lập trình phần mềm, Đào tạo các phần mềm Xây dựng..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* II. TÌNH HÌNH THỰC HIỆN VÀ KẾT QUẢ HOẠT ĐỘNG KH&CN-LSX NĂM 2024 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          II. TÌNH HÌNH THỰC HIỆN VÀ KẾT QUẢ HOẠT ĐỘNG KH&CN-LSX NĂM {reportInfo.year || '2024'}
        </h2>

        {/* 2.1 Hoạt động khoa học công nghệ */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            2.1 Hoạt động khoa học công nghệ
          </h3>
          <textarea
            value={formData.section2.scientificActivities}
            onChange={(e) => handleChange('section2', 'scientificActivities', e.target.value)}
            rows={5}
            placeholder="Viện tiếp tục thực hiện các đề tài nghiên cứu với Bộ khoa học và công nghệ..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 2.2 Hoạt động đào tạo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            2.2 Hoạt động đào tạo
          </h3>
          <textarea
            value={formData.section2.trainingActivities}
            onChange={(e) => handleChange('section2', 'trainingActivities', e.target.value)}
            rows={5}
            placeholder="Viện triển khai khai đào tạo các khóa học và phần mềm xây dựng nâng cao được tay nghề cho các kỹ sư, sinh viên chuyên ngành..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 2.3 Hoạt động tư vấn, chuyển giao công nghệ */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            2.3 Hoạt động tư vấn, chuyển giao công nghệ
          </h3>
          <textarea
            value={formData.section2.consultingActivities}
            onChange={(e) => handleChange('section2', 'consultingActivities', e.target.value)}
            rows={5}
            placeholder="Viện triển khai khai đào tạo các khóa học và phần mềm xây dựng nâng cao được tay nghề cho các kỹ sư, sinh viên chuyên ngành..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 2.4 Đầu tư cơ sở vật chất */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            2.4 Đầu tư cơ sở vật chất
          </h3>
          <textarea
            value={formData.section2.facilityInvestment}
            onChange={(e) => handleChange('section2', 'facilityInvestment', e.target.value)}
            rows={5}
            placeholder="Trong năm qua Viện còn đầu tư thêm máy tính, bàn ghế phục vụ và tất cả công tác giảng dạy và làm việc..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* III. KẾ HOẠCH THỰC HIỆN NĂM 2025 VÀ ĐỀ XUẤT, KIẾN NGHỊ */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          III. KẾ HOẠCH THỰC HIỆN NĂM {parseInt(reportInfo.year || '2024') + 1} VÀ ĐỀ XUẤT, KIẾN NGHỊ
        </h2>

        {/* 3.1 Kế hoạch hoạt động KH&CN-LSX năm 2025 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            3.1 Kế hoạch hoạt động KH&CN-LSX năm {parseInt(reportInfo.year || '2024') + 1}
          </h3>
          <textarea
            value={formData.section3.plan2025}
            onChange={(e) => handleChange('section3', 'plan2025', e.target.value)}
            rows={5}
            placeholder="Tiếp tục triển khai, phát triển các hoạt động Khoa học và công nghệ, hoạt động đào tạo, không ngừng nâng cao trình độ độ..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 3.2 Đề xuất và kiến nghị */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            3.2 Đề xuất và kiến nghị
          </h3>
          <textarea
            value={formData.section3.proposals}
            onChange={(e) => handleChange('section3', 'proposals', e.target.value)}
            rows={5}
            placeholder="Nhập đề xuất và kiến nghị..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FaSave className="w-4 h-4" />
          Lưu báo cáo
        </button>
      </div>
    </form>
  );
};

export default ActivityReportForm;

