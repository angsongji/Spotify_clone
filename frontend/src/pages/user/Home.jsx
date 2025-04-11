import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../../index.css'
import { useApi } from "../../context/ApiContext";
import { useMusic } from "../../context/MusicContext";

const Home = () => {
  const { formatTime, handleClickSong, currentSong } = useMusic();
  const { fetchAlbums, fetchSongs, transformFormatDate, fetchArtist, AlbumCard } = useApi();
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const navigate = useNavigate();
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading

      try {
        const [albumsData, songsData, artistsData] = await Promise.all([
          fetchAlbums(),
          fetchSongs(),
          fetchArtist()
        ]);

        setAlbums(albumsData.message);
        setSongs(songsData.message);
        setArtists(artistsData.message);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false); // Dừng loading khi tất cả API đã hoàn thành
      }
    };
    fetchData();
  }, []);
  const filteredAlbums = activeFilter === 'Tất cả' || activeFilter === 'Album' ? albums : [];
  const filteredPodcasts = activeFilter === 'Podcasts' ? podcasts : [];

  const FilterButtons = ({ activeFilter, onFilterChange }) => {
    const filters = ['Tất cả', 'Album', "Bài hát"];

    return (
      <div className=" flex items-center mb-4 space-x-3 text-sm gap-2 ">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`cursor-pointer px-3 py-1 rounded-full transition-colors duration-300 ${activeFilter === filter
              ? 'bg-[var(--main-green)] text-black' // Màu xanh khi active
              : 'bg-[var(--light-gray2)] !text-gray-500 hover:bg-[var(--light-gray1)]'
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


  const PopularArtists = () => {
    return (
      <div className="my-8">
        <SectionTitle title="Popular Artists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {artists.map((artist, index) => (
            <>
              {
                artist.status != 0 && <div onClick={() => navigate(`/artist/${artist.id}`)} key={index} className="flex flex-col items-center w-full cursor-pointer">
                  <img loading="lazy" src={artist.avatar} alt={artist.name} className="w-full aspect-square rounded-full object-cover border-4 border-gray-700 hover:border-[var(--main-green)]" />
                  <h3 className="text-white mt-2 font-medium text-center text-base">{artist.name}</h3>
                  <p className="text-gray-400 text-sm">Nghệ sĩ</p>
                </div>
              }
            </>

          ))}
        </div>
      </div>
    );
  };

  function SongCard({ song }) {
    return (
      <div className="w-full cursor-pointer flex gap-3 shadow-lg overflow-hidden items-center hover:bg-[var(--light-gray1)] p-2 rounded-sm"
        onClick={() => handleClickSong(song.id)}
      >
        <img loading="lazy" src={song.image} alt="Album Cover" className="w-15 h-15 object-cover aspect-square rounded-sm" />
        <div className="text-[var(--light-gray3)] w-full flex flex-col">
          <div className="grid grid-cols-[1fr_auto] items-center">
            <div className="text-base  font-semibold text-white w-full overflow-hidden whitespace-nowrap text-ellipsis"
              style={currentSong.id === song.id ? { color: "var(--main-green)", fontSize: "18px" } : {}}

            >
              {song.name}
            </div>

            <span className={`${song.price != 0 ? 'bg-[var(--main-green)]' : 'transparent'} text-black text-xs px-2 py-1 rounded-sm font-semibold`}>
              {song.price != 0 ? "Premium" : ""}
            </span>


          </div>

          <div className="text-xs">{song.artists_data?.map((item) => item.name).join(", ")}</div>
          <div className="text-xs mt-1 flex justify-between">
            <span>
              {transformFormatDate(song.date)}
            </span>
            <span>
              {formatTime(song.duration)}
            </span>
          </div>

        </div>
      </div>
    );
  }

  return <>
    {
      !loading ? <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 p-6 min-h-screen flex flex-col gap-20 ">
        <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />



        {filteredAlbums.length > 0 && (
          <div>
            <SectionTitle title="Popular Albums" />
            <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-5">
              {filteredAlbums.map((album, index) => (
                <>
                  {
                    album.status == 1 && < AlbumCard key={index} album={album} />
                  }
                </>

              ))}
            </div>
          </div>
        )}

        <div>
          <SectionTitle title="Thịnh hành" />
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {songs.map((song, index) => (
              <>
                {
                  song.status == 1 && <SongCard key={index} song={song} />
                }
              </>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title="Mới phát hành" />
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {songs.map((song, index) => (
              <>
                {
                  song.status == 1 && <SongCard key={index} song={song} />
                }
              </>
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
