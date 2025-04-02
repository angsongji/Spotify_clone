import { useLocation } from "react-router-dom";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import "../../index.css";
import { useMusic } from "../../context/MusicContext";
import { useState } from "react";
const Video = () => {
    const {
        currentSong
    } = useMusic();
    const [song, setSong] = useState(currentSong);
    console.log(song);
    const VideoPlayer = ({ src }) => (
        <div className="w-full max-w-3xl aspect-video ">
            <Plyr
                source={{
                    type: "video",
                    sources: [{ src, type: "video/mp4" }],
                }}

            />
        </div>
    );
    return (
        <div>
            {song ? (
                <div className="flex items-center bg-gradient-to-r from-[#cc2b5e] to-[#753a88]  h-fit flex-col">
                    <div className=" w-2/3 border-b-2 border-[var(--light-gray3)] pb-5">
                        <div className="m-5 text-xl font-bold text-[var(--light-gray2)]">Bạn đang xem video</div>
                        <div className="w-full h-fit flex  gap-2 items-center ml-5">
                            <img src={song.artists_data[0].avatar} alt="" className="h-15 w-15 rounded-full object-cover transition-transform duration-500" />
                            <div>
                                <div className="text-2xl font-bold text-white">{song.name}</div>
                                <div className="mt-1 text-base text-[var(--light-gray3)]">{song.artists_data.map(artist => artist.name).join(", ")}</div>

                            </div>
                        </div>
                    </div>

                    <div className="self-center my-7">
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
