import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAlbums, fetchSongs, fetchArtists } from "../../services/musicService";
import AlbumCard from '../../components/user/AlbumCard';
import { setSongs, setAlbums, setArtists, setSongsQueue } from '../../redux/slices/musicSlice';
import SongCardHome from '../../components/user/SongCardHome';
import ArtistCard from '../../components/user/ArtistCard';
const Home = () => {
  const user = useSelector(state => state.user.user);
  const songs = useSelector(state => state.music.songs);
  const albums = useSelector(state => state.music.albums);
  const artists = useSelector(state => state.music.artists);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [albumsData, artistsData] = await Promise.all([
          fetchAlbums(),
          fetchArtists(),
        ]);
        dispatch(setAlbums(albumsData.data.message));
        dispatch(setArtists(artistsData.data.message));

      } catch (error) {
        console.error("Lỗi khi tải albums/artists:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchAndModifySongs = async () => {
      if (!user || user?.purchases_data.length == 0) {
        try {
          const songsData = await fetchSongs();
          const filterSongs = (songsData.data.message).filter((item) => item.status == 1);
          dispatch(setSongs(filterSongs));
          dispatch(setSongsQueue(filterSongs));
        } catch (error) {
          console.error("Lỗi khi tải hoặc xử lý songs:", error);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const songsData = await fetchSongs();
        let modifiedSongs = songsData.data.message;

        // Nếu có lượt mua và chưa hết hạn
        if (user.purchases_data.length > 0) {
          const purchase = user.purchases_data[0];
          const purchaseDate = new Date(purchase.purchase_date);
          purchaseDate.setDate(purchaseDate.getDate() + purchase.date);
          const today = new Date();

          if (purchaseDate >= today) {
            modifiedSongs = modifiedSongs.map(song => ({ ...song, price: 0 }));
          }
        }
        dispatch(setSongs(modifiedSongs));
        dispatch(setSongsQueue(modifiedSongs));
      } catch (error) {
        console.error("Lỗi khi tải hoặc xử lý songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndModifySongs();
  }, []);

  const SectionTitle = ({ title }) => (
    <div className="flex justify-between items-center text-green-500 mb-10">
      <h2 className="text-white text-2xl font-bold">{title}</h2>
      {/* <button className="text-gray-400 hover:text-white transition cursor-pointer text-sx">Hiện tất cả</button> */}
    </div>
  );

  const PopularArtists = () => {
    return (
      <div className="my-8">
        <SectionTitle title="Popular Artists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {artists.filter((a) => a.status !== 0).slice(0, 6).map((artist, index) => (
            artist.status !== 0 && (
              <ArtistCard key={index} artist={artist} />
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    !loading ? (
      <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 p-6 py-10 min-h-screen flex flex-col gap-20 ">
        <div>
          <SectionTitle title="Popular Albums" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-5">
            {albums.filter((a) => a.status === 1).slice(0, 6).map((album, index) => (
              album.status === 1 && <AlbumCard key={index} album={album} />
            ))}
          </div>
        </div>

        <PopularArtists />

        {songs.length !== 0 && (
          <div>
            <SectionTitle title="Thịnh hành" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {songs.filter((a) => a.status === 1).slice(0, 12).map((song, index) => (
                song.status === 1 && <SongCardHome key={index} song={song} />
              ))}
            </div>
          </div>
        )}

        {songs.length !== 0 && (
          <div>
            <SectionTitle title="Mới phát hành" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {songs.filter((a) => a.status === 1).slice(12, 16).map((song, index) => (
                song.status === 1 && <SongCardHome key={index} song={song} />
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className='loader-container min-h-[50vh]'>
        <span className="loader">&nbsp;</span>
      </div>
    )
  );
};

export default Home;





