import React, { useState } from "react";
import { useMusic } from "../../context/MusicContext";
import { useApi } from "../../context/ApiContext";
import { FaLock, FaSearch, FaPlus, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Select } from "antd";
import "../../index.css";
const { Option } = Select;
// Dữ liệu mẫu
const options = [
  { value: "1", label: "Tất cả" },
  { value: "2", label: "Riêng tư" },
  { value: "3", label: "Công khai" },
];
const ArtistSongs = () => {
  const { formatTime } = useMusic();
  const { user, transformFormatDate } = useApi();
  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
  const ComboBox = ({ options, onChange }) => {
    return (
      <Select
        style={{ width: 100 }}
        placeholder="Chọn một mục"
        onChange={onChange}
        defaultValue="1"
      >
        {options.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  };



  const handleChange = (value) => {
    console.log("Giá trị đã chọn:", value);
  };
  function SongCard({ song }) {
    return (
      <div className="relative group w-[100%] cursor-pointer flex gap-3 max-w-xs shadow-lg overflow-hidden items-center hover:bg-[var(--light-gray2)] p-2 rounded-sm"
      // onClick={() => handleClickSong(song.id)}

      >
        <img src={song.image} alt="Album Cover" className="group-hover:scale-105 w-15 h-15 object-cover aspect-square rounded-sm" />
        <div className="text-[var(--light-gray3)] w-full flex flex-col">
          <div className="grid grid-cols-[1fr_auto] items-center">
            <div className="text-base  font-semibold text-white w-full overflow-hidden whitespace-nowrap text-ellipsis"


            >
              {song.name}
            </div>

            <span className={`${Number(song.price) !== 0 ? 'bg-[var(--main-green)]' : 'transparent'} text-black text-sm px-2 py-1 rounded-sm font-semibold`}>
              {song.price != 0 ? song.price : ""}
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
        {/* Lớp nền đè lên */}
        {
          song.status == 0 && <div className="absolute top-0 left-0 bg-[var(--light-gray1)] opacity-50  transition-opacity duration-300  bottom-0 right-0 flex items-center justify-center">
            <div className="text-gray-500 text-sm font-semibold flex items-center gap-2">
              <FaLock /> Riêng tư
            </div>
          </div>
        }

      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between m-5 mb-7">
        <div className="flex items-center gap-5 ">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên bài hát"
              className="bg-[var(--light-gray2)] !text-white p-2 rounded-full w-96 focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
              value={searchValue}
              onChange={handleInputChange}
            />
            <FaSearch className="absolute left-2 top-0 translate-x-[50%] translate-y-[50%] text-[var(--light-gray3)]" />
          </div>
          <ComboBox options={options} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-2 mr-2">
          <div className="hover:bg-[var(--main-green)] hover:text-black text-[var(--light-gray3)] text-base cursor-pointer rounded-full bg-[var(--light-gray1)] p-2"><FaPlus /></div>
          <div className="hover:bg-[var(--main-green)] hover:text-black text-[var(--light-gray3)] text-base cursor-pointer rounded-full bg-[var(--light-gray1)] p-2"><FaPen /> </div>
          <div className="hover:bg-[var(--main-green)] hover:text-black text-[var(--light-gray3)] text-base cursor-pointer rounded-full bg-[var(--light-gray1)] p-2"><MdDelete /> </div>


        </div>
      </div>


      <div className="h-[60vh] overflow-y-auto  custom-scroll">
        <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center">
          {user.songs_data.map((song, index) => (
            <>
              {
                song.status != 2 && <SongCard key={index} song={song} />
              }
            </>
          ))}
        </div>
      </div>
    </div>


  );
};

export default ArtistSongs;
