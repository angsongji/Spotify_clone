import React, { startTransition, useState, useRef, useEffect } from 'react';
import { FaHome, FaSearch } from 'react-icons/fa';
import { BsFillChatTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import PopupMenu from '../PopupMenu';
import { RiShining2Fill } from "react-icons/ri";

import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setIsShowChatList } from '../../redux/slices/chatSlice'; // Sử dụng actions từ musicSlice

const AppBar = () => {
    const isShowChatList = useSelector(state => state.music.isShowChatList);
    const songs = useSelector(state => state.music.songs);
    const albums = useSelector(state => state.music.albums);
    const artists = useSelector(state => state.music.artists);
    const user = useSelector(state => state.user.user);
    // const [isLogin, setIsLogin] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        navigate(`/search?value=${encodeURIComponent(event.target.value.trim())}`);
    };
    const handleShowChatRealtime = () => {
        dispatch(setIsShowChatList(!isShowChatList)); // Cập nhật trạng thái hiển thị chat
    };

    const ButtonChatDeepSeek = () => {
        return (
            <button onClick={handleChatAI} className="!absolute right-1 top-1  cursor-pointer py-1 px-2 text-white rounded-2xl flex items-center gap-1 transition duration-300 ease-in-out bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg">
                <RiShining2Fill className="w-5 h-5" />
                <span>AI chat</span>
            </button>
        );
    };

    const handleChatAI = () => {
        if (localStorage.getItem('user')) {
            if (user?.id) navigate("/chatAI")
        } else {
            message.error('Vui lòng đăng nhập để sử dụng tính năng này!');
            return;
        }
    }

    console.log('re render appbar')

    return (
        <div>
            <div className=" p-3 flex justify-between items-center text-white ">
                {/* Logo + Home */}
                <div className="flex items-center gap-3 ">
                    <img loading="lazy" src="/logoSpotify.png" alt="Spotify" className="w-10 h-10" />
                    <button className="p-2 rounded-full bg-[var(--light-gray1)] hover:bg-gray-700" onClick={() => { setSearchTerm(""); navigate("/"); }}>
                        <FaHome className="text-white w-5 h-5 cursor-pointer" />
                    </button>
                    <div className="relative overflow-hidden w-[300px] h-[25px]" >
                        <div className="top-0 absolute overflow-hidden h-[30px] w-[200%]" style={{ animation: 'marquee 5s linear infinite' }}>
                            <span style={{ float: 'left', width: '50%' }}>
                                {
                                    localStorage.getItem('user') ? user?.id && `Xin chào, ${user.name}` : 'Hôm nay, bạn muốn nghe gì?'
                                }
                            </span>
                            <span style={{ float: 'left', width: '50%' }}>
                                {
                                    localStorage.getItem('user') ? user?.id && `Xin chào, ${user.name}` : 'Hôm nay, bạn muốn nghe gì?'
                                }
                            </span>
                        </div>
                    </div>
                </div>

                <div className="">
                    {
                        (artists.length != 0 && songs.length != 0 && albums.length != 0) &&

                        <div className="relative bg-[var(--light-gray1)] rounded-full pr-[5em]">
                            <input
                                type="text"
                                placeholder="Bạn muốn nghe gì?"
                                className=" h-[200%]  text-white p-2 rounded-full w-80 focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                                value={searchTerm}
                                onClick={() => navigate(`/search?value=${encodeURIComponent(searchTerm.trim())}`)}
                                onChange={handleInputChange}
                            />
                            <FaSearch className="absolute left-0 top-0 translate-x-[100%] translate-y-[75%] text-[var(--light-gray3)]" />
                            <ButtonChatDeepSeek className="" />
                        </div>

                    }
                </div>
                <div className="flex items-center gap-2">
                    <div className=' border-white border-r-2'>
                        <button onClick={() => navigate("/premium")} className=" px-4   !text-white !text-sm font-bold  cursor-pointer hover:!text-[var(--main-green)]">Premium</button>
                    </div>
                    {localStorage.getItem('user') ? user?.id &&
                        <>
                            <BsFillChatTextFill className="text-white cursor-pointer w-4 h-4" onClick={() => handleShowChatRealtime()} />
                            <PopupMenu role={user.role} />
                        </> :
                        <>
                            <div
                                className="text-white font-bold text-sm  p-2 rounded-3xl  hidden md:block cursor-pointer hover:text-white hover:scale-110"
                                onClick={() => {
                                    startTransition(() => {
                                        navigate("/sign-up");
                                    });
                                }}
                            >
                                Đăng kí
                            </div>
                            <div
                                className="bg-white text-black  text-sm font-bold px-5 p-2 rounded-3xl hidden md:block cursor-pointer hover:scale-105"
                                onClick={() => {
                                    startTransition(() => {
                                        navigate("/sign-in");
                                    });
                                }}
                            >
                                Đăng nhập
                            </div>

                        </>}


                </div>
            </div>


        </div>
    );
};


export default React.memo(AppBar);

