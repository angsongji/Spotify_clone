import { useState, useEffect } from "react";
import { Select, Table, Dropdown, message } from "antd";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import { useApi } from "../../context/ApiContext";
import { useMusic } from "../../context/MusicContext";
import { BsCalendarDate } from "react-icons/bs";

const { Option } = Select;

const options = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Riêng tư" },
  { value: 1, label: "Công khai" },
  { value: 3, label: "Chờ duyệt" },
];

const ManageAlbums = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectValue, setSelectValue] = useState(-1);
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [detailAlbum, setDetailAlbum] = useState({});
  const [album, setAlbum] = useState({});
  const { fetchAlbums, loading, fetchAlbumById, fetchData } = useApi();
  const { formatTime } = useMusic();

  useEffect(() => {
    const fetchDataAlbums = async () => {
      const fetchedAlbums = await fetchAlbums();
      setAlbums(fetchedAlbums.message);
      setFilteredAlbums(fetchedAlbums.message);
    };
    fetchDataAlbums();
  }, []);

  useEffect(() => {
    let filtered = [...albums];

    if (selectValue !== -1) {
      filtered = filtered.filter((album) => album.status === selectValue);
    }

    if (searchValue) {
      filtered = filtered.filter((album) =>
        album.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredAlbums(filtered);
  }, [selectValue, searchValue, albums]);

  const handleMenuClick = (key, record) => {
    if (key === "detail") {
      handleShowDetailAlbum(record);
    } else if (key === "edit") {
      setAlbum(record);
    }
  };


  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <div className="flex justify-center">
          <img src={image} alt="Ảnh album" className="w-10 h-auto aspect-square rounded-sm object-cover" />
        </div>
      ),
    },
    { title: "Tên album", dataIndex: "name", key: "name" },
    { title: "Phát hành", dataIndex: "release_date", key: "release_date" },
    {
      title: "Nghệ sĩ",
      dataIndex: "artist_data",
      key: "artist_data",
      render: (artist_data) => artist_data.name,
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
              { key: "detail", label: "Xem chi tiết" },
              { key: "edit", label: "Chỉnh sửa" },
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
    }
  ];

  const handleShowDetailAlbum = (record) => {
    const fetchDetailAlbum = async () => {
      const fetchedAlbum = await fetchAlbumById(record.id);
      setDetailAlbum(fetchedAlbum.message[0]);
    };
    fetchDetailAlbum();
  };

  const ComponentDetailAlbum = ({ detailAlbum }) => {
    return (
      <div className="z-10 fixed top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">

        <CiCircleRemove className=" text-white text-3xl cursor-pointer" onClick={() => setDetailAlbum({})} />
        <div className="bg-[var(--dark-gray)] p-4 rounded-md">
          <div className="rounded-md shadow-md flex gap-5 items-center mb-5 ">
            <img src={detailAlbum.image} alt="Ảnh album" className="w-[10vw] h-[10vw] object-cover rounded-md mb-2" />
            <div className="flex flex-col gap-2">
              <div className="text-xs">{detailAlbum.status === 1 ? <span className="text-green-500">Công khai</span> : detailAlbum.status === 3 ? <span className="text-yellow-500">Chờ duyệt</span> : <span className="text-red-500">Riêng tư</span>}</div>
              <h2 className="text-xl font-semibold text-white">{detailAlbum.name}</h2>
              <p className="text-sm text-gray-400">Ngày phát hành: {detailAlbum.release_date}</p>
              <p className="text-sm text-gray-400">Nghệ sĩ: {detailAlbum.artist_data?.name}</p>
            </div>

          </div>
          <div className="flex flex-col gap-5 w-full justify-center">
            {
              detailAlbum.songs_data.map((song, index) => (
                <div key={index} className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <div>{index + 1}</div>
                    <img src={song.image} alt="Ảnh bài hát" className="w-10 h-10 object-cover rounded-md" />
                    <div className="text-white">{song.name}</div>
                  </div>
                  <div>{formatTime(song.duration)}</div>
                </div>

              ))
            }
          </div>
        </div>

      </div>
    );
  };
  const FormUpdateAlbum = ({ album }) => {
    const [selectValueStatus, setSelectValueStatus] = useState(album.status);
    const optionsStatus = [
      { value: album.status, label: album.status == 3 ? "Chờ duyệt" : album.status == 1 ? "Công khai" : "Riêng tư" }
    ];
    if (album.status == 3) {
      optionsStatus.push({ value: 0, label: "Riêng tư" });
      optionsStatus.push({ value: 1, label: "Công khai" });
    }
    if (album.status == 1) {
      optionsStatus.push({ value: 0, label: "Riêng tư" });
    }
    if (album.status == 0) {
      optionsStatus.push({ value: 1, label: "Công khai" });
    }
    const handleUpdateAlbum = async () => {
      let data = {};
      if (selectValueStatus != album.status) {
        data.status = selectValueStatus;
      }
      if (Object.keys(data).length > 0) {
        try {
          const updateAlbumResponse = await fetchData(`update-album/?id=${album.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),

          });

          if (updateAlbumResponse?.status === 200) {
            setAlbums(prev => prev.map(item => item.id === album.id ? updateAlbumResponse.message : item));
            setAlbum({});
            message.success("Cập nhật album thành công");
          } else {
            message.error(updateAlbumResponse?.message);
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
          <CiCircleRemove className="text-white text-3xl cursor-pointer self-end" onClick={() => setAlbum({})} />
          <div className="flex gap-5 items-center w-full h-fit ">
            <img src={album.image} alt="Ảnh album" className="w-1/2 h-1/2 object-cover rounded-md " />
            <div className="text-white ">
              <div className="text-2xl font-bold">{album.name}</div>
              <div className="text-sm text-gray-400">{album.artist_data?.name}</div>
            </div>
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
          <button onClick={handleUpdateAlbum} className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm my-2" >Lưu</button>

        </div>

      </div>
    );
  }
  return (
    <div>
      {loading ? (
        <div className="loader-container min-h-[50vh] flex justify-center items-center">
          <span className="loader">&nbsp;</span>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {
            !!Object.keys(album).length && <FormUpdateAlbum album={album} />
          }
          {/* Hiển thị detail album */}
          {!!Object.keys(detailAlbum).length && (
            <ComponentDetailAlbum detailAlbum={detailAlbum} />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tên album"
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
            dataSource={filteredAlbums}
            pagination={{ pageSize: 6 }}
            scrollToFirstRowOnChange={true}
            rowKey="id"
          />
        </div>
      )}
    </div>
  );
};

export default ManageAlbums;
