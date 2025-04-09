import React, { startTransition, useState, useRef, useEffect } from 'react';
import { FaHome, FaSearch, FaBell, FaGlobe } from 'react-icons/fa';
import { BsFillChatTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import PopupMenu from '../PopupMenu';
import { useMusic } from '../../context/MusicContext';
import "../../index.css";
import { useApi } from '../../context/ApiContext';
const AppBar = () => {
    const { user } = useApi();
    const [isLogin, setIsLogin] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {isShowChatList, setIsShowChatList} = useMusic();
    const avatarRef = useRef(null);
    const navigate = useNavigate();
    const handleSearch = () => {

        // const results = [];

        // // Tìm kiếm trong radios
        // if (radios) {
        //     radios.forEach((radio) => {
        //         if (radio.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        //             results.push({ type: 'radio', ...radio });
        //         }
        //     });
        // }

        // // Tìm kiếm trong albums
        // if (albums) {
        //     albums.forEach((album) => {
        //         if (album.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        //             results.push({ type: 'album', ...album });
        //         }
        //     });
        // }

        // // Tìm kiếm trong artists
        // if (artists) {
        //     artists.forEach((artist) => {
        //         if (artist.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        //             results.push({ type: 'artist', ...artist });
        //         }
        //     });
        // }

        // // Tìm kiếm trong podcasts
        // if (podcasts) {
        //     podcasts.forEach((podcast) => {
        //         if (podcast.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        //             results.push({ type: 'podcast', ...podcast });
        //         }
        //     });
        // }

        // setSearchResults(results);


    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        navigate(`/search?value=${encodeURIComponent(event.target.value.trim())}`);
    };

    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter') {
    //         handleSearch();
    //     }
    // };

    const handleClickOutside = (event) => {
        if (avatarRef.current && !avatarRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleShowChatRealtime = () => {
        setIsShowChatList(!isShowChatList);
    }
    return (
        <div>
            <div className=" p-3 flex justify-between items-center text-white ">
                {/* Logo + Home */}
                <div className="flex items-center gap-3 ">
                    <img src="/logoSpotify.png" alt="Spotify" className="w-10 h-10" />
                    <button className="p-2 rounded-full bg-[var(--light-gray1)] hover:bg-gray-700" onClick={() => { setSearchTerm(""); navigate("/"); }}>
                        <FaHome className="text-white w-5 h-5 cursor-pointer" />
                    </button>
                    <div className="relative overflow-hidden w-[300px] h-[25px]" >
                        <div className="top-0 absolute overflow-hidden h-[30px] w-[200%]" style={{animation: 'marquee 5s linear infinite'}}>
                        <span style={{float: 'left', width: '50%'}}>
                        {
                            localStorage.getItem('user') ? user.id && `Xin chào, ${user.name}` :'Hôm nay, bạn muốn nghe gì?'
                        }
                        </span>
                        <span style={{float: 'left', width: '50%'}}>
                        {
                            localStorage.getItem('user') ? user.id && `Xin chào, ${user.name}` :'Hôm nay, bạn muốn nghe gì?'
                        }
                        </span>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Bạn muốn nghe gì?"
                            className=" h-[200%] bg-[var(--light-gray1)] text-white p-2 rounded-full w-96 focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                            value={searchTerm}
                            onClick={() => navigate(`/search?value=${encodeURIComponent(searchTerm.trim())}`)}
                            onChange={handleInputChange}
                        />
                        <FaSearch className="absolute left-0 top-0 translate-x-[100%] translate-y-[75%] text-[var(--light-gray3)]" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* <button className=" text-black px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-500 to-pink-500">Khám phá Premium</button> */}
                    <FaGlobe className='cursor-pointer w-5 h-5' />
                    {localStorage.getItem('user') ? user.id &&
                        <>
                            <BsFillChatTextFill className="text-white cursor-pointer w-5 h-5" onClick={() => handleShowChatRealtime()} />
                            <PopupMenu role={user.role} />
                        </> :
                        <>
                            <div
                                className="bg-gradient-to-r from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC] text-white text-[15px] px-5 p-2 rounded-3xl hidden md:block cursor-pointer hover:scale-105"
                                onClick={() => {
                                    startTransition(() => {
                                        navigate("/sign-in");
                                    });
                                }}
                            >
                                Đăng nhập
                            </div>
                            <div
                                className="text-gray-300 text-[15px] px-5 p-2 rounded-3xl hidden md:block cursor-pointer hover:text-white hover:scale-110"
                                onClick={() => {
                                    startTransition(() => {
                                        navigate("/sign-up");
                                    });
                                }}
                            >
                                Đăng kí
                            </div>
                        </>}


                </div>
            </div>

            {/* Hiển thị kết quả tìm kiếm */}
            {searchResults.length > 0 && (
                <div className="p-4 bg-black">
                    <h2 className="text-white text-lg font-semibold mb-4">Kết quả tìm kiếm:</h2>
                    <ul>
                        {searchResults.map((result, index) => (
                            <li key={index} className="text-white">
                                {result.type}: {result.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AppBar;