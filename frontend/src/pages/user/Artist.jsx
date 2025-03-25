import React, { useState, useEffect } from 'react';
import { FaPlay, FaPlus } from 'react-icons/fa';
import { FastAverageColor } from "fast-average-color";
import { useParams, useNavigate } from "react-router-dom";
import "../../index.css";
import { useApi } from "../../context/ApiContext";
import { useMusic } from "../../context/MusicContext";

// const artist = {
//   id: "1",
//   name: "Obito",
//   avatar: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//   albums: [
//     {
//       id: "album1",
//       name: "Sky Tour",
//       releaseDate: "2020-06-07",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//     {
//       id: "album2",
//       name: "M-TP M-TP",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//     {
//       id: "album2",
//       name: "M-TP M-TP",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//     {
//       id: "album2",
//       name: "M-TP M-TP",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//     {
//       id: "album2",
//       name: "M-TP M-TP",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//     {
//       id: "album2",
//       name: "M-TP M-TP",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//   ],
//   songs: [
//     {
//       id: "track1",
//       name: "Chạy Ngay Đi",
//       duration: "3:50",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//     {
//       id: "track2",
//       name: "Hãy Trao Cho Anh",
//       duration: "4:10",
//       releaseDate: "2017-12-12",
//       image: "https://i.scdn.co/image/ab67616d00001e02a06a6b51d0dc296d48505ee6",
//     },
//   ],
// };

const Artist = () => {
  const { generateLinearGradient, fetchArtistById, loading, transformFormatDate, setLoading } = useApi();
  const { SongCard } = useMusic();
  const navigate = useNavigate();
  const { id } = useParams(); // Đây là id của album, từ id này gọi api để truyền dữ liệu cho biến album
  const [colorMain, setColorMain] = useState("#ffffff");
  const [backgroundStyle, setBackgroundStyle] = useState("#2A2A2A");
  const [artist, setArtist] = useState({});
  //Mảng album này là dữ liệu test thôi, lúc sau sẽ là từ id album gọi api lên để lấy dữ lệu album
  const fac = new FastAverageColor();
  useEffect(() => {
    const loadArtist = async () => {
      try {
        const data = await fetchArtistById(id);
        setArtist(data.message[0]); // Cập nhật album

        // Lấy màu chủ đạo sau khi album được tải
        if (data.message[0].avatar) {
          const color = await fac.getColorAsync(data.message[0].avatar);
          console.log("Màu " + color.hex);
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
      <button className="text-gray-400 hover:text-white transition cursor-pointer text-sm">Show all</button>
    </div>
  );



  const AlbumCard = ({ album }) => {
    return (
      <div
        onClick={() => navigate(`/album/${album.id}`)}
        className=" w-40 h-fit  rounded-lg hover:scale-105 cursor-pointer flex flex-col"
      >
        <img
          src={album.image}
          alt={album.name}
          className="w-full h-auto object-cover aspect-square rounded-sm"
        />

        {/* Bọc phần nội dung text để canh lề trái */}
        <div className="w-full mt-2">
          <h3 className="text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {album.name}
          </h3>

          <p className="text-gray-400 text-sm">{transformFormatDate(album.release_date)}</p>
        </div>
      </div>


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
            <img className="w-48 h-48 rounded-full object-cover" src={artist.avatar} alt={artist.name} />
            <div className="flex flex-col justify-center">
              <p>Artist</p>
              <h1 className="text-5xl font-bold mb-4 md:text-7xl">{artist.name}</h1>
              <p className="mt-1 flex items-center text-gray-400 text-sm">
                <b className="pl-2">{artist.albums_data?.length} album • </b>
                <b className="pl-2">{artist.songs_data?.length} bài hát</b>
              </p>
            </div>
          </div>

          <div className='px-5 flex flex-col gap-20'>

            <div className='flex flex-col gap-5'>
              <button className="bg-green-500 px-6 py-3 rounded-full  flex items-center cursor-pointer w-fit flex gap-2">
                <FaPlay className="" /> Play
              </button>
              <div>
                <SectionTitle title="Phố biến" />
                <ul>
                  {artist.songs_data?.map((song, index) => (
                    <SongCard key={index} song={song} index={index} />
                  ))}
                </ul>
              </div>

            </div>
            <div>
              <SectionTitle title="Danh sách Album" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {artist.albums_data?.map((album, index) => (
                  <AlbumCard key={index} album={album} />
                ))}
              </div>
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