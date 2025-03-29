import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom"; 
import { FaLock, FaSearch, FaPlus, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Select } from "antd";
const { Option } = Select;
import "../../index.css";
const options = [
  { value: "1", label: "Tất cả" },
  { value: "2", label: "Riêng tư" },
  { value: "3", label: "Công khai" },
];
const ArtistAlbums = () => {
  const { user, transformFormatDate } = useApi();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
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


  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
  const handleChange = (value) => {
    console.log("Giá trị đã chọn:", value);
  };
  const AlbumCard = ({ album }) => {
    const navigate = useNavigate();
    return (
      <div
        // onClick={() => navigate(`/album/${album.id}`)}
        className="relative w-40 bg-[var(--light-gray2)] h-fit p-3 rounded-lg transition-transform transform hover:scale-105 duration-300 cursor-pointer flex flex-col"
      >
        <img
          src={album.image}
          alt={album.name}
          className="w-full h-32 object-cover aspect-square rounded-sm"
        />

        {/* Bọc phần nội dung text để canh lề trái */}
        <div className="w-full mt-2 flex flex-col gap-2">
          <div className="text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {album.name}
          </div>

          <div className="text-gray-400 text-sm">{transformFormatDate(album.release_date)}</div>
        </div>
        {
          album.status == 0 && <div className="absolute top-0 left-0 bg-[var(--light-gray1)] opacity-50  transition-opacity duration-300  bottom-0 right-0 flex items-center justify-center">
          <div className="text-gray-500 text-sm font-semibold flex items-center gap-2">
            <FaLock /> Riêng tư
          </div>
        </div>
        }
      </div>


    );
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-between m-5 mb-7">
        <div className="flex items-center gap-5 ">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên album"
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
      <div className="h-[70vh] overflow-y-auto  custom-scroll">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-items-center">
          {user.albums_data.map((album, index) => (
            <>
              {
                album.status != 2 && <AlbumCard key={index} album={album} />
              }
            </>

          ))}

        </div>
      </div>
    </div>


  );
};

export default ArtistAlbums;
