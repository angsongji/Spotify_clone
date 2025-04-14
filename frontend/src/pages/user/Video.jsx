import { useLocation } from "react-router-dom";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import "../../index.css";
import { CiCircleRemove } from "react-icons/ci";
import { useMusic } from "../../context/MusicContext";
import { useState } from "react";
const Video = () => {
    const {
        isPlaying,
        togglePlay,
        isPlayingVideo,
        setIsPlayingVideo,
        currentSong
    } = useMusic();
    const [song, setSong] = useState(currentSong);
    const VideoPlayer = ({ src }) => (
        <div className="w-[40vw] h-auto aspect-video flex items-center justify-center">
            <Plyr
                source={{
                    type: 'video',
                    sources: [
                        {
                            src,
                            type: 'video/mp4',
                        },
                    ],
                }}
                options={{
                    controls: [
                        'rewind',
                        'play',
                        'fast-forward',
                        'progress',
                        'current-time',
                        'mute',
                        'volume',
                        'fullscreen',
                    ],
                    autoplay: true,
                    preload: 'metadata', // 👈 Giảm lỗi load và cache
                }}
            />
        </div>
    );
    return (
        <div>
            {song ? (
                <div
                    className='z-1 absolute top-0 left-0 w-screen h-screen bg-black/80 flex flex-col items-center justify-center ' >

                    <div className="self-end translate-x-[-10vw] cursor-pointer slide-down"
                        onClick={() => {
                            if (isPlaying) {
                                togglePlay();
                            }
                            setIsPlayingVideo(false);
                        }}
                    >
                        <CiCircleRemove className="text-[var(--light-gray3)] text-4xl" />
                    </div>
                    <div className="slide-down rounded-lg flex bg-gradient-to-br from-black/70 via-[var(--main-green)] to-black/20 h-fit gap-2 p-5">
                        <div className=" w-[30vw] flex flex-col justify-between">
                            <div className=" text-base  text-white">Bạn đang xem video</div>
                            <div className="flex flex-col gap-5 items-center py-5 ">
                                <img loading="lazy" src={song.image} alt="" className="h-25 w-25 rounded-sm object-cover transition-transform duration-500" />

                                <div className="flex flex-col gap-2">
                                    <div className="text-2xl font-bold text-white">{song.name}</div>
                                    <div className=" text-base text-[var(--light-gray2)]">{song.artists_data.map(artist => artist.name).join(", ")}</div>

                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <img loading="lazy" src={song.artists_data[0].avatar} alt="" className="h-8 w-8 rounded-full object-cover transition-transform duration-500" />
                                <div className="text-xs text-white font-bold">{song.artists_data[0].name}</div>
                            </div>
                        </div>

                        <VideoPlayer src={song?.video_url} />


                    </div>
                </div>

            ) : (
                <div>Bài hát không có video</div>
            )}
        </div>
    );
}


export default Video;
