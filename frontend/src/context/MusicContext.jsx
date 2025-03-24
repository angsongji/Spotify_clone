import React, { useRef, createContext, useState, useContext, useEffect } from 'react';
import { useApi } from "./ApiContext";
const MusicContext = createContext();


export const MusicProvider = ({ children }) => {
    const { fetchSongs } = useApi();
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
            setSongsQueue,
            setMusicIndex,
            formatTime,
            handleMuteClick,
            handleVolumeChange,
            togglePlay,
            changeMusic,
            setIsPlaying
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);