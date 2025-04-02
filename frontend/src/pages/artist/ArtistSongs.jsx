import React, { useState, useEffect } from "react";
import { useMusic } from "../../context/MusicContext";
import { useApi } from "../../context/ApiContext";
import { FaLock, FaSearch, FaPlus, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { Select, Button, Modal, Form, Input, Upload, DatePicker, TimePicker, Dropdown } from "antd";
import { VideoCameraOutlined, FileOutlined } from "@ant-design/icons";
import UploadImage from "../../components/artist/UploadImage"
import "../../index.css";
const { Option } = Select;
// Dữ liệu mẫu
const options = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Riêng tư" },
  { value: 1, label: "Công khai" },
];
const ArtistSongs = () => {
  const [artists, setArtists] = useState([]);
  const [categories, setcategories] = useState([]);
  const { setUser, user, transformFormatDate, fetchData, fetchCategories, fetchArtist, setLoading, loading } = useApi();
  const [searchValue, setSearchValue] = useState("");
  const [selectValue, setSelectValue] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formAdd] = Form.useForm();
  useEffect(() => {
    if (!isModalOpen) return; // Nếu modal chưa mở, không chạy effect

    const fetchDataAll = async () => {
      setLoading(true); // Bắt đầu loading

      try {
        const [artistsData, categoriesData] = await Promise.all([
          fetchArtist(),
          fetchCategories()
        ]);
        setcategories(categoriesData.message);
        setArtists(artistsData.message);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false); // Dừng loading khi tất cả API đã hoàn thành
      }
    };

    fetchDataAll();
  }, [isModalOpen]); // Chạy khi isModalOpen thay đổi

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };
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
  const handleChange = (value) => {
    setSelectValue(value);
  };
  //Xử lí hiện form
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
        await handleAddSong(values);
      }

      setIsModalOpen(false); // Đóng modal sau khi xử lý xong
      formAdd.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    } finally {
      setLoading(false); // Tắt loading khi xong
    }
  };


  const handleAddSong = async (values) => {


    try {
      let image = "https://s3-django-app-spotify-bucket.s3.us-east-1.amazonaws.com/images/giothiaicuoi.jpg";
      let audio = "https://s3-django-app-spotify-bucket.s3.us-east-1.amazonaws.com/audio/Gi%E1%BB%9D+Th%C3%AC+Ai+C%C6%B0%E1%BB%9Di+-+HIEUTHUHAI.mp3";
      let video = "https://s3-django-app-spotify-bucket.s3.us-east-1.amazonaws.com/videos/gi%E1%BB%9D-th%C3%AC-ai-c%C6%B0%E1%BB%9Di-prod-by-kewtiie-l-official-video---hieuthuhai.mp4";

      // Danh sách promises upload
      const uploadPromises = [];

      // Upload image
      if (values.image) {
        const imageData = new FormData();
        imageData.append("file", values.image);
        const uploadImagePromise = fetchData("upload/", {
          method: "POST",
          body: imageData,
        }).then(response => {
          if (response && response.status === 200) {

            return response.message; // Trả về URL
          } else {
            throw new Error("Image upload failed");
          }
        });

        uploadPromises.push(uploadImagePromise);
      } else {
        uploadPromises.push(Promise.resolve("")); // Giữ chỗ để không lỗi
      }

      // Upload audio
      if (values.file_url) {
        const audioData = new FormData();
        audioData.append("file", values.file_url);
        const uploadAudioPromise = fetchData("upload/", {
          method: "POST",
          body: audioData,
        }).then(response => {
          if (response && response.status === 200) {

            return response.message;
          } else {
            throw new Error("Audio upload failed");
          }
        });

        uploadPromises.push(uploadAudioPromise);
      } else {
        uploadPromises.push(Promise.resolve(""));
      }

      // Upload video nếu có
      if (values.video_url) {
        const videoData = new FormData();
        videoData.append("file", values.video_url);
        const uploadVideoPromise = fetchData("upload/", {
          method: "POST",
          body: videoData,
        }).then(response => {
          if (response && response.status === 200) {

            return response.message;
          }
        });

        uploadPromises.push(uploadVideoPromise);
      } else {
        uploadPromises.push(Promise.resolve(""));
      }

      // Chạy tất cả promise upload song song
      const [uploadedImage, uploadedAudio, uploadedVideo] = await Promise.all(uploadPromises);

      // Gán lại giá trị từ kết quả upload
      image = uploadedImage;
      audio = uploadedAudio;
      video = uploadedVideo;

      // Tạo dữ liệu bài hát sau khi upload xong
      const songData = {
        name: values.name,
        image: encodeURI(image),
        date: values.date,
        duration: values.duration,
        artists: Array.isArray(values.artists) ? [...values.artists, user.id] : [user.id],
        categories: values.categories,
        file_url: encodeURI(audio),
        video_url: encodeURI(video),
      };


      const addSongResponse = await fetchData("add-song/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });

      if (addSongResponse && addSongResponse.status === 201) {

        setUser(prevState => ({
          ...prevState,  // Giữ lại các giá trị trước trong user.
          songs_data: [...prevState.songs_data, addSongResponse.message]  // Thêm bài hát mới vào mảng songs_data.
        }));

      } else {
        throw new Error("Failed to add song");
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
      title="Thêm bài hát mới"
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
              <Form.Item
                label="Nhạc"
                name="file_url"
                rules={[{ required: true, message: "Vui lòng chọn file nhạc bài hát!" }]}
              >
                <UploadMP3 form={formAdd} />
              </Form.Item>
              <Form.Item label="Video" name="video_url">
                <UploadVideo form={formAdd} />
              </Form.Item>
            </div>

            <div className="flex-1">
              <Form.Item
                label="Tên bài hát"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên bài hát!" }]}
              >
                <Input className="!w-[300px]" />
              </Form.Item>
              <Form.Item
                label="Ngày phát hành"
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}
              >
                <SongDatePicker form={formAdd} />
              </Form.Item>
              <Form.Item
                label="Thời lượng"
                name="duration"
                rules={[{ required: true, message: "Vui lòng chọn thời lượng bài hát!" }]}
              >
                <SongTimePicker form={formAdd} />
              </Form.Item>
              <Form.Item label="Nghệ sĩ liên quan" name="artists">
                <SelectMultipleWithSearch data={artists} form={formAdd} type="artists" />
              </Form.Item>
              <Form.Item
                label="Thể loại nhạc"
                name="categories"
                rules={[{ required: true, message: "Vui lòng chọn thể loại bài hát!" }]}
              >
                <SelectMultipleWithSearch data={categories} form={formAdd} type="categories" />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );




  const UploadMP3 = ({ form }) => {
    const [mp3File, setMp3File] = useState(null);

    const handleChange = (info) => {
      const file = info.file;
      setMp3File(file);
      form.setFieldsValue({ file_url: info.file });
    };

    return (
      <div className="p-2 border-t-1 border-black">
        {mp3File && (
          <div style={{ marginTop: 10 }}>
            <audio key={mp3File.name} controls>
              <source src={URL.createObjectURL(mp3File)} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
            <p>{mp3File.name}</p>
          </div>
        )}
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChange}
          accept="audio/*"
        >
          <Button icon={<FileOutlined />}>Select MP3</Button>
        </Upload>
      </div>
    );
  };
  // Component upload Video
  const UploadVideo = ({ form }) => {
    const [videoFile, setVideoFile] = useState(null);

    const handleChange = (info) => {
      const file = info.file;
      setVideoFile(file);
      form.setFieldsValue({ video_url: info.file });
    };

    return (
      <div className=" p-2 border-t-1 border-black">
        {videoFile && (
          <div style={{ marginTop: 10 }}>
            <video key={videoFile.name} width="300" controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>{videoFile.name}</p>
          </div>
        )}
        <Upload
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChange}
          accept="video/*"
        >
          <Button icon={<VideoCameraOutlined />}>Select Video</Button>
        </Upload>


      </div>
    );
  };
  const SongDatePicker = ({ form }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleChange = (date, dateString) => {
      setSelectedDate(dateString); // Lưu dưới dạng YYYY-MM-DD
      form.setFieldsValue({ date: dateString });
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
  const SongTimePicker = ({ form }) => {
    const [selectedTime, setSelectedTime] = useState(null);

    const handleChange = (time) => {
      if (time) {
        const totalSeconds = time.minute() * 60 + time.second(); // Chuyển thành số giây
        setSelectedTime(totalSeconds);
        form.setFieldsValue({ duration: totalSeconds });
      } else {
        setSelectedTime(null);
      }
    };
    const disabledTime = () => ({
      disabledHours: () => Array.from({ length: 24 }, (_, i) => (i !== 0 ? i : null)).filter(i => i !== null),
      disabledMinutes: (hour) => (hour === 0 ? Array.from({ length: 60 }, (_, i) => (i >= 10 ? i : null)).filter(i => i !== null) : []),
      disabledSeconds: () => [],
    });
    return (
      <div>
        <TimePicker
          onChange={handleChange}
          format="mm:ss"  // Hiển thị giờ:phút:giây
          showNow={true}      // Nút chọn "Hiện tại"
          disabledTime={disabledTime}
        />
      </div>
    );
  };
  const SelectMultipleWithSearch = ({ type, data, form }) => {
    const [selectedValues, setSelectedValues] = useState([]);
    const handleChange = (values) => {
      setSelectedValues(values);  // Cập nhật các giá trị đã chọn
      form.setFieldsValue({ [type]: values });
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
          </div>


        </div>
        <div className="z-1 absolute bottom-2 right-0 hover:text-white">
          <DropdownMenu />
        </div>
        {/* Lớp nền đè lên */}
        {
          song.status == 0 && (
            <div className="absolute top-0 left-0 bg-[var(--light-gray1)] opacity-50 transition-opacity duration-300 bottom-0 right-0 flex items-center justify-center z-0 pointer-events-none">
              <div className="text-gray-500 text-sm font-semibold flex items-center gap-2">
                <FaLock /> Riêng tư
              </div>
            </div>
          )
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

        <div
          onClick={() => showModal({ type: "add" })}
          className="group rounded-xl transition-all duration-300 hover:bg-[var(--main-green)] hover:text-black text-[var(--light-gray3)] text-base cursor-pointer w-fit bg-[var(--light-gray1)] p-2 flex items-center gap-2"
        >
          <FaPlus />
          <span className="hidden group-hover:inline text-xs ">
            Thêm bài hát
          </span>
        </div>


      </div>


      <div className="h-[60vh] overflow-y-auto  custom-scroll">
        <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center">
          {user.songs_data.map((song, index) => (
            <>
              {
                (song.status != 2 && (song.name.toLowerCase().includes(searchValue.toLowerCase()) && (selectValue == -1 || (song.status == selectValue)))) && <SongCard key={index} song={song} />
              }
            </>
          ))}
        </div>
      </div>
      <FormAdd />
    </div>


  );
};

export default ArtistSongs;
