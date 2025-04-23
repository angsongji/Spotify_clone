import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { usePlayerMusic } from "../../context/PlayerMusicContext";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

const handleMenuClick = (e) => {
    message.info(`Bạn đã chọn mục ${e.key}`);
};

const menuMain = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">Thêm vào danh sách phát</Menu.Item>
        <Menu.Item key="2">Yêu thích</Menu.Item>
    </Menu>
);

const menuFavorite = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">Thêm vào danh sách phát</Menu.Item>
        <Menu.Item key="2">Xóa khỏi yêu thích</Menu.Item>
    </Menu>
);

const menuPlaylist = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">Xóa khỏi danh sách phát</Menu.Item>
        <Menu.Item key="2">Thêm vào yêu thích</Menu.Item>
    </Menu>
);

const SongCard = ({ song, index }) => {
    const { handleClickSong, formatTime } = usePlayerMusic();
    const currentSong = useSelector(state => state.music.currentSong);
    const navigate = useNavigate();
    const location = useLocation();
    const [menu, setMenu] = useState(menuMain);  // Default menu

    if (song.status !== 1) return null;

    useEffect(() => {
        // Dynamically update the menu based on current location
        const path = location.pathname.split("/")[1]; // Lấy phần đầu tiên của đường dẫn (sau dấu "/")

        switch (path) {
            case "favorite":
                setMenu(menuFavorite);
                break;
            case "playlist":
                setMenu(menuPlaylist);
                break;
            default:
                setMenu(menuMain);
                break;
        }
    }, [location.pathname]);  // Re-run effect whenever location changes

    return (
        <li className="h-15 w-full flex justify-between items-center py-2 px-5 hover:bg-[var(--dark-gray)]">
            <div
                className="flex items-center text-white gap-3 w-3/5"
                style={
                    currentSong?.id === song.id
                        ? { color: "var(--main-green)", fontSize: "18px", fontWeight: "bold" }
                        : {}
                }
            >
                <span className="w-5 h-5 flex items-center justify-center">
                    <span className="text-[var(--light-gray3)]">{index + 1}</span>
                </span>

                <img
                    src={song.image}
                    alt="Album Cover"
                    className="w-10 h-10 object-cover aspect-square rounded-sm"
                />

                <div className="flex gap-5">
                    <span className="cursor-pointer" onClick={() => { handleClickSong(song.id); navigate(`/song/${song.id}`); }} >{song.name}</span>
                    {song.price !== 0 && (
                        <span className="bg-[var(--main-green)] text-black text-xs h-fit w-fit p-1 rounded-sm">
                            Premium
                        </span>
                    )}
                </div>
            </div>
            <div className="flex-1 text-xs text-gray-400">
                {song.artists_data?.map((item, index) => (
                    <span key={item.id} className="cursor-pointer hover:text-white" onClick={(e) => {
                        e.stopPropagation(); // Ngăn click lan ra div bao ngoài
                        navigate(`/artist/${item.id}`);
                    }}>
                        {item.name}{index < song.artists_data.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-5 w-fit">
                <span className="text-gray-400">{formatTime(song.duration)}</span>
                <span className="w-5 h-5 flex items-center justify-center">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <HiDotsHorizontal className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white" />
                    </Dropdown>
                </span>
            </div>
        </li>
    );
};

export default SongCard;
