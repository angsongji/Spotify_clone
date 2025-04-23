import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    musicIndex: -1,
    isPlaying: false,
    currentSong: {},
    songsQueue: [],
    isPlayingVideo: false,
    songs: [],
    albums: [],
    artists: [],
};

const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        setMusicIndex: (state, action) => {
            state.musicIndex = action.payload;
        },
        setIsPlaying: (state, action) => {
            console.log("isplaying: ", action.payload);
            state.isPlaying = action.payload;
        },
        setCurrentSong: (state, action) => {
            // Chỉ cập nhật nếu bài hát thực sự thay đổi
            if (state.currentSong.id !== action.payload.id) {
                console.log("setCurrentSong dispatch:", action.payload.id);
                state.currentSong = action.payload;
            }
        },
        setSongsQueue: (state, action) => {
            console.log("lluu ", action.payload)
            state.songsQueue = action.payload;
            console.log("sau lluu ", state.songsQueue)
        },
        setIsPlayingVideo: (state, action) => {
            state.isPlayingVideo = action.payload;
        },
        setSongs: (state, action) => {
            state.songs = action.payload;
        },
        setAlbums: (state, action) => {
            state.albums = action.payload;
        },
        setArtists: (state, action) => {
            state.artists = action.payload;
        },
    },
});

export const {
    setMusicIndex,
    setIsPlaying,
    setCurrentSong,
    setSongsQueue,
    setIsPlayingVideo,
    setSongs,
    setAlbums,
    setArtists,
} = musicSlice.actions;

export default musicSlice.reducer;
