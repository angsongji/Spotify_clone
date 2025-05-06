import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import SongHeader from "../../components/user/SongHeader";
import SongCard from "../../components/user/SongCard";
import { useSelector } from "react-redux";
import { usePlayerMusic } from '../../context/PlayerMusicContext';
import { useParams } from "react-router-dom";
import { RiPlayList2Fill } from "react-icons/ri";
import { HiDotsHorizontal } from "react-icons/hi";
import { Dropdown, Menu, message } from 'antd';
import { addPlaylist } from "../../services/musicService";
const Playlist = () => {
    const { playlistId } = useParams();
    const user = useSelector(state => state.user.user);
    const [playlist, setPlaylist] = useState({});
    const { handleListenListSong } = usePlayerMusic();
    useEffect(() => {
        const filter = user.playlists_data.find(item => item.id == playlistId);
        setPlaylist(filter || {});
    }, [playlistId])
    const handleMenuClick = (e) => {
        message.info(`Bạn đã chọn mục ${e.key}`);
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">
                Xóa danh sách phát
            </Menu.Item>
            <Menu.Item key="2">
                Đổi tên
            </Menu.Item>
        </Menu>
    );

    return <>

        <div className='bg-gradient-to-tl from-stone-900 to-neutral-700' >
            <div
                className="text-white flex gap-8 flex-col md:flex-row md:items-center p-5 "

            >
                <div key={playlist.id} className="flex items-center justify-center w-48 h-48 bg-gradient-to-r from-[#DBE6F6] to-[#636FA4] relative">
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
                        <RiPlayList2Fill className="w-[50%] h-[50%] text-white" />
                    </div>
                </div>
                <div className="flex flex-col justify-end  gap-3 h-48">
                    <p className='!m-0'>Danh sách phát</p>
                    <h1 className="text-5xl font-bold  md:text-7xl p-0  !m-0">{playlist.name}</h1>

                    <span className='"w-fit flex items-center gap-2 text-gray-400 text-sm' >
                        <span>{user.name}</span>
                        <span>•</span>
                        <span>{playlist.release_date}</span>
                    </span>

                </div>
            </div>
            <div className='pb-10'
            >


                <ul>
                    {playlist.songs_data?.length != 0 ?
                        <>
                            <div className="flex items-center mx-5 gap-5 py-10">
                                <button onClick={() => { handleListenListSong(playlist.songs_data) }} className="bg-green-500 px-6 py-3 rounded-full mr-4 items-center cursor-pointer flex gap-2">
                                    <FaPlay className="mr-2" /> Play
                                </button>
                                <span className='cursor-pointer underline'>
                                    <Dropdown overlay={menu} trigger={['click']}>

                                        <HiDotsHorizontal className="text-2xl text-gray-300" />

                                    </Dropdown></span>
                            </div>
                            <SongHeader />
                            {playlist.songs_data?.map((track, index) => (
                                <>
                                    {
                                        track.status != 0 && <SongCard key={index} song={track} index={index} />
                                    }
                                </>


                            ))}
                        </> : <div className='m-5 text-white'>Danh sách phát chưa có bài hát nào!</div>

                    }

                </ul>
            </div>

        </div>
    </>
};

export default Playlist;
