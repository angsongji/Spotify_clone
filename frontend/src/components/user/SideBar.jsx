import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaHeart } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { HiX } from "react-icons/hi";
import { LuLibrary } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { addPlaylist, fetchCategories } from "../../services/musicService";
import { Dropdown, Menu, message } from 'antd';
import { setUser } from '../../redux/slices/userSlice';

const SideBar = () => {
    const [isFull, setIsFull] = useState(false);
    const [isShowFormAdd, setShowFormAdd] = useState(false);
    const [isShowFormAddByCategories, setShowFormAddByCategories] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);
    const songs = useSelector(state => state.music.songs);
    const handleMenuClick = (e) => {
        switch (e.key) {
            case "1": setShowFormAdd(true); break;
            case "2": setShowFormAddByCategories(true); break;
        }
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">Thêm danh sách phát trống</Menu.Item>
            <Menu.Item key="2">Thêm danh sách phát theo thể loại</Menu.Item>
        </Menu>
    );

    const FullView = () => (
        <div className="w-full h-full flex flex-col text-[var(--light-gray3)] text-base">
            {/* Your Library */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <LuLibrary className="w-5 h-5" />
                    <div className="text-base font-bold">Thư viện</div>
                </div>
                <div className="flex items-center gap-2">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <FaPlus className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white" />
                    </Dropdown>

                    <button className=" font-bold cursor-pointer" onClick={() => setIsFull(false)}>
                        <HiMiniArrowLeft className="text-2xl transition-transform duration-300 ease-in-out hover:-translate-x-1" />

                    </button>
                </div>

            </div>

            {!localStorage.getItem('user') ? (
                <NoneUser />
            ) : user?.id && <div className="h-full">
                <div className="flex items-center gap-3 bg-[var(--light-gray2)] px-2 py-1 rounded-md mb-4 w-full">
                    <FaSearch className="w-5 h-5 text-white" />
                    <input
                        type="text"
                        placeholder="Tìm trong thư viện"
                        className="bg-transparent outline-none text-white w-full"
                    />
                </div>

                <div className="flex flex-col h-[55vh] overflow-y-auto custom-scroll">
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
                (!localStorage.getItem('user')) ? <NoneUser /> : user?.id && <div className="w-fit h-full flex flex-col text-[var(--light-gray3)] text-base ">
                    <div className="flex items-center  justify-center gap-2 cursor-pointer">
                        <div className="text-2xl font-bold" onClick={() => setIsFull(true)}>

                            <HiMiniArrowRight className="text-2xl transition-transform duration-300 ease-in-out hover:translate-x-1" />

                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-5 h-[62vh] overflow-y-auto custom-scroll">
                        <div className="p-2 hover:bg-[var(--light-gray2)] rounded-md cursor-pointer" onClick={() => navigate("/favorite")}>
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
        <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[var(--light-gray2)] rounded-md" onClick={() => navigate("/favorite")}>
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
                <div className="text-gray-400 text-sm">Album • {album.artist_data.name} • {album.release_date.split("-")[2]}</div>
            </div>
        </div>
    );

    const FormAddPlaylist = () => {
        const [namePlaylist, setNamePlaylist] = useState("");
        const handleAddPlaylist = async (e) => {
            e.preventDefault();
            try {
                message.loading({ content: "Đang tạo...", key: "add" });

                const playlistData = {
                    name: namePlaylist,
                    user_id: user.id
                };

                const addPlaylistResponse = await addPlaylist(playlistData);
                console.log(addPlaylistResponse)
                if (addPlaylistResponse.status === 201) {
                    const newUser = { ...user, playlists_data: [...user.playlists_data, addPlaylistResponse.data.message] }
                    dispatch(setUser(newUser));
                    message.success({ content: "Tạo thành công", key: "add", duration: 2 });
                } else {
                    message.error({ content: "Tạo thất bại", key: "add", duration: 2 });

                }
            } catch (error) {
                console.log(error);
            }

        }
        return <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">

            <form onSubmit={handleAddPlaylist} className="py-5 px-3 bg-[var(--dark-gray)] rounded-md shadow-md w-1/4 h-fit flex flex-col gap-5 text-[var(--light-gray3)]">
                <HiX className="text-[var(--light-gray3)] text-2xl cursor-pointer self-end " onClick={() => setShowFormAdd(false)} />
                <div className="flex flex-col gap-5  p-2">
                    <label htmlFor="name">Tên danh sách phát</label>
                    <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="name" type="text" value={namePlaylist} onChange={(e) => setNamePlaylist(e.target.value)} />
                </div>
                <button className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm" type="submit" >Tạo mới</button>
            </form>
        </div>
    }

    const FormAddPlaylistCategories = () => {
        const [loading, setLoading] = useState(true);
        const [categories, setCategories] = useState([]);
        const [selectedCategories, setSelectedCategories] = useState([]);
        const [namePlaylist, setNamePlaylist] = useState("");
        useEffect(() => {
            const loadCategories = async () => {
                try {
                    message.loading({ content: "Đang tải thể loại...", key: "add" });
                    const data = await fetchCategories();
                    setCategories(data.data.message);
                    message.success({ content: "Đã tải xong", key: "add", duration: 2 });
                } catch (error) {
                    console.error("Lỗi khi tải categories:", error);
                    message.success({ content: "Lỗi khi tải thể loại", key: "add", duration: 2 });
                } finally {
                    setLoading(false); // Đặt loading thành false khi quá trình tải hoàn tất
                }
            };

            loadCategories();
        }, []); // Chạy lại khi id thay đổi
        const handleChangeCheckbox = (id) => {
            const exists = selectedCategories.includes(id);
            if (exists) {
                // Bỏ id ra khỏi mảng
                setSelectedCategories((prev) => prev.filter((item) => item !== id));
            } else {
                // Thêm id vào mảng
                setSelectedCategories((prev) => [...prev, id]);
            }
        };
        const handleAddPlaylist = async (e) => {
            e.preventDefault();
            try {
                message.loading({ content: "Đang tạo...", key: "add" });
                const songsFilterIds = songs
                    .filter((item) =>
                        selectedCategories.length === 0 ||
                        item.categories_data.some((category) =>
                            selectedCategories.includes(category.id)
                        )
                    )
                    .map((item) => item.id);

                const playlistData = {
                    name: namePlaylist,
                    user_id: user.id,
                    songs: songsFilterIds
                };
                const addPlaylistResponse = await addPlaylist(playlistData);
                if (addPlaylistResponse.status === 201) {
                    const newUser = { ...user, playlists_data: [...user.playlists_data, addPlaylistResponse.data.message] }
                    dispatch(setUser(newUser));
                    message.success({ content: "Tạo thành công", key: "add", duration: 2 });
                } else {
                    message.error({ content: "Tạo thất bại", key: "add", duration: 2 });

                }
            } catch (error) {
                console.log(error);
            }

        }
        return <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">
            {
                !loading &&
                <form onSubmit={handleAddPlaylist} className="py-5 px-3 bg-[var(--dark-gray)] rounded-md shadow-md h-fit w-50vw flex flex-col gap-5 text-[var(--light-gray3)]">
                    <HiX className="text-[var(--light-gray3)] text-2xl cursor-pointer self-end " onClick={() => setShowFormAddByCategories(false)} />
                    <div className="flex flex-col gap-5  p-2 w-[30vw]">
                        <label htmlFor="name">Tên danh sách phát</label>
                        <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="name" type="text" value={namePlaylist} onChange={(e) => setNamePlaylist(e.target.value)} />


                    </div>
                    <div className="p-2">Chọn thể loại</div>
                    <div className='flex flex-col gap-1 h-[30vh] overflow-y-auto custom-scroll px-2'>

                        {
                            categories.map((item, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(item.id)}
                                        onChange={(e) => {
                                            handleChangeCheckbox(item.id);
                                        }}
                                    />
                                    <span>{item.name}</span>
                                </div>
                            ))
                        }

                    </div>
                    <button className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm" type="submit" >Tạo mới</button>
                </form>

            }
        </div>
    }
    return (
        <div>
            {isFull ? <FullView /> : <CompactView />}
            {isShowFormAdd && <FormAddPlaylist />}
            {isShowFormAddByCategories && <FormAddPlaylistCategories />}
        </div>
    );
};

export default SideBar;
