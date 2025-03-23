import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PopupMenu = ({ onClose }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    // Gửi yêu cầu API để đổi mật khẩu
    // ...
    onClose();
  };

  const handleSearch = async () => {
    // Gửi yêu cầu API để tìm kiếm nghệ sĩ
    // ...
    setSearchResults([
      { id: 1, name: 'Nghệ sĩ 1' },
      { id: 2, name: 'Nghệ sĩ 2' },
      // ...
    ]);
  };

  const handleSelectArtist = (artistId) => {
    navigate(`/artist/${artistId}`);
    onClose();
  };

  return (
    <div className="popup-menu">
      {/* Nút đổi mật khẩu */}
      <button onClick={() => setShowChangePassword(true)}>
        Đổi mật khẩu
      </button>

      {/* Form đổi mật khẩu */}
      {showChangePassword && (
        <div className="change-password-form">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Xác nhận</button>
          <button onClick={() => setShowChangePassword(false)}>Hủy</button>
        </div>
      )}

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm nghệ sĩ"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />

      {/* Danh sách kết quả tìm kiếm */}
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((artist) => (
            <li key={artist.id} onClick={() => handleSelectArtist(artist.id)}>
              {artist.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PopupMenu;