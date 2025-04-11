import { useState, useEffect } from "react";
import { Select, Table, Dropdown, message } from "antd";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { useMusic } from "../../context/MusicContext";
import { BsCalendarDate } from "react-icons/bs";
import { CiCircleRemove } from "react-icons/ci";
const { Option } = Select;

const options = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Riêng tư" },
  { value: 1, label: "Công khai" },
  { value: 3, label: "Chờ duyệt" },
];

const ManageSongs = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectValue, setSelectValue] = useState(-1);
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const { fetchSongs, loading, fetchData } = useApi();
  const { formatTime } = useMusic();
  const [song, setSong] = useState({});

  useEffect(() => {
    const fetchDataSongs = async () => {
      const fetchedSongs = await fetchSongs();
      setSongs(fetchedSongs.message);
      setFilteredSongs(fetchedSongs.message);
    };
    fetchDataSongs();
  }, []);

  useEffect(() => {
    let filtered = [...songs];

    if (selectValue !== -1) {
      filtered = filtered.filter((song) => song.status === selectValue);
    }

    if (searchValue) {
      filtered = filtered.filter((song) =>
        song.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredSongs(filtered);
  }, [selectValue, searchValue, songs]);

  // Xử lý chọn menu
  const handleMenuClick = (key, record) => {
    if (key === "edit") {
      setSong(record);
    }
  };


  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <div className="flex justify-center">
          <img loading="lazy" src={image} alt="Ảnh bài hát" className="w-10 h-auto aspect-square rounded-sm object-cover" />
        </div>
      ),
    },
    { title: "Tên bài hát", dataIndex: "name", key: "name" },
    { title: "Phát hành", dataIndex: "date", key: "date" },
    {
      title: "Thời lượng", dataIndex: "duration", key: "duration",
      render: (duration) => formatTime(duration)
    },
    {
      title: "Nghệ sĩ",
      dataIndex: "artists_data",
      key: "artists_data",
      render: (artists_data) => artists_data?.map((artist) => artist.name).join(", "),
    },
    {
      title: "Thể loại",
      dataIndex: "categories_data",
      key: "categories_data",
      render: (categories_data) => categories_data?.map((category) => category.name).join(", "),
    },
    {
      title: "Nghe", dataIndex: "price", key: "price",
      render: (price) => price != 0 ? "Premium" : "Miễn phí"

    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? <span className="text-green-500">Công khai</span> : status === 3 ? <span className="text-yellow-500">Chờ duyệt</span> : <span className="text-red-500">Riêng tư</span>,
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Chỉnh sửa" }
            ],
            onClick: ({ key }) => handleMenuClick(key, record),
          }}
          trigger={["click"]}
        >
          <span className="cursor-pointer">
            <FaEllipsisV className="text-gray-500 hover:text-[var(--main-green)]" />
          </span>
        </Dropdown>
      ),
    },
  ];
  const FormUpdateSong = ({ song }) => {
    const [selectValueBuy, setSelectValueBuy] = useState(song.price);
    const [selectValueStatus, setSelectValueStatus] = useState(song.status);
    const optionsBuy = [
      { value: 0, label: "Miễn phí" },
      { value: 1, label: "Premium" },
    ];
    const optionsStatus = [
      { value: song.status, label: song.status == 3 ? "Chờ duyệt" : song.status == 1 ? "Công khai" : "Riêng tư" }
    ];
    if (song.status == 3) {
      optionsStatus.push({ value: 0, label: "Riêng tư" });
      optionsStatus.push({ value: 1, label: "Công khai" });
    }
    if (song.status == 1) {
      optionsStatus.push({ value: 0, label: "Riêng tư" });
    }
    if (song.status == 0) {
      optionsStatus.push({ value: 1, label: "Công khai" });
    }
    const handleUpdateSong = async () => {
      let data = {};
      if (selectValueBuy != song.price) {
        data.price = selectValueBuy;
      }
      if (selectValueStatus != song.status) {
        data.status = selectValueStatus;
      }
      if (Object.keys(data).length > 0) {
        try {
          const updateSongResponse = await fetchData(`update-song/?id=${song.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),

          });

          if (updateSongResponse?.status === 200) {
            setSongs(prev => prev.map(item => item.id === song.id ? updateSongResponse.message : item));
            setSong({});
            message.success("Cập nhật bài hát thành công");
          } else {
            message.error(updateSongResponse?.message);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        message.error("Vui lòng chọn giá trị");
      }
    }
    return (
      <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">
        <div className="p-5 bg-[var(--dark-gray)] rounded-md shadow-md w-1/4 h-fit flex flex-col gap-2">
          <CiCircleRemove className="text-white text-3xl cursor-pointer self-end" onClick={() => setSong({})} />
          <div className="flex gap-5 items-center w-full h-fit ">
            <img loading="lazy" src={song.image} alt="Ảnh bài hát" className="w-1/2 h-1/2 object-cover rounded-md " />
            <div className="text-white ">
              <div className="text-2xl font-bold">{song.name}</div>
              <div className="text-sm text-gray-400">{song.artists_data?.map((artist) => artist.name).join(", ")}</div>
            </div>
          </div>

          <div className="flex gap-5 items-center ">
            Nghe:
            <Select
              style={{ width: 120 }}
              onChange={setSelectValueBuy}
              defaultValue={selectValueBuy}
            >
              {optionsBuy.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex gap-5 my-5 items-center">
            Trạng thái:
            <Select
              style={{ width: 120 }}
              onChange={setSelectValueStatus}
              defaultValue={selectValueStatus}
            >
              {optionsStatus.map((item) => (
                <>
                  {
                    item.value !== -1 && <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>

                  }
                </>
              ))}
            </Select>
          </div>
          <button onClick={handleUpdateSong} className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm my-2" >Lưu</button>

        </div>

      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container min-h-[50vh] flex justify-center items-center">
          <span className="loader">&nbsp;</span>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {!!Object.keys(song).length && (
            <FormUpdateSong song={song} />
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tên bài hát"
                  className="bg-[var(--light-gray2)] text-white p-2 rounded-full w-full focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-0 translate-x-[50%] translate-y-[50%] text-[var(--light-gray3)]" />
              </div>
              <Select
                style={{ width: 120 }}
                placeholder="Chọn một mục"
                onChange={setSelectValue}
                defaultValue={selectValue}
              >
                {options.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredSongs}
            pagination={{ pageSize: 6 }}
            scrollToFirstRowOnChange={true}
            rowKey="id"
          />
        </div>
      )}
    </div>
  );
};

export default ManageSongs;
