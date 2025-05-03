import React, { useState, useEffect } from 'react';
import { HiDotsHorizontal } from "react-icons/hi";
import { FaPlay } from 'react-icons/fa';
import { FastAverageColor } from "fast-average-color";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useColorUtils } from "../../hooks/useColorUtils";
import { usePlayerMusic } from '../../context/PlayerMusicContext';
import ArtistCard from '../../components/user/ArtistCard';
import { Dropdown, Menu, message } from 'antd';
const handleMenuClick = (e) => {
  message.info(`Bạn đã chọn mục ${e.key}`);
};
const menuMain = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">Thêm vào danh sách phát</Menu.Item>
    <Menu.Item key="2">Yêu thích</Menu.Item>
  </Menu>
);
const Song = () => {
  const songs = useSelector(state => state.music.songs);
  const albums = useSelector(state => state.music.albums);
  const { generateLinearGradient } = useColorUtils();
  const { songId } = useParams(); // Đây là id của song
  const [colorMain, setColorMain] = useState("#ffffff");
  const [backgroundStyle, setBackgroundStyle] = useState("#2A2A2A");
  const fac = new FastAverageColor();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [song, setSong] = useState(true);
  const { handleListenListSong, formatTime } = usePlayerMusic();

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const song = songs.find((item) => item.id == songId)
        setSong(song);

        // Lấy màu chủ đạo sau khi album được tải
        if (song.image) {
          const color = await fac.getColorAsync(song.image);
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
  }, [songId]); // Chạy lại khi id thay đổi





  return <>
    {!loading ?
      <div style={{ background: backgroundStyle }} className='p-5'>
        <div
          className="text-white flex gap-8 flex-col md:flex-row md:items-center "

        >
          <img loading="lazy" className="w-48 h-48 rounded" src={song.image} alt={song.name} />
          <div className="flex flex-col justify-end  gap-3 h-48">
            <p className='!m-0'>Bài hát</p>
            <h1 className="text-5xl font-bold  md:text-7xl p-0  !m-0">{song.name}</h1>
            <p className="flex items-center gap-2 text-gray-400 text-sm  !m-0 ">
              <span className='"w-fit flex items-center cursor-pointer  gap-2' >
                <div className="flex-1 text-xs ">
                  {song.artists_data?.map((item, index) => (
                    <span key={item.id} className="cursor-pointer hover:text-white" onClick={(e) => {
                      e.stopPropagation(); // Ngăn click lan ra div bao ngoài
                      navigate(`/artist/${item.id}`);
                    }}>
                      {item.name}{index < song.artists_data.length - 1 ? '•' : ''}
                    </span>
                  ))}
                </div>
                <span>•</span>

              </span>
              {song.album_id != "" &&
                <span
                  onClick={() => {
                    navigate(`/album/${song.album_id}`);
                  }}
                  className='hover:text-white cursor-pointer'
                >
                  {(albums.find((item) => item.id == song.album_id))?.name} •
                </span>
              }

              <span>{song.date} •</span>
              <span>{formatTime(song.duration)}</span>

            </p>
            <div className='flex gap-3 text-gray-400 text-xs'>
              {
                song.categories_data?.map((item, index) => (
                  <div key={index} className=' border-1 border-gray-500 rounded-full py-0.5 px-5'>{item.name}</div>
                ))
              }
            </div >
          </div>
        </div>
        <div>

        </div>
        <div className='py-5'
        >
          {song ?
            <>
              <div className="flex items-center  gap-5 py-10">
                <button onClick={() => handleListenListSong([song])} className="bg-green-500 px-6 py-3 rounded-full mr-4 flex items-center cursor-pointer flex gap-2">
                  <FaPlay className="mr-2" /> Play
                </button>

                <Dropdown overlay={menuMain} trigger={['click']}>
                  <HiDotsHorizontal className="mr-2 text-2xl text-gray-300 cursor-pointer" />
                </Dropdown>


              </div>
            </> : <div className='m-5 text-white'>Cùng đón chờ những bài hát sắp ra mắt trong album!</div>

          }


        </div>
        <div className='text-gray-400 flex gap-5 flex-col '>
          <div className='font-bold text-xl'>Nghệ sĩ tham gia: </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-5'>
            {
              song.artists_data?.map((artist, index) => (
                <ArtistCard key={index} artist={artist} />
              ))
            }
          </div >
        </div>


      </div> :
      <div className='loader-container min-h-[50vh]'>
        <span className="loader">&nbsp;</span>
      </div>
    }
  </>
};

export default Song;

