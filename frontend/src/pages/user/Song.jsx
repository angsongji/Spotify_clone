import React from 'react';
import { FaPlay, FaPlus } from 'react-icons/fa'; // Import icons

const Song = ({ song }) => {
  return (
    <div className="p-6">
      <img src={song.album.image} alt={song.name} className="w-64 h-64 rounded-lg mb-4" />
      <h1 className="text-white text-3xl font-bold mb-2">{song.name}</h1>
      <h2 className="text-gray-400 text-lg mb-2">{song.artist}</h2>
      <p className="text-gray-400 mb-4">{song.album.name}</p>
      <p className="text-gray-400 mb-4">{song.lyrics}</p>
      <div className="flex items-center mb-4">
        <button className="bg-green-500 text-white px-6 py-3 rounded-full mr-4 flex items-center">
          <FaPlay className="mr-2" /> Play
        </button>
        <button className="text-gray-400 flex items-center">
          <FaPlus className="mr-2" /> Add to Playlist
        </button>
      </div>
    </div>
  );
};

export default Song;