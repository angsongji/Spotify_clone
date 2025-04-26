import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Image } from "antd";
const UploadImage = ({ form }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleChange = (info) => {
    const file = info.file; // Lấy file được chọn
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    form.setFieldsValue({ image: file });
  };

  return (
    <div className="p-2 border-t-1 border-black">
      {imageUrl && (
        <div style={{ marginTop: 10 }}>
          <Image width={200} src={imageUrl} alt="Selected Image" />
        </div>
      )}
      <Upload
        showUploadList={false}
        beforeUpload={() => false} // Chặn upload thật, chỉ chọn file
        onChange={handleChange}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Select Image</Button>
      </Upload>


    </div>
  );
};
export default UploadImage;