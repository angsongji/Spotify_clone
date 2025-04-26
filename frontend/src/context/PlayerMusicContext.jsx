import React, { useRef, createContext, useState, useContext, useEffect } from 'react';
import {
    setMusicIndex,
    setIsPlaying,
    setCurrentSong,
    setSongsQueue
} from '../redux/slices/musicSlice';
import { message } from "antd";
import { useDispatch, useSelector } from 'react-redux';
const PlayerMusicContext = createContext();


export const PlayerMusicProvider = ({ children }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    const userId = useSelector(state => state.user.userId);
    const isPlaying = useSelector(state => state.music.isPlaying);
    const songsQueue = useSelector(state => state.music.songsQueue);
    const currentSong = useSelector(state => state.music.currentSong);
    const musicIndex = useSelector(state => state.music.musicIndex);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isLoadingMusic, setLoadingMusic] = useState(false);
    const audioRef = useRef(null); // Không khởi tạo new Audio() ở đây
    const progressRef = useRef(null);
    const [objectUrl, setObjectUrl] = useState(null);



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
                handleChangeMusic(1);
                return;
            }

            updateProgressBar();
        };



        const handleEnded = () => handleChangeMusic(1);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
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

            const audioUrl = songsQueue[musicIndex].file_url;
            const blobUrl = await fetchUrlAsBlob(audioUrl);

            if (!blobUrl || !audioRef.current) return;

            audioRef.current.src = blobUrl;
            dispatch(setCurrentSong({ ...songsQueue[musicIndex] }));
            if (isPlaying) {
                try {
                    await audioRef.current.play();
                    dispatch(setIsPlaying(true));
                } catch (e) {
                    console.error('Playback failed:', e);
                    dispatch(setIsPlaying(false));
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
            dispatch(setIsPlaying(false));
            return;
        }

        audioRef.current.play()
            .then(() => dispatch(setIsPlaying(true)))
            .catch((e) => {
                console.error("Playback failed:", e);
                dispatch(setIsPlaying(false));
            });
    };

    // Chuyển bài
    const handleChangeMusic = (direction) => {
        if (songsQueue.length === 0) return;

        const newIndex = (musicIndex + direction + songsQueue.length) % songsQueue.length;
        dispatch(setMusicIndex(newIndex));
    };


    // Cập nhật progress bar
    const updateProgressBar = () => {
        if (!audioRef.current) return;

        const current = audioRef.current.currentTime;
        const fullDuration = audioRef.current.duration;

        const limit = currentSong?.price !== 0 ? 30 : fullDuration;

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
        if (!userId || !user) {
            message.error("Vui lòng đăng nhập để nghe bài hát")
            return;
        }
        songsQueue.forEach((item, index) => {
            if (item.id == id) {
                dispatch(setMusicIndex(index));
                dispatch(setIsPlaying(true));
            }
        });
    }

    const handleListenListSong = (list) => {
        // Lọc các bài trong songsQueue không bị trùng với list
        const filtered = songsQueue.filter(
            (newSong) => !list.some((queued) => queued.id === newSong.id)
        );

        const updatedQueue = [...list, ...filtered];

        dispatch(setSongsQueue(updatedQueue));

        if (filtered.length > 0) {
            handleClickSong(filtered[0].id);
        }
    };




    return (
        <PlayerMusicContext.Provider value={{
            audioRef,
            progressRef,
            currentSong,
            isPlaying,
            togglePlay,
            handleChangeMusic,
            handleClickSong,
            formatTime,
            isMuted,
            volume,
            handleMuteClick,
            handleVolumeChange,
            handleListenListSong
        }}>
            {children}
        </PlayerMusicContext.Provider>
    );
};

export const usePlayerMusic = () => useContext(PlayerMusicContext);