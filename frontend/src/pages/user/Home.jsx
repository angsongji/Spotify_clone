import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../../index.css'
import { useApi } from "../../context/ApiContext";
import { useMusic } from "../../context/MusicContext";
// const albums = [
//   { id: 1, name: "Ruby", artist: "JENNIE", image: "/JennieSpotify.jpg" },
//   { id: 2, name: "Lặng", artist: "Shiki", image: "/ShikiSpotify.jpg" },
//   { id: 3, name: "THE WXRDIES", artist: "Wxrdie", image: "/WxrdieSpotify.jpg" },
//   { id: 4, name: "Đánh Đổi", artist: "Obito, Shiki", image: "/ObitoSpotify1.jpg" },
//   { id: 5, name: "Từng Ngày Như Mãi Mãi", artist: "buitruonglinh", image: "/BuiTruongLinhSpotify.jpg" },
//   { id: 5, name: "Từng Ngày Như Mãi Mãi", artist: "buitruonglinh", image: "/BuiTruongLinhSpotify.jpg" },
//   { id: 3, name: "THE WXRDIES", artist: "Wxrdie", image: "/WxrdieSpotify.jpg" },
// ];

// const artists = [
//   { id: 1, name: "Noo Phước Thịnh", image: "/NooPhuocThinh.jpg" },
//   { id: 1, name: "HIEUTHUHAI", image: "/HTH.jpg" },
//   { id: 1, name: "Sơn Tùng M-TP", image: "/SonTung.jpg" },
//   { id: 1, name: "Dương Domic", image: "/DuongDomic.jpg" },
//   { id: 1, name: "ChiPu", image: "/ChiPu.jpg" },
//   { id: 1, name: "Bích Phương", image: "/BichPhuong.jpg" },
// ];




const Home = () => {
  const { setCurrentSong, setPlayStatus } = useMusic();
  const { fetchAlbums, loading, fetchSongs, setLoading, transformFormatDate, fetchArtist } = useApi();
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const navigate = useNavigate();
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    const loadAlbums = async () => {
      const data = await fetchAlbums();
      setLoading(true);
      setAlbums(data.message);

    };
    const loadSongs = async () => {
      const data = await fetchSongs();
      setSongs(data.message);
    };

    const loadArtist = async () => {
      const data = await fetchArtist();
      setArtists(data.message);
    };
    loadAlbums();
    loadSongs();
    loadArtist();
  }, []);

  const filteredAlbums = activeFilter === 'Tất cả' || activeFilter === 'Album' ? albums : [];
  const filteredPodcasts = activeFilter === 'Podcasts' ? podcasts : [];

  const FilterButtons = ({ activeFilter, onFilterChange }) => {
    const filters = ['Tất cả', 'Album', "Bài hát"];

    return (
      <div className=" flex items-center mb-4 space-x-3 text-sm ">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`cursor-pointer px-3 py-1 rounded-full transition-colors duration-300 ${activeFilter === filter
              ? 'bg-[var(--main-green)] text-black' // Màu xanh khi active
              : 'bg-[var(--light-gray1)] text-gray-300 hover:bg-gray-600'
              }`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  };
  // Tiêu đề chung cho các phần
  const SectionTitle = ({ title }) => (
    <div className="flex justify-between items-center  text-green-500 mb-10">
      <h2 className="text-white text-2xl font-bold">{title}</h2>
      <button className="text-gray-400 hover:text-white transition cursor-pointer text-sm">Show all</button>
    </div>
  );


  // Thẻ Album
  const AlbumCard = ({ album }) => {
    return (
      <div
        onClick={() => navigate(`/album/${album.id}`)}
        className="w-40 bg-[var(--light-gray2)] h-fit p-3 rounded-lg transition-transform transform hover:scale-105 duration-300 cursor-pointer flex flex-col"
      >
        <img
          src={album.image}
          alt={album.name}
          className="w-full h-32 object-cover aspect-square rounded-sm"
        />

        {/* Bọc phần nội dung text để canh lề trái */}
        <div className="w-full mt-2">
          <h3 className="text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {album.name}
          </h3>

          <p className="text-gray-400 text-sm">{album.artist_data.name}</p>
        </div>
      </div>


    );
  };

  const PopularArtists = () => {
    return (
      <div className="my-8">
        <SectionTitle title="Popular Artists" />
        <div className="flex overflow-x-auto space-x-10 scrollbar-hide">
          {artists.map((artist, index) => (
            <div onClick={() => navigate(`/artist/${artist.id}`)} key={index} className="flex flex-col items-center w-40 cursor-pointer">
              <img src={artist.avatar} alt={artist.name} className="flex-1 rounded-full object-cover border-4 border-gray-700 hover:border-green-500 transition" />
              <h3 className="text-white mt-2 font-medium text-center text-base">{artist.name}</h3>
              <p className="text-gray-400 text-sm">Nghệ sĩ</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  function SongCard({ song }) {
    return (
      <div className="w-[100%] cursor-pointer flex gap-3 max-w-xs shadow-lg overflow-hidden items-center hover:bg-[var(--light-gray1)] p-2 rounded-sm"
        onClick={() => handleClickSong(song.id)}
      >
        <img src={song.image} alt="Album Cover" className="w-15 h-15 object-cover aspect-square rounded-sm" />
        <div className="text-[var(--light-gray3)] w-full flex flex-col">
          <div className="grid grid-cols-[1fr_auto] items-center">
            <div className="text-base  font-semibold text-white w-full overflow-hidden whitespace-nowrap text-ellipsis">
              {song.name}
            </div>

            <span className={`${song.price != 0 ? 'bg-[var(--main-green)]' : 'transparent'} text-black text-sm px-2 py-1 rounded-sm font-semibold`}>
              {song.price != 0 ? song.price : ""}
            </span>


          </div>

          <div className="text-xs">{song.artists_data?.map((item) => item.name).join(", ")}</div>
          <div className="text-xs mt-1">{transformFormatDate(song.date)}</div>
        </div>
      </div>
    );
  }
  function handleClickSong(id) {
    const selectedSong = songs.find(item => item.id === id);
    if (selectedSong) {
      localStorage.removeItem(`song-${selectedSong.id}-time`);
      setCurrentSong({ ...selectedSong });
      setPlayStatus(true);
    }
  }
  return <>
    {
      !loading ? <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 p-6 min-h-screen flex flex-col gap-20 ">
        <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />



        {filteredAlbums.length > 0 && (
          <div>
            <SectionTitle title="Popular Albums" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {filteredAlbums.map((album, index) => (

                < AlbumCard key={index} album={album} />
              ))}
            </div>
          </div>
        )}

        <div>
          <SectionTitle title="Thịnh hành" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {songs.map((song, index) => (
              <SongCard key={index} song={song} />
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title="Mới phát hành" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {songs.map((song, index) => (
              <SongCard key={index} song={song} />
            ))}
          </div>
        </div>


        {activeFilter === 'Tất cả' && <PopularArtists />}
      </div> :
        <div className='loader-container min-h-[50vh]'>
          <span className="loader">&nbsp;</span>
        </div>
    }</>
};




export default Home;
