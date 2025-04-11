import { useState } from "react";
import { FaSearch, FaPlus, FaList, FaHeart } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { LuLibrary } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { HiMiniArrowLeft, HiMiniArrowLongRight, HiMiniArrowRight } from "react-icons/hi2";
import "../../index.css"



const SideBar = () => {
    const [isFull, setIsFull] = useState(false);
    const navigate = useNavigate();
    const { user } = useApi();


    const FullView = () => (
        <div className="w-full h-full flex flex-col text-[var(--light-gray3)] text-base">
            {/* Your Library */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <LuLibrary className="w-5 h-5" />
                    <div className="text-base font-bold">Thư viện</div>
                </div>
                <div className="flex items-center gap-2">
                    <button>
                        <FaPlus className="w-5 h-5 cursor-pointer" />
                    </button>
                    <button className=" font-bold cursor-pointer" onClick={() => setIsFull(false)}>
                        <HiMiniArrowLeft className="text-2xl" />
                    </button>
                </div>

            </div>

            {!localStorage.getItem('user') ? (
                <NoneUser />
            ) : user.id && <div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-1 rounded-md mb-4 w-[80%]">
                    <FaSearch className="w-5 h-5 text-white" />
                    <input
                        type="text"
                        placeholder="Tìm trong thư viện"
                        className="bg-transparent outline-none text-white w-full"
                    />
                </div>

                <div className="flex flex-col ">
                    <LikedSongCard />
                    {user.playlists_data?.map(playlist => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                    {user.liked_albums_data?.map(album => (
                        <FavoriteAlbumCard key={album.id} album={album} />
                    ))}
                </div>
            </div>
            }
        </div>
    )

    const CompactView = () => (
        <>
            {
                (!localStorage.getItem('user')) ? <NoneUser /> : user.id && <div className="w-fit h-full p-2 flex flex-col text-[var(--light-gray3)] text-base ">
                    <div className="flex items-center  justify-center gap-2 cursor-pointer">
                        <div className="text-2xl font-bold" onClick={() => setIsFull(true)}>
                            <HiMiniArrowRight />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-5">
                        <div className="p-2 hover:bg-[var(--light-gray2)] rounded-md cursor-pointer">
                            <div className=" flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-b from-red-300 to-pink-600" >
                                <FaHeart className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {user.playlists_data?.map(playlist => (
                            <div key={playlist.id} className="p-2 hover:bg-[var(--light-gray2)] rounded-md cursor-pointer"
                                onClick={() => navigate(`/playlist/${playlist.id}`)}>
                                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-r from-[#DBE6F6] to-[#636FA4] relative">
                                    <div className="grid grid-cols-2 w-full h-full ">
                                        {playlist.songs_data && playlist.songs_data.slice(0, 4).map((song, index) => (
                                            <img loading="lazy"
                                                key={index}
                                                src={song.image || "https://i.scdn.co/image/ab67616d0000b273c5716278a8f2d7d77d5f5d1e"}
                                                alt={song.name}
                                                className="w-full h-full object-cover "
                                            />
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <RiPlayList2Fill className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {user.liked_albums_data?.map(album => (
                            <div className="p-2 hover:bg-[var(--light-gray2)] rounded-md cursor-pointer"
                                onClick={() => navigate(`/album/${album.id}`)}
                            >
                                <img loading="lazy" key={album.id} src={album.image} className="w-12 h-12 rounded-md" />
                            </div>

                        ))}
                    </div>
                </div>

            }
        </>

    )
    const NoneUser = () => (
        <div className="flex flex-col gap-4 p-5 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-lg w-[22vw]">
            <h2 className="text-white !font-bold text-[17px] ">Muốn tạo danh sách phát và tận hưởng âm nhạc của riêng bạn?</h2>
            <p className="text-sm text-gray-300">Để thực hiện điều này, bạn cần đăng nhập!</p>
            <button className="self-center bg-white text-black cursor-pointer text-sm font-bold py-2 px-4 rounded-full hover:scale-105 w-fit"
                onClick={() => navigate("/sign-in")}
            >
                Đăng nhập
            </button>
        </div>
    );


    const LikedSongCard = () => (
        <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[var(--light-gray2)] rounded-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-b from-red-300 to-pink-600" >
                <FaHeart className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center h-full gap-1">
                <div className="text-white font-bold">Bài hát yêu thích</div>
                <div className="text-gray-400 text-sm">Của tôi • {user?.liked_songs_data.reduce((sum, item) => sum + (item.status !== 0 ? 1 : 0), 0) ?? 0} bài hát</div>
            </div>
        </div>
    )

    const PlaylistCard = ({ playlist }) => (
        <div className=" flex items-center p-2 gap-3 cursor-pointer rounded-md hover:bg-[var(--light-gray2)]"
            onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
            {user.playlists_data.map(playlist => (
                <div key={playlist.id} className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#DBE6F6] to-[#636FA4] relative">
                    <div className="grid grid-cols-2 w-full h-full " >
                        {playlist.songs_data && playlist.songs_data.slice(0, 4).map((song, index) => (
                            <img loading="lazy"
                                key={index}
                                src={song.image || "https://i.scdn.co/image/ab67616d0000b273c5716278a8f2d7d77d5f5d1e"}
                                alt={song.name}
                                className="w-full h-full object-cover "
                            />
                        ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <RiPlayList2Fill className="w-5 h-5 text-white" />
                    </div>
                </div>
            ))}
            <div className="flex flex-col justify-center h-full gap-1">
                <div className="text-white font-bold">{playlist.name}</div>
                <div className="text-gray-400 text-sm">
                    {
                        console.log(playlist.songs_data)
                    }
                    Của tôi • {playlist.songs_data?.reduce((sum, item) => sum + (item.status !== 0 ? 1 : 0), 0) ?? 0} songs
                </div>
            </div>
        </div>
    );

    const FavoriteAlbumCard = ({ album }) => (
        <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[var(--light-gray2)] rounded-md"
            onClick={() => navigate(`/album/${album.id}`)}
        >
            <img loading="lazy" src={album.image} className="w-12 h-12 rounded-md" />
            <div className="flex flex-col justify-center h-full gap-1">
                <div className="text-white font-bold">{album.name}</div>
                <div className="text-gray-400 text-sm">Album • {album.artist_data.name} • {album.release_date.split("-")[0]}</div>
            </div>
        </div>
    );

    return (
        <div>
            {isFull ? <FullView /> : <CompactView />}
        </div>
    );
};

export default SideBar;
