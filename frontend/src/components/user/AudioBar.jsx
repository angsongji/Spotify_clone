import { useState, useRef, useEffect } from "react";
import { FaPlay, FaRandom } from "react-icons/fa";
import { IoMdPause, IoMdDownload } from "react-icons/io";
import { MdSkipNext, MdSkipPrevious, MdOutlineOndemandVideo } from "react-icons/md";
import { SlLoop } from "react-icons/sl";
import { FiPlusCircle } from "react-icons/fi";
import { GoMute, GoUnmute } from "react-icons/go";
import { } from "react-icons/io";
import { useMusic } from "../../context/MusicContext";
import "../../index.css";



export default function AudioBar() {
    const {
        audioRef,
        isPlaying,
        changeMusic,
        formatTime,
        isMuted,
        currentTime,
        volume,
        currentSong,
        togglePlay,
        progressRef,
        handleMuteClick,
        handleVolumeChange,
        musicIndex
    } = useMusic();


    return (<>
        {
            musicIndex == -1 ? <div className="fixed bottom-0 h-fit bg-gradient-to-r from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]  text-white w-full py-3 px-4 m-1">
                Chọn bài hát bạn muốn nghe!
            </div> :
                <div className="fixed bottom-0 h-fit bg-black flex items-center justify-between text-white w-full py-3 px-4">
                    <div className="flex items-center gap-4 w-[30vw] h-full">
                        <img
                            className={`shadow-sm shadow-gray-300 h-15 w-15 rounded-full object-cover transition-transform duration-500 ${isPlaying ? "slow-spin" : "rotate-0"
                                }`}
                            src={currentSong?.image}
                            alt="Song Thumbnail"
                        />
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold">{currentSong?.name}</div>
                            <div className="text-sm text-gray-400">
                                {/* {currentSong ? currentSong.artists_data[0].name : "Artist Name"} */}
                                {currentSong.artists_data?.map((item) => item.name).join(", ")}
                            </div>
                        </div>
                        <FiPlusCircle className="text-gray-500 hover:text-white cursor-pointer" size={20} />
                        <audio className="hidden" ref={audioRef} controls />
                    </div>



                    {/* Tiến trình phát nhạc, nút chuyển, lùi, play */}
                    <div className="flex flex-1  items-center  text-whiterounded-lg shadow-lg ">
                        <div className="w-2/3">
                            <div className="flex items-center gap-4 justify-center">
                                <button className="w-6 h-6 flex justify-center items-center cursor-pointer">
                                    <FaRandom size={18} />
                                </button>
                                <button className="cursor-pointer" onClick={() => changeMusic(-1)}><MdSkipPrevious size={24} /></button>
                                <button onClick={togglePlay} className="text-[var(--main-green)] cursor-pointer">
                                    {isPlaying ? <IoMdPause size={22} /> : <FaPlay size={22} />}
                                </button>
                                <button className="cursor-pointer" onClick={() => changeMusic(1)}><MdSkipNext size={24} /></button>
                                <button className="w-6 h-6 flex justify-center items-center cursor-pointer">
                                    <SlLoop size={18} />
                                </button>
                            </div>
                            <div className="flex gap-2 w-full items-center my-1">
                                <span>{formatTime(currentTime)}</span>
                                <div className="w-full bg-gray-900 h-1 rounded  relative cursor-pointer" onClick={(e) => {
                                    const width = e.currentTarget.clientWidth;
                                    const clickX = e.nativeEvent.offsetX;
                                    audioRef.current.currentTime = (clickX / width) * audioRef.current.duration;
                                }}>
                                    {
                                        currentSong.price !== 0 ? <div className="w-[10%] h-2 border-r-2" style={{ width: `calc(${(30 / currentSong.duration) * 100}%)` }}>
                                            <div ref={progressRef} className="bg-white  h-1 rounded" style={{ width: "0%" }}></div>
                                        </div> : <div ref={progressRef} className="bg-white  h-1 rounded" style={{ width: "0%" }}></div>
                                    }


                                </div>
                                <span>{formatTime(currentSong.duration)}</span>
                            </div>
                        </div>


                    </div>



                    <div className="hidden lg:flex items-center gap-2 opacity-75 text-xl">
                        <IoMdDownload className="cursor-pointer" />
                        < MdOutlineOndemandVideo className="cursor-pointer" />
                        {isMuted ? (
                            <GoMute onClick={handleMuteClick} className="cursor-pointer" />
                        ) : (
                            <GoUnmute onClick={handleMuteClick} className="cursor-pointer" />
                        )}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className="w-20 bg-white h-1 rounded cursor-pointer"
                        />
                    </div>
                </div>
        }


    </>

    );
}
