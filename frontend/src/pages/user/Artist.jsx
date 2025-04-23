import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { FastAverageColor } from "fast-average-color";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArtistById } from "../../services/musicService";
import { useColorUtils } from "../../hooks/useColorUtils";
import SongHeader from "../../components/user/SongHeader";
import SongCard from "../../components/user/SongCard";
import { usePlayerMusic } from '../../context/PlayerMusicContext';
const Artist = () => {
  const { generateLinearGradient } = useColorUtils();
  const navigate = useNavigate();
  const { id } = useParams(); // Đây là id của album, từ id này gọi api để truyền dữ liệu cho biến album
  const [colorMain, setColorMain] = useState("#ffffff");
  const [backgroundStyle, setBackgroundStyle] = useState("#2A2A2A");
  const [artist, setArtist] = useState({});
  const [loading, setLoading] = useState(false);
  const { handleListenListSong } = usePlayerMusic();
  const fac = new FastAverageColor();
  useEffect(() => {
    const loadArtist = async () => {
      try {
        setLoading(true);
        const data = await fetchArtistById(id);
        setArtist(data.data.message);

        // Lấy màu chủ đạo sau khi album được tải
        if (data.data.message.avatar) {
          const color = await fac.getColorAsync(data.data.message.avatar);
          setColorMain(color.hex);
          const bg = generateLinearGradient(color.hex, 0.7, 0.4, 180);
          setBackgroundStyle(bg);
        }
      } catch (error) {
        console.error("Lỗi khi tải artist:", error);
      } finally {
        setLoading(false); // Đặt loading thành false khi quá trình tải hoàn tất
      }
    };

    loadArtist();
  }, [id]); // Chạy lại khi id thay đổi

  const SectionTitle = ({ title }) => (
    <div className="flex justify-between items-center  mb-5">
      <h2 className="text-white text-2xl font-bold">{title}</h2>
      <button className="!text-gray-400 transition cursor-pointer text-xs">Hiện tất cả</button>
    </div>
  );



  const AlbumCard = ({ album }) => {
    return (
      <>
        {
          album.status == 1 && <div
            onClick={() => navigate(`/album/${album.id}`)}
            className=" w-40 h-fit  rounded-lg hover:scale-105 cursor-pointer flex flex-col"
          >
            <img
              loading="lazy"
              src={album.image}
              alt={album.name}
              className="w-full h-auto object-cover aspect-square rounded-sm"
            />

            {/* Bọc phần nội dung text để canh lề trái */}
            <div className="w-full mt-2">
              <h3 className="text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
                {album.name}
              </h3>

              <p className="text-gray-400 text-sm">{album.release_date}</p>
            </div>
          </div>
        }
      </>


    );
  };
  return <>
    {
      !loading ?
        <div className="pb-10 flex flex-col gap-20 "
          style={{ background: backgroundStyle }} // Đã cập nhật đúng màu sau khi get
        >
          <div
            className="text-white flex gap-8 flex-col md:flex-row md:items-center p-5 pt-10"
            style={{ background: backgroundStyle }} // Đã cập nhật đúng màu sau khi get
          >
            <img loading="lazy" className="w-48 h-48 rounded-full object-cover" src={artist.avatar} alt={artist.name} />
            <div className="flex flex-col justify-end  gap-2 h-48">
              <p className='!m-0'>Artist</p>
              <h1 className="text-5xl font-bold  md:text-8xl p-0  !m-0">{artist.name}</h1>
              <p className="flex items-center text-gray-300 text-sm  !m-0">
                <span className="">
                  {artist.albums_data?.length != 0
                    ? artist.albums_data?.reduce((sum, item) => sum + (item.status !== 0 && item.status !== 3 ? 1 : 0), 0)
                    : 'Chưa có'} album •
                </span>
                <span className="pl-2">
                  {artist.songs_data?.length != 0
                    ? artist.songs_data?.reduce((sum, item) => sum + (item.status !== 0 && item.status !== 3 ? 1 : 0), 0)
                    : 'Chưa có'} bài hát
                </span>
              </p>
            </div>
          </div>

          <div className='px-5 flex flex-col gap-10'>

            <div className='flex flex-col gap-5'>

              <div>
                <button onClick={() => handleListenListSong(artist.songs_data)} className="bg-green-500 px-6 py-3 rounded-full  flex items-center cursor-pointer w-fit flex gap-2">
                  <FaPlay className="" /> Play
                </button>
                <ul>
                  <SongHeader />
                  {artist.songs_data?.map((song, index) => (
                    <>
                      {
                        song.status != 0 && <SongCard key={index} song={song} index={index} />
                      }
                    </>
                  ))}
                </ul>
              </div>

            </div>
            <div>
              {
                artist.albums_data?.length != 0 &&
                <>
                  <SectionTitle title="Danh sách Album" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {artist.albums_data?.map((album, index) => (
                      <>
                        {
                          album.status != 0 && <AlbumCard key={index} album={album} />
                        }
                      </>
                    ))}
                  </div>
                </>
              }

            </div>

          </div>



        </div> :
        <div className='loader-container min-h-[50vh]'>
          <span className="loader">&nbsp;</span>
        </div>
    }
  </>


};

export default Artist;