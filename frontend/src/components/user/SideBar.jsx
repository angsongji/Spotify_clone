import React from "react";
import { FaSearch, FaPlus, FaList } from "react-icons/fa";
import { HiLibrary } from "react-icons/hi";
import { LuLibrary } from "react-icons/lu";
import "../../index.css"
const SideBar = () => {
    return (
        <div className="w-full h-full  p-4  flex flex-col text-[var(--light-gray3)] text-base ">


            {/* Your Library */}
            <div className="flex justify-between items-center mb-4 ">
                <div className="flex items-center gap-2 ">
                    <LuLibrary className="w-5 h-5 " />
                    <div className="text-base font-bold ">Thư viện</div>
                </div>
                <button>
                    <FaPlus className="w-5 h-5 cursor-pointer" />
                </button>
            </div>

            {/* Tìm kiếm và sắp xếp */}
            <div className="flex items-center gap-3 bg-[var(--light-gray1)] px-2 py-1 rounded-md mb-4 w-[80%]">
                <FaSearch className="w-5 h-5 text-white" />
                <input
                    type="text"
                    placeholder="Tìm trong thư viện"
                    className="bg-transparent outline-none text-white w-full"
                />
            </div>


            <div className="flex flex-col gap-3">
                {/* Liked Songs */}
                <div className="flex items-center gap-3 cursor-pointer hover:border-r hover:border-r-white ">
                    <img src="/likedSongs_logo.jpg" className="w-12 h-12 rounded-md" />
                    <div className="flex flex-col justify-center h-full gap-1">
                        <div className="text-white font-bold ">Liked Songs</div>
                        <div className="text-gray-400 text-sm ">Playlist • 2 songs</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 cursor-pointer hover:border-r hover:border-r-white ">
                    <img src="/JennieSpotify.jpg" className="w-12 h-12 rounded-md " />
                    <div className="flex flex-col justify-center h-full gap-1">
                        <div className="text-white font-bold ">Ruby</div>
                        <div className="text-gray-400 text-sm ">Album • JENNIE • 2 songs</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
