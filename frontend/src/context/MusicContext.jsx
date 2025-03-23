import React, { useRef, createContext, useState, useContext, useEffect } from 'react';
import { useApi } from "./ApiContext";
const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const { fetchSongs } = useApi();
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playStatus, setPlayStatus] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const audio = useRef(null);
    const [songs, setSongs] = useState([]);

    // useEffect để thay đổi nguồn nhạc mỗi khi có bài hát mới hoặc thay đổi playStatus
    useEffect(() => {
        if (currentSong && audio.current) {
            audio.current.src = currentSong.file_url; // Cập nhật nguồn bài hát
            audio.current.load(); // Tải lại bài hát

            // Kiểm tra nếu có thời gian đã lưu trong localStorage
            const savedTime = localStorage.getItem(`song-${currentSong.id}-time`);
            if (savedTime) {
                audio.current.currentTime = parseFloat(savedTime); // Tiếp tục phát từ thời gian lưu
            }

            if (playStatus) {
                audio.current.play(); // Phát bài hát nếu playStatus là true
            } else {
                audio.current.pause(); // Dừng bài hát nếu playStatus là false
            }
        }
    }, [currentSong, playStatus]);

    // Lưu thời gian hiện tại khi người dùng nhấn stop
    const handleStop = () => {
        if (audio.current) {
            localStorage.setItem(`song-${currentSong.id}-time`, audio.current.currentTime); // Lưu thời gian
            audio.current.pause();
            setPlayStatus(false);
        }
    };

    const togglePlay = () => {
        setPlayStatus(prevStatus => {
            const newStatus = !prevStatus;
            if (newStatus && audio.current) {
                audio.current.play(); // Phát bài hát
            } else {
                handleStop(); // Nếu stop, lưu lại thời gian
            }
            return newStatus;
        });
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (audio.current) {
            audio.current.volume = newVolume;
        }
    };

    const handleMuteClick = () => {
        setIsMuted(!isMuted);
        if (audio.current) {
            audio.current.volume = isMuted ? volume : 0;
        }
    };

    return (
        <MusicContext.Provider value={{
            volume,
            isMuted,
            playStatus,
            currentSong,
            audio,
            setCurrentSong,
            togglePlay,
            handleVolumeChange,
            handleMuteClick,
            setPlayStatus
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);