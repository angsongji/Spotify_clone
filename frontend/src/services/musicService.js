import axiosClient from './axiosClient';

const fetchSongs = () => axiosClient.get('api/songs');
const fetchUsers = () => axiosClient.get('api/users');
const fetchAlbums = () => axiosClient.get('api/albums');
const fetchAlbumById = (id) => axiosClient.get(`api/albums/filter/?id=${id}`);
const fetchArtists = () => axiosClient.get('api/artists');
const fetchArtistById = (id) => axiosClient.get(`api/artists/filter/?id=${id}`);
const fetchCategories = () => axiosClient.get('api/categories');
const fetchUserById = (id) => axiosClient.get(`api/users/filter/?id=${id}`);
const uploadFile = (data) => {
    return axiosClient.post('api/upload/', data, {
        timeout: 60000  // 60 giây chỉ riêng cho upload
    });
};
const addSong = (songData) => axiosClient.post(`api/add-song/`, songData);
const updateSong = (songId, albumId) =>
    axiosClient.patch(`api/update-song/?id=${songId}`, albumId);
const addAlbum = (albumData) => axiosClient.post(`api/add-album/`, albumData);
const updateAlbum = (albumId, data) =>
    axiosClient.patch(`api/update-album/?id=${albumId}`, data);
const addCategory = (categoryData) => axiosClient.post(`api/add-category/`, categoryData);
const updateUser = (userId, data) =>
    axiosClient.patch(`api/update-user/?id=${userId}`, data);
const addPlaylist = (playlistData) => axiosClient.post(`api/add-playlist/`, playlistData);
export {
    fetchSongs,
    fetchUsers,
    fetchAlbums,
    fetchAlbumById,
    fetchArtists,
    fetchArtistById,
    fetchCategories,
    fetchUserById,
    uploadFile,
    addSong,
    addAlbum,
    updateSong,
    updateAlbum,
    addCategory,
    updateUser,
    addPlaylist
};
