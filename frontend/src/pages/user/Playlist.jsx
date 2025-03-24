import { useParams } from "react-router-dom";
const Playlist = () => {
    const { playlistId } = useParams();
    return <>
        <h1 className="text-gray-500">Trang chi tiết playlistId của người dùng: {playlistId}</h1>
        <h1>Trang này hiển thị các bài hát có trong playlist: xem tham khảo giao diện ở https://open.spotify.com/playlist/37i9dQZEVXbsaAZhFYusrE</h1>
        <h1>Thiết kế thêm nút để chỉnh sửa playlist: đổi tên playlist, xóa bài hát khỏi playlist</h1>
        <h1>Nút bấm để thêm mới playlist ở SideBar.jsx, người nào nhận SideBar.jsx code xong thì ông gắn sự kiện tạo playlist ở nút đó</h1>
    </>
}

export default Playlist;