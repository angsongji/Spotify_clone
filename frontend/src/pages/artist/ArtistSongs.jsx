import React, { useState, useEffect } from "react";
import { useMusic } from "../../context/MusicContext";
import { useApi } from "../../context/ApiContext";
import { FaLock, FaSearch, FaPlus, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Select, Button, Modal, Form, Input, Upload, Image, DatePicker, TimePicker, Checkbox   } from "antd";
import {  VideoCameraOutlined, FileOutlined } from "@ant-design/icons";
import UploadImage from "../../components/artist/UploadImage"
import "../../index.css";
const { Option } = Select;
// Dữ liệu mẫu
const options = [
  { value: "1", label: "Tất cả" },
  { value: "2", label: "Riêng tư" },
  { value: "3", label: "Công khai" },
];
const ArtistSongs = () => {
  const [artists, setArtists] = useState([]);
  const [categories, setcategories] = useState([]);
  const { formatTime } = useMusic();
  const { user, transformFormatDate, fetchData,  fetchCategories, fetchArtist, setLoading, loading } = useApi();
  const [searchValue, setSearchValue] = useState("");
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
            console.log(categoriesData.message);
            console.log(artistsData.message);
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
    console.log("Adding song");

    try {
        // Tạo FormData chứa các file để upload
        const imageData = new FormData();
        const audioData = new FormData();
        const videoData = new FormData();

        let image = "https://s3-django-app-spotify-bucket.s3.amazonaws.com/images/chayngaydi.jpg";
        let audio = "https://s3-django-app-spotify-bucket.s3.us-east-1.amazonaws.com/audio/Ch%E1%BA%A1y+Ngay+%C4%90i+-+S%C6%A1n+T%C3%B9ng+M-TP.mp3";
        let video = "https://s3-django-app-spotify-bucket.s3.amazonaws.com/videos/run-now--sơn-tùng-m-tp--official-music-video---chạy-ngay-đi.mp4";

        // Tạo một danh sách các promises để upload
        // const uploadPromises = [];

        // // Bắt đầu upload image
        // if (values.image) {
        //     imageData.append("file", values.image);
        //     const uploadImagePromise = fetchData("upload/", {
        //         method: "POST",
        //         body: imageData,
        //     }).then(response => {
        //         if (response && response.status === 200) {
        //             image = response.message;
        //             console.log("Image uploaded successfully:", response.message);
        //         } else {
        //             throw new Error("Image upload failed");
        //         }
        //     });
        //     uploadPromises.push(uploadImagePromise);
        // }

        // // Bắt đầu upload audio
        // if (values.file_url) {
        //     audioData.append("file", values.file_url);
        //     const uploadAudioPromise = fetchData("upload/", {
        //         method: "POST",
        //         body: audioData,
        //     }).then(response => {
        //         if (response && response.status === 200) {
        //             audio = response.message;
        //             console.log("Audio uploaded successfully:", response.message);
        //         } else {
        //             throw new Error("Audio upload failed");
        //         }
        //     });
        //     uploadPromises.push(uploadAudioPromise);
        // }

        // // Bắt đầu upload video nếu có
        // if (values.video_url) {
        //     videoData.append("file", values.video_url);
        //     const uploadVideoPromise = fetchData("upload/", {
        //         method: "POST",
        //         body: videoData,
        //     }).then(response => {
        //         if (response && response.status === 200) {
        //             video = response.message;
        //             console.log("Video uploaded successfully:", response.message);
        //         }
        //     });
        //     uploadPromises.push(uploadVideoPromise);
        // }

        // Chờ tất cả các promises hoàn thành
        // await Promise.all(uploadPromises);

        // Tiếp tục xử lý sau khi tất cả các file đã được upload
        const songData = {
            name: values.name,
            image: image, // Đường dẫn của ảnh
            date: values.date,
            duration: values.duration,
            artists: Array.isArray(values.artists) ? [...values.artists, user.id] : [user.id],
            categories: values.categories,
            file_url: audio, // Đường dẫn của âm thanh
            video_url: video, // Đường dẫn của video
            // Các thông tin khác của bài hát
        };
        console.log(songData);
        // Thực hiện thêm bài hát qua API
        const addSongResponse = await fetchData("add-song/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(songData),
        });

        if (addSongResponse && addSongResponse.status === 201) {
            console.log("Song added successfully:", addSongResponse);
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
                <SelectWithCheckbox data={artists} form={formAdd} type="artists" />
              </Form.Item>
              <Form.Item
                label="Thể loại nhạc"
                name="categories"
                rules={[{ required: true, message: "Vui lòng chọn thể loại bài hát!" }]}
              >
                <SelectWithCheckbox data={categories} form={formAdd} type="categories" />
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
      <div className=" p-2 border-t-1 border-black">
        {mp3File && (
          <div style={{ marginTop: 10 }}>
            <audio controls>
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
            <video width="300" controls>
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
  const SongDatePicker = ({form}) => {
    const [selectedDate, setSelectedDate] = useState(null);
  
    const handleChange = (date, dateString) => {
      setSelectedDate(dateString); // Lưu dưới dạng YYYY-MM-DD
      form.setFieldsValue({date: dateString});
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
  const SongTimePicker = ({form}) => {
    const [selectedTime, setSelectedTime] = useState(null);
  
    const handleChange = (time) => {
      if (time) {
        const totalSeconds = time.minute() * 60 + time.second(); // Chuyển thành số giây
        setSelectedTime(totalSeconds);
        form.setFieldsValue({duration: totalSeconds});
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
  const SelectWithCheckbox = ({type, data, form}) => {
    const [selectedValues, setSelectedValues] = useState([]);
    const handleChange = (values) => {
      setSelectedValues(values);  // Cập nhật các giá trị đã chọn
      form.setFieldsValue({[type]: values});
    };
  
    return (
      <div>
        <Select
          mode="multiple"  // Cho phép chọn nhiều lựa chọn
          value={selectedValues}   // Các giá trị đã chọn
          onChange={handleChange}  // Cập nhật khi chọn hoặc bỏ chọn
          placeholder="Chọn nhiều"
          style={{ width: 300 }}
        >
          {
            data.map((item,index)=>(
              <Option key={index} value={item.id}>
                <Checkbox checked={selectedValues.includes(item.id)}>{item.name}</Checkbox>
              </Option>
            ))
          }
        </Select>
      </div>
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
          <div onClick={() => showModal({ type: "add" })} className="hover:bg-[var(--main-green)] hover:text-black text-[var(--light-gray3)] text-base cursor-pointer rounded-full bg-[var(--light-gray1)] p-2"><FaPlus /></div>
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
      <FormAdd />
    </div>


  );
};

export default ArtistSongs;
