import React, { useRef, createContext, useState, useContext, useEffect } from 'react';
import { useApi } from "./ApiContext";
import { FiPlusCircle } from "react-icons/fi";
import { BiTime } from 'react-icons/bi';
import { message } from "antd";
const MusicContext = createContext();


export const MusicProvider = ({ children }) => {
    const { fetchSongs, transformToDurationString, user } = useApi();
    const [musicIndex, setMusicIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSong, setCurrentSong] = useState({});
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [songsQueue, setSongsQueue] = useState([]);
    const progressRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const loadSongs = async () => {
            const data = await fetchSongs();
            setSongsQueue(data.message);
        };
        loadSongs();
    }, [])

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        // Đảm bảo audio có nguồn phát

        audio.addEventListener("timeupdate", updateProgressBar);
        audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
        audio.addEventListener("ended", () => changeMusic(1));

        return () => {
            audio.addEventListener("timeupdate", updateProgressBar);
            audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
            audio.addEventListener("ended", () => changeMusic(1));
        };
    }, [musicIndex]); // Khi musicIndex thay đổi, cập nhật sự kiện
    useEffect(() => {
        setCurrentSong({ ...songsQueue[musicIndex] });
        if (!audioRef.current || !songsQueue[musicIndex]) return;
        if (songsQueue[musicIndex].price === 0) {
            audioRef.current.src = songsQueue[musicIndex].file_url;
            console.log("preview");
        } else {
            audioRef.current.src = songsQueue[musicIndex].preview_url;
            console.log("full");
        }


        if (isPlaying) {
            audioRef.current.play();
        }




    }, [musicIndex]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;

    }, [volume]);


    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const changeMusic = (direction) => {
        if (songsQueue.length === 0) return; // Kiểm tra tránh lỗi chia 0
        setMusicIndex((prevIndex) => (prevIndex + direction + songsQueue.length) % songsQueue.length);
    };


    const updateProgressBar = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
        const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        if (progressRef.current) progressRef.current.style.width = `${progressPercent}%`;
    };



    const handleMuteClick = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? volume : 0;
        }
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };


    const formatTime = (time) => {
        if (!time) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    function handleClickSong(id) {
        if (!user || !user.id) {
            message.error("Vui lòng đăng nhập để nghe bài hát")
            return;
        }
        songsQueue.forEach((item, index) => {
            if (item.id === id) {
                setMusicIndex(index);
                setIsPlaying(true);
            }
        });
    }

    const SongCard = ({ song, index }) => {

        return (
            <li
                className="cursor-pointer h-15 w-full flex justify-between items-center py-2 px-5  hover:bg-[var(--dark-gray)]"
                onClick={() => handleClickSong(song.id)}
            >
                <div className="flex items-center text-white gap-3 w-3/5"
                    style={currentSong.id === song.id ? { color: "var(--main-green)", fontSize: "18px", fontWeight: "bold" } : {}}
                >
                    <span className='w-5 h-5 flex items-center justify-center'>
                        <span className="text-[var(--light-gray3)] ">
                            {index + 1}
                        </span>
                    </span>

                    <img
                        src={song.image}
                        alt="Album Cover"
                        className="w-10 h-10 object-cover aspect-square rounded-sm"
                    />
                    <div className='flex gap-5'>
                        <span>{song.name}</span>
                        {song.price !== 0 && <span className='bg-[var(--main-green)] text-black text-xs h-fit w-fit p-1 rounded-sm'>{song.price}</span>}
                    </div>
                </div>
                <div className="flex-1 text-xs text-gray-400 ">{song.artists_data?.map((item) => item.name).join(", ")}</div>
                <div className="flex items-center gap-5 w-fit">
                    <span className="text-gray-400">{transformToDurationString(song.duration)}</span>
                    <span className='w-5 h-5 flex items-center justify-center'>
                        <FiPlusCircle className=" w-4 h-4 cursor-pointer text-gray-400  hover:text-white" />
                    </span>
                </div>
            </li>
        );
    };

    const SongHeader = () => {
        return (
            <div className="h-15 w-full flex justify-between items-center py-2 px-5 text-sm text-gray-400 ">
                <div className="flex items-center gap-5 w-3/5">
                    <div className="text-center">#</div>
                    <div className=''>Tiêu đề</div>
                </div>

                <div className='flex-1'>Nghệ sĩ</div>
                <div className="flex justify-start w-17">
                    <BiTime className="w-5 h-5" />
                </div>
            </div>
        );
    };
    return (
        <MusicContext.Provider value={{
            musicIndex,
            isPlaying,
            currentTime,
            currentSong,
            duration,
            audioRef,
            progressRef,
            isMuted,
            volume,
            songsQueue,
            SongHeader,
            setSongsQueue,
            setMusicIndex,
            formatTime,
            handleMuteClick,
            handleVolumeChange,
            togglePlay,
            changeMusic,
            setIsPlaying,
            handleClickSong,
            SongCard
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);