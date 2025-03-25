import React, { useState, useEffect } from 'react';
import { FaPlay, FaHeart, FaPlus } from 'react-icons/fa';
import { FastAverageColor } from "fast-average-color";
import { useParams } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useMusic } from "../../context/MusicContext";
import { useNavigate } from "react-router-dom";


const Album = () => {
  const { generateLinearGradient, fetchAlbumById, loading, transformFormatDate, setLoading, user } = useApi();
  const { SongCard, SongHeader } = useMusic();
  const { id } = useParams(); // Đây là id của album, từ id này gọi api để truyền dữ liệu cho biến album
  const [colorMain, setColorMain] = useState("#ffffff");
  const [backgroundStyle, setBackgroundStyle] = useState("");
  const [album, setAlbum] = useState({});
  const fac = new FastAverageColor();
  const navigate = useNavigate();
  useEffect(() => {
    const loadAlbum = async () => {
      try {

        console.log(id);
        const data = await fetchAlbumById(id);
        setAlbum(data.message[0]); // Cập nhật album

        // Lấy màu chủ đạo sau khi album được tải
        if (data.message[0].image) {
          const color = await fac.getColorAsync(data.message[0].image);
          console.log(color.hex);
          setColorMain(color.hex);
          const bg = generateLinearGradient(color.hex, 0.7, 0.4, 180);
          setBackgroundStyle(bg);
        }
      } catch (error) {
        console.error("Lỗi khi tải album:", error);
      } finally {
        setLoading(false); // Đặt loading thành false khi quá trình tải hoàn tất
      }
    };

    loadAlbum();
  }, [id]); // Chạy lại khi id thay đổi

  return <>
    {!loading ?
      <div className='' >
        <div
          className="text-white flex gap-8 flex-col md:flex-row md:items-center p-5"
          style={{ background: backgroundStyle }} // Đã cập nhật đúng màu sau khi get
        >
          <img className="w-48 h-48 rounded" src={album.image} alt={album.name} />
          <div className="flex flex-col justify-center">
            <p>Album</p>
            <h1 className="text-5xl font-bold mb-4 md:text-7xl">{album.name}</h1>
            <p className="mt-1 flex items-center text-gray-400 text-sm">
              <span className='"w-fit flex cursor-pointer hover:text-white' onClick={()=>navigate(`/artist/${album.artist_id}`)}>
              <img className="w-5 rounded-full" src={album.image} alt="Spotify Logo" />
              <b className="pl-2">{album.artist_data?.name} • </b>
              </span>
              
              <b className="pl-2">{transformFormatDate(album.release_date)} •</b>
              <b className="pl-2">{album.songs_data?.length} bài hát</b>
            </p>
          </div>
        </div>
        <div className='pb-10'
          style={{ background: backgroundStyle }}
        >
          <div className="flex items-center mx-5 w-[15%] justify-between py-10">
            <button className="bg-green-500 px-6 py-3 rounded-full mr-4 flex items-center cursor-pointer flex gap-2">
              <FaPlay className="mr-2" /> Play
            </button>
            <button className="text-gray-400 flex items-center cursor-pointer">
              <FaHeart 
                className="mr-2 text-2xl" 
                color={user.liked_albums_data?.find(item => item.id === id) ? "red" : "gray"}
              />
            </button>
          </div>

          <ul>
            <SongHeader />
            {album.songs_data?.map((track, index) => (
              <>

                <SongCard key={index} song={track} index={index} />

              </>


            ))}
          </ul>
        </div>

      </div> :
      <div className='loader-container min-h-[50vh]'>
        <span className="loader">&nbsp;</span>
      </div>
    }
  </>
};

export default Album;
