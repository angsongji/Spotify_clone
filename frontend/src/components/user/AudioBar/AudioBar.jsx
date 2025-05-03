import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { lazy } from "react";
import { FaPlay, FaRandom } from "react-icons/fa";
import { IoMdPause, IoMdDownload } from "react-icons/io";
import { MdSkipNext, MdSkipPrevious, MdOutlineOndemandVideo } from "react-icons/md";
import { SlLoop } from "react-icons/sl";
import { FiPlusCircle } from "react-icons/fi";
import { GoMute, GoUnmute } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { setIsPlayingVideo } from '../../../redux/slices/musicSlice';
import { usePlayerMusic } from "../../../context/PlayerMusicContext";
import ProgressBar from './ProgressBar';
const Video = lazy(() => import('../../../pages/user/Video'));




export default function AudioBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentSong = useSelector((state) => state.music.currentSong);
    const isPlaying = useSelector((state) => state.music.isPlaying);
    const musicIndex = useSelector((state) => state.music.musicIndex);
    const isPlayingVideo = useSelector((state) => state.music.isPlayingVideo);
    const { audioRef,
        handleChangeMusic,
        togglePlay,
        handleMuteClick,
        handleVolumeChange,

        isMuted,
        volume } = usePlayerMusic();




    const handleDownload = async () => {
        try {
            message.loading({ content: "Đang tải video...", key: "download" });

            const response = await fetch(currentSong.video_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            const fileName = currentSong.name.trim().split(" ").join("-") + "-video.mp4";
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            message.success({ content: "Đã tải xong!", key: "download", duration: 2 });
        } catch (error) {
            console.error("Lỗi khi tải video:", error);
            message.error({ content: "Tải thất bại!", key: "download", duration: 2 });
        }
    };
    return (<>
        {
            localStorage.getItem('user') ? (
                musicIndex == -1 ? <div className="flex justify-between items-center fixed bottom-0 h-fit bg-gradient-to-r from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]  text-white w-full py-5 px-4 m-1">
                    Chọn bài hát bạn muốn nghe!
                </div> : <div>
                    {isPlayingVideo && <Video />}
                    <div className="fixed bottom-0  w-full">

                        {
                            currentSong?.price != 0 && <div className="bg-[var(--main-green)] text-[var(--light-gray2)] p-2 text-sm font-bold"> <span className="underline cursor-pointer" onClick={() => navigate("/premium")}>Đăng ký Premium</span> để tận hưởng trọn bài hát, và xem video âm nhạc của bài hát</div>
                        }
                        <div className=" bg-black flex  items-center justify-between text-white py-3  px-4">

                            <div className="flex items-center gap-4 w-[30vw] h-full">
                                <img loading="lazy"
                                    className={`shadow-sm shadow-gray-300 h-15 w-15 rounded-full object-cover transition-transform duration-500 ${isPlaying ? "slow-spin" : "rotate-0"
                                        }`}
                                    src={currentSong?.image}
                                    alt="Song Thumbnail"
                                />
                                <div className="flex flex-col gap-2">
                                    <div className="font-semibold cursor-pointer hover:underline" onClick={() => navigate(`/song/${currentSong?.id}`)}>{currentSong?.name}</div>
                                    <div className="text-xs text-gray-400">
                                        <div className="flex-1 text-xs text-gray-400">
                                            {currentSong.artists_data?.map((item, index) => (
                                                <span key={item.id} className="cursor-pointer hover:text-gray-300" onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn click lan ra div bao ngoài
                                                    navigate(`/artist/${item.id}`);
                                                }}>
                                                    {item.name}{index < currentSong.artists_data.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <audio className="hidden" ref={audioRef} controls />
                            </div>



                            {/* Tiến trình phát nhạc, nút chuyển, lùi, play */}
                            <div className="flex flex-1  items-center  text-whiterounded-lg shadow-lg ">
                                <div className="w-2/3">
                                    <div className="flex items-center gap-4 justify-center">
                                        <button className="w-6 h-6 flex justify-center items-center cursor-pointer">
                                            <FaRandom size={16} />
                                        </button>
                                        <button className="cursor-pointer" onClick={() => handleChangeMusic(-1)}><MdSkipPrevious size={22} /></button>
                                        <button onClick={togglePlay} className="flex justify-center items-center !text-black cursor-pointer bg-white w-[2.2rem] h-[2.2rem]  rounded-full">
                                            {isPlaying ? <IoMdPause size={21} /> : <FaPlay size={16} className="ml-[2px]" />}
                                        </button>
                                        <button className="cursor-pointer" onClick={() => handleChangeMusic(1)}><MdSkipNext size={22} /></button>
                                        <button className="w-6 h-6 flex justify-center items-center cursor-pointer">
                                            <SlLoop size={16} />
                                        </button>
                                    </div>
                                    <ProgressBar />
                                </div>


                            </div>



                            <div className="hidden lg:flex items-center gap-2 opacity-75 text-xl">


                                {
                                    currentSong.video_url && (currentSong.price == 0 ?
                                        <>
                                            <IoMdDownload className="cursor-pointer" onClick={handleDownload} />
                                            < MdOutlineOndemandVideo className="cursor-pointer"
                                                onClick={() => {
                                                    if (isPlaying) {
                                                        togglePlay();
                                                    }
                                                    dispatch(setIsPlayingVideo(true));
                                                }}
                                            />
                                        </>
                                        :
                                        <>
                                            <IoMdDownload className="cursor-not-allowed" />
                                            < MdOutlineOndemandVideo className="cursor-not-allowed" />
                                        </>
                                    )
                                }
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
                    </div>
                </div >
            ) : <div className="flex justify-between items-center fixed bottom-0 h-fit bg-gradient-to-r from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]  text-white w-full py-5 px-4 m-1">
                <div>Đăng ký để tận hưởng âm nhạc, video và các tiện ích khác!</div>
                <div onClick={() => navigate("/sign-up")} className="cursor-pointer bg-white text-black text-base font-bold py-2 px-4 rounded-full w-fit">Đăng kí ngay</div>
            </div>




        }


    </>

    );
}
