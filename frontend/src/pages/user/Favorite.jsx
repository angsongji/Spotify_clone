import React, { useState, useEffect } from 'react';
import { FaPlay, FaHeart } from 'react-icons/fa';
import SongHeader from "../../components/user/SongHeader";
import SongCard from "../../components/user/SongCard";
import { useSelector } from "react-redux";
import { usePlayerMusic } from '../../context/PlayerMusicContext';

const Favorite = () => {
    const user = useSelector(state => state.user.user);
    const { handleListenListSong } = usePlayerMusic();


    return <>

        <div className='bg-gradient-to-b from-red-400/20 to-pink-700/70' >
            <div
                className="text-white flex gap-8 flex-col md:flex-row md:items-center p-5"

            >
                <div className="flex items-center justify-center w-48 h-48 rounded-md bg-gradient-to-b from-red-300 to-pink-600" >
                    <FaHeart className="w-[50%] h-[50%] text-white" />
                </div>
                <div className="flex flex-col justify-end  gap-3 h-48">
                    <p className='!m-0'>Yêu thích</p>
                    <h1 className="text-5xl font-bold  md:text-7xl p-0  !m-0">Bài hát đã thích</h1>
                    <p className="flex items-center gap-2 text-gray-400 text-sm  !m-0 ">
                        <span className='"w-fit flex items-center gap-2 text-white' >
                            <span>{user.name}</span>
                        </span>
                    </p>
                </div>
            </div>
            <div className='pb-10'
            >


                <ul>
                    {user.liked_songs_data?.length != 0 ?
                        <>
                            <div className="flex items-center mx-5 w-[15%] justify-between py-10">
                                <button onClick={() => { handleListenListSong(user.liked_songs_data) }} className="bg-green-500 px-6 py-3 rounded-full mr-4 items-center cursor-pointer flex gap-2">
                                    <FaPlay className="mr-2" /> Play
                                </button>
                            </div>
                            <SongHeader />
                            {user.liked_songs_data?.map((track, index) => (
                                <>
                                    {
                                        track.status != 0 && <SongCard key={index} song={track} index={index} />
                                    }
                                </>


                            ))}
                        </> : <div className='m-5 text-white'>Bạn chưa yêu thích bài hát nào!</div>

                    }

                </ul>
            </div>

        </div>
    </>
};

export default Favorite;
