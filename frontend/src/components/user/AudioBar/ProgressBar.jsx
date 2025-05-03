import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePlayerMusic } from "../../../context/PlayerMusicContext";
export default function ProgressBar() {
    const { audioRef, formatTime, progressRef } = usePlayerMusic();
    const currentSong = useSelector((state) => state.music.currentSong);
    const [time, setTime] = useState(0);
    const duration = currentSong.price === 0 ? currentSong.duration : 30;
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const cur = audio.currentTime;
            setTime(cur);
            const limit = duration;
            const pct = (cur / limit) * 100;
            if (progressRef.current) {
                progressRef.current.style.width = `${Math.min(pct, 100)}%`;
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [audioRef, progressRef, duration]);

    const handleClickProgress = (e) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const limit = currentSong?.price !== 0 ? 30 : audioRef.current.duration;
        const newTime = (clickX / width) * limit;
        audioRef.current.currentTime = Math.min(newTime, limit);
    };

    return (
        <div className="flex gap-2 w-full items-center mt-1 text-sm text-[var(--light-gray3)]">
            <span>{formatTime(time)}</span>
            <div
                className="w-full bg-[var(--light-gray2)] h-1 rounded relative cursor-pointer"
                onClick={handleClickProgress}
            >
                <div
                    ref={progressRef}
                    className="bg-white h-1 rounded"
                    style={{ width: "0%" }}
                ></div>
            </div>
            <span>{formatTime(duration)}</span>
            <audio className="hidden" ref={audioRef} controls />
        </div>
    );
}