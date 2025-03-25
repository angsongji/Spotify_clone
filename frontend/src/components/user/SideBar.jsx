import React from "react";
import { FaSearch, FaPlus, FaList, FaHeart } from "react-icons/fa";
import { HiLibrary } from "react-icons/hi";
import { LuLibrary } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import "../../index.css"



const SideBar = () => {
    const navigate = useNavigate();
    const { user } = useApi();

    const NoneUser = () => (
        <div className="flex flex-col gap-4 p-5 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-lg">
            <h2 className="text-white font-bold text-base">Tạo danh sách và tận hưởng âm nhạc của riêng bạn!</h2>
            <p className="text-sm text-white">Để thực hiện điều này, yêu cầu bạn đăng nhập.</p>
            <button className="self-center bg-white text-black cursor-pointer text-sm font-bold py-2 px-4 rounded-full hover:scale-105 w-fit"
                onClick={() => navigate("/sign-in")}
            >
                Đăng nhập
            </button>
        </div>
    );

    const PlaylistCard = ({ playlist }) => (
        <div className="flex items-center gap-3 cursor-pointer hover:border-r hover:border-r-white"
            onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-b from-red-300 to-pink-600">
                <FaHeart className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center h-full gap-1">
                <div className="text-white font-bold">{playlist.name}</div>
                <div className="text-gray-400 text-sm">
                    Của tôi • {playlist.songs && playlist.songs !== "[]" ? playlist.songs.length : 0} songs
                </div>
            </div>
        </div>
    );

    const FavoriteAlbumCard = ({ album }) => (
        <div className="flex items-center gap-3 cursor-pointer hover:border-r hover:border-r-white"
            onClick={() => navigate(`/album/${album.id}`)}
        >
            <img src={album.image} className="w-12 h-12 rounded-md" />
            <div className="flex flex-col justify-center h-full gap-1">
                <div className="text-white font-bold">{album.name}</div>
                <div className="text-gray-400 text-sm">Album • {album.artist_data.name} • {album.release_date.split("-")[0]}</div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full p-4 flex flex-col text-[var(--light-gray3)] text-base">
            {/* Your Library */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <LuLibrary className="w-5 h-5" />
                    <div className="text-base font-bold">Thư viện</div>
                </div>
                <button>
                    <FaPlus className="w-5 h-5 cursor-pointer" />
                </button>
            </div>
            
            { !user || !user.id ? (
                <NoneUser />
            ) : (
                <>
                    {/* Tìm kiếm và sắp xếp */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-1 rounded-md mb-4 w-[80%]">
                        <FaSearch className="w-5 h-5 text-white" />
                        <input
                            type="text"
                            placeholder="Tìm trong thư viện"
                            className="bg-transparent outline-none text-white w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        {user.playlists_data.map(playlist => (
                            <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))}
                        {user.liked_albums_data.map(album => (
                            <FavoriteAlbumCard key={album.id} album={album} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SideBar;
