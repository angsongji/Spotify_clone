import React, { createContext, useContext, useState } from "react";
import { FaPlay, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
// Tạo context
const ApiContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export const ApiProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const fetchData = async (endpoint, options = {}) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🌟 Các hàm gọi API cụ thể 🌟
    const fetchSongs = async () => fetchData("songs");
    const fetchAlbums = async () => fetchData("albums");
    const fetchAlbumById = async (id) => fetchData(`albums/filter/?id=${id}`);
    const fetchSongById = async (id) => fetchData(`songs/${id}`);
    const fetchArtist = async () => fetchData("artists");
    const fetchArtistById = async (id) => fetchData(`artists/filter/?id=${id}`);
    const fetchCategories = async () => fetchData("categories");

    const transformToDurationString = (n) => {
        let minute = Math.floor(n / 60);
        let second = n % 60;
        return minute + ":" + second
    }

    const transformFormatDate = (s) => {
        if (s && typeof s === 'string') {  // Kiểm tra s có phải là chuỗi hay không
            let arr = s.split("-");
            return `${arr[2]}/${arr[1]}/${arr[0]}`;  // Định dạng lại thành DD/MM/YYYY
        }
        return '';  // Trả về chuỗi rỗng nếu s không hợp lệ
    };

    const SongCard = ({ song, index }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <li
                className="h-15 w-full flex justify-between items-center py-2 px-5  hover:bg-[var(--dark-gray)]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center text-white gap-3">
                    <span className='w-5 h-5 flex items-center justify-center'>
                        {isHovered ? <FaPlay className=" w-3 h-3 cursor-pointer" /> :
                            <span className="text-[var(--light-gray3)] ">
                                {index + 1}
                            </span>
                        }
                    </span>

                    <img
                        src={song.image}
                        alt="Album Cover"
                        className="w-10 h-10 object-cover aspect-square rounded-sm"
                    />
                    <span className="font-bold cursor-pointer">{song.name}</span>
                </div>
                <div className="text-xs text-gray-400">{song.artists_data?.map((item) => item.name).join(", ")}</div>
                <div className="flex items-center gap-5">
                    <span className="text-gray-400">{transformToDurationString(song.duration)}</span>
                    <span className='w-5 h-5 flex items-center justify-center'>
                        {isHovered ? <FaPlus className=" w-4 h-4 cursor-pointer text-white" /> :
                            <span className="">
                                &nbsp;
                            </span>
                        }
                    </span>
                </div>
            </li>
        );
    };

    const AlbumCard = ({ album }) => {
        const navigate = useNavigate();
        return (
            <div
                onClick={() => navigate(`/album/${album.id}`)}
                className="w-40 bg-[var(--light-gray2)] h-fit p-3 rounded-lg transition-transform transform hover:scale-105 duration-300 cursor-pointer flex flex-col"
            >
                <img
                    src={album.image}
                    alt={album.name}
                    className="w-full h-32 object-cover aspect-square rounded-sm"
                />

                {/* Bọc phần nội dung text để canh lề trái */}
                <div className="w-full mt-2">
                    <h3 className="text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
                        {album.name}
                    </h3>

                    <p className="text-gray-400 text-sm">{album.artist_data.name}</p>
                </div>
            </div>


        );
    };

    function generateLinearGradient(hex, opacityStart = 1, opacityEnd = 0.5, angle = 50) {
        const { r, g, b } = hexToRgb(hex);
        const { r: dr, g: dg, b: db } = darkenColor(r, g, b, 0.8); // Giảm 30% độ sáng

        return `linear-gradient(${angle}deg, 
            rgba(${r}, ${g}, ${b}, ${opacityStart}), 
            rgba(${dr}, ${dg}, ${db}, ${opacityEnd}))`;
    }
    function darkenColor(r, g, b, factor = 0.7) {
        return {
            r: Math.round(r * factor),
            g: Math.round(g * factor),
            b: Math.round(b * factor),
        };
    }

    const hexToRgb = (hex) => {
        hex = hex.replace(/^#/, ''); // Xóa ký tự #

        // Nếu HEX có 3 ký tự, chuyển thành 6 ký tự
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // Kiểm tra nếu HEX không hợp lệ (không đúng 6 ký tự)
        if (hex.length !== 6) {
            throw new Error("Mã màu HEX không hợp lệ");
        }

        // Chuyển đổi HEX sang RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        return { r, g, b };
    };

    let apiFunctions = {
        loading,
        fetchSongs,
        fetchAlbums,
        fetchSongById,
        fetchAlbumById,
        transformToDurationString,
        setLoading,
        transformFormatDate,
        fetchArtist,
        fetchArtistById,
        SongCard,
        generateLinearGradient,
        fetchCategories,
        AlbumCard
    };

    return (
        <ApiContext.Provider value={apiFunctions}>
            {children}
        </ApiContext.Provider>
    );
};

// Hook để sử dụng API context
export const useApi = () => useContext(ApiContext);
