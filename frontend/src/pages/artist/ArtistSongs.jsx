import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";

const ArtistSongs = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  //delete
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true); // Mở popup
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Đóng popup
  };

  const handleDeleteSong = () => {
    closeDeleteModal();
  };

  //edit
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = (e) => {
    setIsEditModalOpen(false);
  };

  const handleSave = () => {
    closeEditModal();
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Artist Songs</h1>

      {/* Bảng hiển thị bài hát */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Cover</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-left">Date Release</th>
            <th className="p-3 text-left">Playlist Pitch</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Dòng 1 */}
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">1</td>
            <td className="p-3">
              <img src="SonTung.jpg" alt="Cover" className="w-12 h-12" />
            </td>
            <td className="p-3">Song One</td>
            <td className="p-3">3:45</td>
            <td className="p-3">2023-01-01</td>
            <td className="p-3">Upbeat and energetic</td>
            <td className="p-3">
              <div className="flex item-center gap-3 space-x-2">
                <button
                  onClick={openEditModal}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                >
                  <FaEdit className="" />
                </button>
                <button
                  onClick={openDeleteModal}
                  className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <FaTrash className="" />
                </button>
              </div>
            </td>
          </tr>

          {/* Dòng 2 */}
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">2</td>
            <td className="p-3">
              <img src="NooPhuocThinh.jpg" alt="Cover" className="w-12 h-12" />
            </td>
            <td className="p-3">Song Two</td>
            <td className="p-3">4:20</td>
            <td className="p-3">2023-02-15</td>
            <td className="p-3">Relaxing and chill</td>
            <td className="p-3">
              <div className="flex item-center gap-3 space-x-2">
                <button
                  onClick={openEditModal}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                >
                  <FaEdit className="" />
                </button>
                <button
                  onClick={openDeleteModal}
                  className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <FaTrash className="" />
                </button>
              </div>
            </td>
          </tr>

          {/* Dòng 3 */}
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">3</td>
            <td className="p-3">
              <img src="/JennieSpotify.jpg" alt="Cover" className="w-12 h-12" />
            </td>
            <td className="p-3">Song Three</td>
            <td className="p-3">2:58</td>
            <td className="p-3">2023-03-10</td>
            <td className="p-3">Energetic and fast-paced</td>
            <td className="p-3">
              <div className="flex item-center gap-3 space-x-2">
                <button
                  onClick={openEditModal}
                  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                >
                  <FaEdit className="" />
                </button>
                <button
                  onClick={openDeleteModal}
                  className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <FaTrash className="" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Nút thêm bài hát */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 shadow-lg hover:shadow-xl">
        <span className="text-2xl">+</span>
      </button>

      {/* Popup xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border rounded-lg p-6 w-96">
            <div className="flex justify-end items-center mb-2">
              <button
                onClick={closeDeleteModal}
                className="flex text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Header */}
            <h2 className="text-xl font-semibold text-center mb-4">
              Xác nhận xóa
            </h2>

            {/* Nội dung */}
            <p className="text-gray-700 mb-8">
              Bạn có chắc chắn muốn xóa bài hát{" "}
              <span className="font-semibold"></span> không? Hành động này không
              thể hoàn tác.
            </p>

            {/* Nút hành động */}
            <div className="flex justify-center gap-10 mt-5">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSong}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup chỉnh sửa */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
            {/* Nút đóng */}
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-lg" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa bài hát</h2>

            {/* Tên bài hát */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Tên bài hát</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            {/* Tên album */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Tên album</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>

            {/* Thời lượng */}
            <div className="mb-3">
              <label className="block text-sm font-medium">Thời lượng</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="mm:ss"
              />
            </div>

            {/* Ngày phát hành */}
            <div className="mb-3">
              <label className="block text-sm font-medium">
                Ngày phát hành
              </label>
              <input type="date" className="w-full border rounded p-2" />
            </div>
            {/* Tải file nhạc */}
            <div className="mb-3">
              <label className="block text-sm font-medium">File nhạc</label>
              <input type="file" className="w-full border rounded p-2" />
            </div>
            {/* Ảnh bìa */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Ảnh bìa</label>
              <input type="file" className="w-full border rounded p-2" />
            </div>

            {/* Nút lưu */}
            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Lưu thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistSongs;
