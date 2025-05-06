import React, { useState, useEffect } from 'react';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { FastAverageColor } from "fast-average-color";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchAlbumById, updateUser } from "../../services/musicService"; // Import từ service
import SongHeader from "../../components/user/SongHeader";
import SongCard from "../../components/user/SongCard";
import { useDispatch, useSelector } from "react-redux";
import { useColorUtils } from "../../hooks/useColorUtils";
import { usePlayerMusic } from '../../context/PlayerMusicContext';
import { setUser } from '../../redux/slices/userSlice';
import { message } from "antd";
const Album = () => {
  const albums = useSelector(state => state.music.albums);
  const user = useSelector(state => state.user.user);
  const { generateLinearGradient } = useColorUtils();
  const { id } = useParams(); // Đây là id của album, từ id này gọi api để truyền dữ liệu cho biến album
  const [colorMain, setColorMain] = useState("#ffffff");
  const [backgroundStyle, setBackgroundStyle] = useState("#2A2A2A");
  const [album, setAlbum] = useState({});
  const fac = new FastAverageColor();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLiked, setLiked] = useState(false);
  const { handleListenListSong } = usePlayerMusic();
  useEffect(() => {
    const isLiked = user?.liked_albums?.includes(id);
    setLiked(isLiked);
  }, [id]);
  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const data = await fetchAlbumById(id);
        data.data.message[0].songs_data = data.data.message[0].songs_data?.filter(song => song.status === 1) || [];

        setAlbum(data.data.message[0]); // Cập nhật album

        // Lấy màu chủ đạo sau khi album được tải
        if (data.data.message[0].image) {
          const color = await fac.getColorAsync(data.data.message[0].image);
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

  const handleLikeAlbum = async () => {
    const liked_albums_data = user.liked_albums_data || [];
    let data = {};

    if (isLiked) {
      data.liked_albums = (user.liked_albums?.filter((albumId) => albumId !== id)) || [];
    } else {
      data.liked_albums = [...(user.liked_albums || []), id];
    }

    if (Object.keys(data).length > 0) {
      try {
        message.loading({ content: "Đang lưu...", key: "update" });
        const updateUserResponse = await updateUser(user.id, data);

        if (updateUserResponse?.status === 200) {
          const updatedLikedAlbums = data.liked_albums;

          if (isLiked) {
            dispatch(setUser({
              ...user,
              liked_albums: updatedLikedAlbums,
              liked_albums_data: liked_albums_data.filter((item) => item.id !== id),
            }));
          } else {
            const newLikedAlbumData = albums.find((item) => item.id === id);
            if (newLikedAlbumData) {
              dispatch(setUser({
                ...user,
                liked_albums: updatedLikedAlbums,
                liked_albums_data: [...(liked_albums_data || []), newLikedAlbumData],
              }));
            }
          }

          setLiked(!isLiked);
          message.success({ content: "Thành công", key: "update", duration: 2 });
        }
      } catch (error) {
        message.error({ content: error.message, key: "update", duration: 2 });
      }
    } else {
      message.error("Vui lòng chọn giá trị");
    }
  };




  return <>
    {!loading ?
      <div style={{ background: backgroundStyle }}>
        <div
          className="text-white flex gap-8 flex-col md:flex-row md:items-center p-5"

        >
          <img loading="lazy" className="w-48 h-48 rounded" src={album.image} alt={album.name} />
          <div className="flex flex-col justify-end  gap-3 h-48">
            <p className='!m-0'>Album</p>
            <h1 className="text-5xl font-bold  md:text-7xl p-0  !m-0">{album.name}</h1>
            <p className="flex items-center gap-2 text-gray-300 text-sm  !m-0 ">
              <span className='"w-fit flex items-center cursor-pointer  gap-2' >
                <img loading="lazy" className="w-5 rounded-full" src={album.artist_data?.avatar} alt="Spotify Logo" />
                <span className="hover:text-white" onClick={() => navigate(`/artist/${album.artist_id}`)}>{album.artist_data?.name} </span>
                <span>•</span>
              </span>

              <span className="">{album.release_date} •</span>
              <span className="">
                {album.songs_data?.length != 0
                  ? album.songs_data?.reduce((sum, item) => sum + (item.status !== 0 && item.status !== 3 ? 1 : 0), 0)
                  : 'Chưa có'} bài hát
              </span>
            </p>
          </div>
        </div>
        <div className='pb-10'
        >


          <ul>
            {album.songs_data?.length != 0 ?
              <>
                <div className="flex items-center mx-5 gap-5 py-10">
                  <button onClick={() => { handleListenListSong(album.songs_data) }} className="bg-green-500 px-6 py-3 rounded-full mr-4 flex items-center cursor-pointer flex gap-2">
                    <FaPlay className="mr-2" /> Play
                  </button>
                  {
                    user && <button className="text-gray-400 flex items-center cursor-pointer" >
                      <FaHeart
                        className="mr-2 text-2xl"
                        color={isLiked ? "darkred" : "gray"}
                        onClick={() => handleLikeAlbum()}
                      />
                    </button>
                  }
                </div>
                <SongHeader />
                {album.songs_data?.map((track, index) => (
                  <>
                    {
                      track.status != 0 && <SongCard key={index} song={track} index={index} />
                    }
                  </>


                ))}
              </> : <div className='m-5 text-white'>Cùng đón chờ những bài hát sắp ra mắt trong album!</div>

            }

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
