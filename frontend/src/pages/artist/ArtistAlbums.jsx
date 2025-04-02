import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom"; 
import { HiDotsVertical } from "react-icons/hi";
import { FaLock, FaSearch, FaPlus } from "react-icons/fa";
import { Select, Dropdown, Button, Modal, Form, Input, DatePicker } from "antd";
import UploadImage from "../../components/artist/UploadImage"
const { Option } = Select;
import "../../index.css";
const options = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Riêng tư" },
  { value: 1, label: "Công khai" },
];
const ArtistAlbums = () => {
  const { setUser, user, transformFormatDate, setLoading, loading, fetchData } = useApi();
  const [searchValue, setSearchValue] = useState("");
  const [selectValue, setSelectValue] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formAdd] = Form.useForm();
  const navigate = useNavigate();
  const ComboBox = ({ options, onChange }) => {
    return (
      <Select
        style={{ width: 100 }}
        placeholder="Chọn một mục"
        onChange={onChange}
        defaultValue={selectValue}
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
    setSelectValue(value);
  };
  const DropdownMenu = () => {
    const items = [
      {
        key: '1',
        label: 'Cập nhật',
        onClick: () => alert('Clicked on 1st menu item'),
      },
      {
        key: '2',
        label: 'Xóa',
        onClick: () => alert('Clicked on 2nd menu item'),
      },
    ];
    return (
  
        <Dropdown menu={{ items }} trigger={['click']}>  
         <HiDotsVertical />
        </Dropdown>
    );
  };

  const showModal = ({ type }) => {
    setIsModalOpen(true);
    if (type === "add") {
      setIsModalOpen(true);
    }
  };
  const handleOk = async ({ type }) => {
    try {
      setLoading(true); // Bắt đầu loading
      const values = await formAdd.validateFields();

      if (type === "add") {
        await handleAddAlbum(values);
      }

      setIsModalOpen(false); // Đóng modal sau khi xử lý xong
      formAdd.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    } finally {
      setLoading(false); // Tắt loading khi xong
    }
  };

  const handleAddAlbum = async (values) => {
    console.log("add album ", values);
    try {
      let image = "";
  
      // Upload image
      if (values.image) {
        const imageData = new FormData();
        imageData.append("file", values.image);
  
        const uploadImageResponse = await fetchData("upload/", {
          method: "POST",
          body: imageData,
        });
  
        if (uploadImageResponse?.status === 200) {
          image = encodeURI(uploadImageResponse.message); // Trả về URL ảnh
        } else {
          throw new Error("Image upload failed");
        }
      }
  
      console.log("image ", image);
  
      // Tạo album sau khi upload xong ảnh
      const albumData = {
        name: values.name,
        artist_id: user.id,
        image,
        release_date: values.release_date,
      };
  
      const addAlbumResponse = await fetchData("add-album/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData),
      });
  
      if (addAlbumResponse?.status === 201) {
        setUser((prevState) => ({
          ...prevState,
          albums_data: [...prevState.albums_data, addAlbumResponse.message],
        }));
  
        // Cập nhật album_id cho từng bài hát
        await Promise.all(
          values.songs.map(async (songId) => {
            await fetchData(`update-song/?id=${songId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ album_id: addAlbumResponse.message.id }),
            });
          })
        );
      } else {
        throw new Error("Failed to add album");
      }
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };
  

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const FormAdd = () => (
    <Modal
      title="Thêm album mới"
      open={isModalOpen}
      onOk={() => handleOk({ type: "add" })}
      onCancel={handleCancel}
      okText={loading ? <FaLock /> : "Submit"} // Hiển thị loading icon khi đang xử lý
      cancelText="Cancel"
      width={700}
      confirmLoading={loading} // Vô hiệu hóa nút submit khi đang xử lý
    >
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <svg
            className="animate-spin h-5 w-5 mr-3"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang xử lý...
        </div>
      ) : (
        <Form form={formAdd} layout="vertical">
          <div className="flex w-full gap-4">
            <div className="w-fit border-r-1 border-black pr-4">
              <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: "Vui lòng chọn ảnh bài hát!" }]}
              >
                <UploadImage form={formAdd} />
              </Form.Item>
            </div>

            <div className="flex-1">
              <Form.Item
                label="Tên album"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên album!" }]}
              >
                <Input className="!w-[300px]" />
              </Form.Item>
              <Form.Item
                label="Ngày phát hành"
                name="release_date"
                rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}
              >
                <AlbumDatePicker form={formAdd} />
              </Form.Item>
              <Form.Item
                label="Bài hát trong album"
                name="songs"
              >
                <SelectMultipleWithSearch data={user.songs_data.filter(song => song.status != 2 && song.album_id == "")} form={formAdd} />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );
  const AlbumDatePicker = ({ form }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleChange = (date, dateString) => {
      setSelectedDate(dateString); // Lưu dưới dạng YYYY-MM-DD
      form.setFieldsValue({ release_date: dateString });
    };

    return (
      <div>
        <DatePicker
          onChange={handleChange}
          format="YYYY-MM-DD"  // Hiển thị ngày tháng rõ ràng
        />
      </div>
    );
  };
  const SelectMultipleWithSearch = ({ data, form }) => {
    const [selectedValues, setSelectedValues] = useState([]);
    const handleChange = (values) => {
      setSelectedValues(values);  // Cập nhật các giá trị đã chọn
      form.setFieldsValue({ songs: values });
    };

    return (
      <div>
        <Select
          mode="multiple"  // Cho phép chọn nhiều lựa chọn
          value={selectedValues}   // Các giá trị đã chọn
          onChange={handleChange}  // Cập nhật khi chọn hoặc bỏ chọn
          placeholder="Chọn nhiều"
          style={{ width: '100%' }}
          showSearch  // Bật tính năng tìm kiếm trong dropdown
          filterOption={(input, option) => {
            // Lọc các Option theo tên khi nhập tìm kiếm
            return option.children.toLowerCase().includes(input.toLowerCase());
          }}
        >
          {data.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    );
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
        <div className="z-1 absolute bottom-0 right-0 hover:text-white translate-x-[-50%] translate-y-[-100%]">
          <DropdownMenu />
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
        {
          user.albums_data == null ? <div className="text-center text-white text-sm">Bạn chưa có album nào</div>
          : <div className="flex items-center gap-5 ">
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
        }
        
        <div
          onClick={() => showModal({ type: "add" })}
          className="group rounded-xl transition-all duration-300 hover:bg-[var(--main-green)] hover:text-black text-[var(--light-gray3)] text-base cursor-pointer w-fit bg-[var(--light-gray1)] p-2 flex items-center gap-2"
        >
          <FaPlus />
          <span className="hidden group-hover:inline text-xs ">
            Thêm album
          </span>
        </div>
      </div>
      <div className="h-[70vh] overflow-y-auto  custom-scroll">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-items-center">
          {user.albums_data?.map((album, index) => (
            (album.status != 2 && (album.name.toLowerCase().includes(searchValue.toLowerCase()) && (selectValue == -1 || (album.status == selectValue)))) && <AlbumCard key={index} album={album} />
             
          ))}

        </div>
      </div>
      <FormAdd />
    </div>


  );
};

export default ArtistAlbums;
