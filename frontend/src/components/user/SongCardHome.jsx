
import React from 'react';
import { usePlayerMusic } from "../../context/PlayerMusicContext";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
const SongCardHome = ({ song }) => {

    const { formatTime, handleClickSong } = usePlayerMusic();
    const currentSong = useSelector(state => state.music.currentSong);
    const isActive = currentSong?.id === song.id;
    const navigate = useNavigate();
    return (
        <div
            className="w-full cursor-pointer flex gap-3 shadow-lg overflow-hidden items-center hover:bg-[var(--light-gray1)] p-2 rounded-sm"
            onClick={() => { handleClickSong(song.id); navigate(`/song/${song.id}`); }}
        >
            <img loading="lazy" src={song.image} alt="Album Cover" className="w-15 h-15 object-cover aspect-square rounded-sm" />
            <div className="text-[var(--light-gray3)] w-full flex flex-col">
                <div className="grid grid-cols-[1fr_auto] items-center">
                    <div className="text-base font-semibold text-white w-full overflow-hidden whitespace-nowrap text-ellipsis"
                        style={isActive ? { color: "var(--main-green)", fontSize: "18px" } : {}}
                    >
                        {song.name}
                    </div>
                    <span className={`${song.price !== 0 ? 'bg-[var(--main-green)]' : 'transparent'} text-black text-xs px-2 py-1 rounded-sm font-semibold`}>
                        {song.price !== 0 ? "Premium" : ""}
                    </span>
                </div>
                <div className="text-xs">
                    {song.artists_data?.map((item, index) => (
                        <span key={item.id} className="cursor-pointer hover:text-white" onClick={(e) => {
                            e.stopPropagation(); // Ngăn click lan ra div bao ngoài
                            navigate(`/artist/${item.id}`);
                        }}>
                            {item.name}{index < song.artists_data.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </div>
                <div className="text-xs mt-1 flex justify-between">
                    <span>{song.date}</span>
                    <span>{formatTime(song.duration)}</span>
                </div>
            </div>
        </div>
    );
};
export default SongCardHome;
