import React, { startTransition, useState, useRef, useEffect } from 'react';
import { FaHome, FaSearch, FaBell, FaGlobe } from 'react-icons/fa';

import { useNavigate } from "react-router-dom";
import PopupMenu from '../PopupMenu';
import "../../index.css";
const AppBar = ({ radios, albums, artists, podcasts }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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

    return (
        <div>
            <div className=" p-4 flex justify-between items-center text-white">
                {/* Logo + Home */}
                <div className="flex items-center gap-3 ">
                    <img src="/logoSpotify.png" alt="Spotify" className="w-12 h-12" />
                    <button className="p-2 rounded-full bg-[var(--light-gray1)] hover:bg-gray-700" onClick={() => { setSearchTerm(""); navigate("/"); }}>
                        <FaHome className="text-white w-7 h-7 cursor-pointer" />
                    </button>
                </div>
                <div className="flex items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Bạn muốn nghe gì?"
                            className="bg-[var(--light-gray1)] text-white p-2 rounded-full w-96 focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                            value={searchTerm}
                            onClick={() => navigate(`/search?value=${encodeURIComponent(searchTerm.trim())}`)}
                            onChange={handleInputChange}
                        />
                        <FaSearch className="absolute left-2 top-0 translate-x-[50%] translate-y-[50%] text-[var(--light-gray3)]" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className=" text-black px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-500 to-pink-500">Khám phá Premium </button>
                    <FaGlobe className='cursor-pointer w-5 h-5' />
                    {isLogin ?
                        <>
                            <FaBell className="text-white cursor-pointer w-5 h-5" />
                            <PopupMenu role={2} />
                        </> :
                        <>
                            <p
                                className="bg-white text-black text-[15px] px-5 p-2 rounded-3xl hidden md:block cursor-pointer hover:scale-105"
                                onClick={() => {
                                    startTransition(() => {
                                        navigate("/sign-in");
                                    });
                                }}
                            >
                                Đăng nhập
                            </p>
                            <p
                                className="text-gray-300 text-[15px] px-5 p-2 rounded-3xl hidden md:block cursor-pointer hover:text-white hover:scale-110"
                                onClick={() => {
                                    startTransition(() => {
                                        navigate("/sign-up");
                                    });
                                }}
                            >
                                Đăng kí
                            </p>
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