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
    const [objectUrl, setObjectUrl] = useState(null);
    const [currentSong, setCurrentSong] = useState({});
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [songsQueue, setSongsQueue] = useState([]);
    const progressRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [isShowChatList, setIsShowChatList] = useState(false);

    // Effect cho data fetching
    useEffect(() => {
        const loadSongs = async () => {
            const data = await fetchSongs();
            setSongsQueue(data.message);
        };
        loadSongs();
    }, []);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, []);

    // Gắn listener cho audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const current = audio.currentTime;

            if (currentSong?.price !== 0 && current >= 30) {
                audio.pause();
                audio.currentTime = 0;
                changeMusic(1);
                return;
            }

            updateProgressBar();
        };


        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => changeMusic(1);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [musicIndex, currentSong]);

    // Fetch blob từ URL nhạc
    const fetchUrlAsBlob = async (url) => {
        try {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
                setObjectUrl(null);
            }

            const response = await fetch(url);
            const blob = await response.blob();
            const newObjectUrl = URL.createObjectURL(blob);
            setObjectUrl(newObjectUrl);
            return newObjectUrl;
        } catch (error) {
            console.error('Error fetching audio:', error);
            return null;
        }
    };

    // Load và phát audio khi đổi bài
    useEffect(() => {
        const loadAndPlayAudio = async () => {
            if (!songsQueue[musicIndex]) return;

            setCurrentSong({ ...songsQueue[musicIndex] });

            const audioUrl = songsQueue[musicIndex].file_url;
            const blobUrl = await fetchUrlAsBlob(audioUrl);

            if (!blobUrl || !audioRef.current) return;

            audioRef.current.src = blobUrl;

            if (isPlaying) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (e) {
                    console.error('Playback failed:', e);
                    setIsPlaying(false);
                }
            }
        };

        loadAndPlayAudio();
    }, [musicIndex]);

    // Điều chỉnh âm lượng
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Play / Pause
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((e) => {
                console.error("Playback failed:", e);
                setIsPlaying(false);
            });
    };

    // Chuyển bài
    const changeMusic = (direction) => {
        if (songsQueue.length === 0) return;
        setMusicIndex((prevIndex) => (prevIndex + direction + songsQueue.length) % songsQueue.length);
    };

    // Cập nhật progress bar
    const updateProgressBar = () => {
        if (!audioRef.current) return;

        const current = audioRef.current.currentTime;
        const fullDuration = audioRef.current.duration;

        const limit = currentSong?.price !== 0 ? 30 : fullDuration;
        setCurrentTime(current);
        setDuration(limit); // để đồng bộ thời gian bên phải nếu cần

        const progressPercent = (current / limit) * 100;
        if (progressRef.current) {
            progressRef.current.style.width = `${Math.min(progressPercent, 100)}%`;
        }
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
            <>
                {
                    song.status == 1 && <li
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
                                {song.price !== 0 && <span className='bg-[var(--main-green)] text-black text-xs h-fit w-fit p-1 rounded-sm'>Premium</span>}
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
                }
            </>
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
            SongCard,
            isPlayingVideo,
            setIsPlayingVideo,
            isShowChatList,
            setIsShowChatList
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);