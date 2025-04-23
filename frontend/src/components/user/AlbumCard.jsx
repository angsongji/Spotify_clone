import React from "react";
import { useNavigate } from "react-router-dom";

const AlbumCard = ({ album }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/album/${album.id}`)}
            className="w-full bg-[var(--light-gray2)] h-fit p-3 rounded-lg transition-transform transform hover:scale-105 duration-300 cursor-pointer flex flex-col"
        >
            <img
                src={album.image}
                alt={album.name}
                className="w-full object-cover aspect-square rounded-sm self-center"
            />
            <div className="w-full mt-2">
                <h3 className="text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
                    {album.name}
                </h3>
                <p className="text-gray-400 text-sm">{album.artist_data.name}</p>
            </div>
        </div>
    );
};

export default AlbumCard;
