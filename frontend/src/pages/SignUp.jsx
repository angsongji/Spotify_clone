import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpotify, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { message, Spin } from 'antd';
import UploadImage from '../components/UploadImage'
import { signUp } from "../services/authService";
import { GrFormNextLink } from "react-icons/gr";
import { uploadFile, addAlbum, updateSong } from "../services/musicService";
import { Form, Modal } from 'antd';
const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [showFormAccount, setShowFormAccount] = useState(true);
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra password match
        if (formData.password !== formData.confirmPassword) {
            console.log('sai');
            message.error('Mật khẩu không khớp!');
            return;
        }

        setIsLoading(true);

        try {

            const dataAccount = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
            const response = await signUp(dataAccount);

            const data = response.data;
            console.log('Response:', data);

            if (data.success) {
                message.success({
                    content: 'Đăng ký thành công!',
                    duration: 2
                });
                setTimeout(() => {
                    navigate('/sign-in');
                }, 1000);
            } else {
                message.error({
                    content: data.message || 'Đăng ký thất bại',
                    duration: 3
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            message.error({
                content: 'Lỗi kết nối server',
                duration: 3
            });

        } finally {
            setIsLoading(false);
        }
    };

    //onSubmit={handleSubmit}
    const FormAccount = () => {
        const [accountData, setAccountData] = useState(formData);
        const [showPass, setShowPass] = useState(false);
        const showFormInfor = (e) => {
            e.preventDefault();
            if (accountData.password !== accountData.confirmPassword) {
                message.error('Mật khẩu nhập lại không khớp!');
                return;
            }
            setFormData(accountData);
            setShowFormAccount(false);
        }

        return <form onSubmit={showFormInfor} className=" w-full  flex flex-col justify-center gap-10  !text-[var(--light-gray3)]">
            <div className=''>
                <div className="input-animation ">
                    <input name="email"
                        placeholder=" "
                        type="email"
                        className='border-1 !border-[var(--light-gray2)] '
                        value={accountData.email}
                        onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                        required
                        disabled={isLoading} />
                    <label for="email">Email</label>
                </div>
            </div>
            <div className='flex gap-2 '>
                {/* Input sẽ chiếm phần còn lại */}
                <div className='flex-1'>
                    <div className="input-animation">
                        <input
                            name="password"
                            placeholder=" "
                            type={showPass ? "text" : "password"}
                            className='w-full border-1 !border-[var(--light-gray2)]'
                            value={accountData.password}
                            onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                        <label htmlFor="password">Mật khẩu</label>
                    </div>
                </div>

                {/* Phần tử còn lại */}
                <div className='text-[var(--light-gray3)] text-2xl flex items-center cursor-pointer' onClick={() => setShowPass(!showPass)}>{showPass ? <FaRegEyeSlash /> : <FaRegEye />}</div>
            </div>


            <div className=''>
                <div className="input-animation">
                    <input
                        type="password"
                        name="confirmPassword"
                        value={accountData.confirmPassword}
                        placeholder=" "
                        className='w-full border-1 !border-[var(--light-gray2)]'

                        onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        disabled={isLoading}
                    />
                    <label htmlFor="password">Nhập lại mật khẩu</label>
                </div>
            </div>


            <button
                type="submit"
                disabled={isLoading}
                className={` w-fit   !mt-10 !mb-5 px-10   rounded-full font-medium text-white self-center
                            ${isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'border-[var(--light-gray2)] border-1 hover:bg-[#1ed760]  transform hover:scale-105 transition-all  cursor-pointer'
                    }`}
            ><GrFormNextLink size={40} className='text-[var(--light-gray2)] ' />
            </button>



        </form>
    }

    const FormInfor = () => {
        const [formInfor] = Form.useForm();
        const [isLoading, setIsLoading] = useState(false);
        const handleSubmit = async (values) => {
            console.log("Form Values: ", values);

            try {
                setIsLoading(true);
                let image = "";

                // Upload image
                if (values.image) {
                    const imageData = new FormData();
                    imageData.append("file", values.image);

                    const res = await uploadFile(imageData);
                    if (res.status === 200) {
                        image = encodeURI(res.data.message);
                    } else {
                        throw new Error("Image upload failed");
                    }
                }

                console.log("image ", image);

                // Tạo album sau khi upload xong ảnh
                setFormData((prev) => ({
                    ...prev,
                    name: values.name,
                    image: encodeURI(image),     // ghi đè lại image nếu cần
                }));
                console.log("image ", image);


                console.log("noi dung form ", formData)
                const response = await signUp(formData);

                const data = response.data;
                console.log('Response:', data);

                if (data.success) {
                    message.success({
                        content: 'Đăng ký thành công!',
                        duration: 2
                    });
                    setTimeout(() => {
                        navigate('/sign-in');
                    }, 1000);
                } else {
                    message.error({
                        content: data.message || 'Đăng ký thất bại',
                        duration: 3
                    });
                }
            } catch (error) {
                console.error("Error adding song:", error);
            } finally {
                setIsLoading(false);
            }
        };
        return (<>
            <div className='text-sm underline cursor-pointer text-white mb-8' onClick={() => setShowFormAccount(true)}>&lt; Quay lại</div>
            <Form form={formInfor} onFinish={handleSubmit} className='w-full '>
                <div className="flex flex-col  gap-4  h-[40vh] !text-[var(--light-gray3)] overflow-y-auto custom-scroll">
                    <div className="flex flex-col gap-2">
                        <div>
                            Chọn ảnh đại diện
                        </div>
                        <Form.Item
                            name="image"
                            rules={[{ required: true, message: "Vui lòng chọn ảnh đại diện!" }]}
                        >
                            <UploadImage form={formInfor} />
                        </Form.Item>
                    </div>

                    <div className="flex-1 ">
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Nhập tên của bạn!" }]}
                        >
                            <div className="input-animation">
                                <input
                                    placeholder=" "
                                    type="text"
                                    className="!text-base border-1 !border-[var(--light-gray2)] !text-[var(--light-gray3)]"
                                    disabled={isLoading}
                                />
                                <label htmlFor="name">Họ và tên</label>
                            </div>
                        </Form.Item>
                    </div>
                </div>

                {/* Submit button */}
                <div className='flex items-center justify-center'>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={` w-fit   !mb-5 px-10   rounded-full font-medium text-white self-center
                            ${isLoading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'border-[var(--light-gray2)] border-1 hover:bg-[#1ed760]  transform hover:scale-105 transition-all  cursor-pointer'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center my-3">
                                <svg className="animate-spin h-5 w-5 " viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>

                            </div>
                        ) : <GrFormNextLink size={40} className='text-[var(--light-gray2)] ' />}
                    </button>
                </div>
            </Form>
        </>);


    }
    // const FormInfor = () => {
    //     const [file, setFile] = useState(null);
    //     const [inforData, setInforData] = useState(formData);

    //     const handleFileChange = (e) => {
    //         const selectedFile = e.target.files[0];
    //         setFile(selectedFile);
    //         setFileName(selectedFile ? selectedFile.name : 'No file chosen');
    //     };

    //     const handleSubmit = async () => {
    //         if (!file) {
    //             alert('Please choose a file');
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append('file', file);

    //         // Ví dụ: Gửi ảnh lên server (dùng API)
    //         try {
    //             const response = await fetch('/upload', {
    //                 method: 'POST',
    //                 body: formData,
    //             });

    //             if (response.ok) {
    //                 alert('File uploaded successfully');
    //             } else {
    //                 alert('Error uploading file');
    //             }
    //         } catch (error) {
    //             alert('Error: ' + error.message);
    //         }
    //     };

    //     return <div className='text-[var(--light-gray3)] flex flex-col gap-10'>
    //         <div className='text-sm underline cursor-pointer text-white' onClick={() => setShowFormAccount(true)}>&lt; Quay lại</div>
    //         <form onSubmit={handleSubmit} className=" w-full  flex flex-col justify-center gap-10  !text-[var(--light-gray3)]">
    //             <div className='flex flex-col gap-3'>
    //                 <div>
    //                     Chọn ảnh đại diện
    //                 </div>
    //                 <input type="file" />
    //             </div>
    //             <div className="flex items-center space-x-4">
    //                 {/* Hidden native input */}
    //                 <input
    //                     id="file-input"
    //                     type="file"
    //                     className="hidden"
    //                     onChange={handleFileChange}
    //                 />

    //                 {/* Styled label acting as button */}
    //                 <label
    //                     htmlFor="file-input"
    //                     className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow"
    //                 >
    //                     <span>Choose File</span>
    //                 </label>

    //                 {/* Display selected file name */}
    //                 <span className="text-gray-700 italic">{file?.name}</span>

    //                 {/* Submit button to upload file */}
    //                 <button
    //                     onClick={handleSubmit}
    //                     className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow ml-4"
    //                 >
    //                     Upload
    //                 </button>
    //             </div>
    //             <div className=''>
    //                 <div className="input-animation ">
    //                     <input name="name"
    //                         placeholder=" "
    //                         type="text"
    //                         className='border-1 !border-[var(--light-gray2)] '
    //                         value={inforData.name}
    //                         onChange={(e) => setInforData({ ...inforData, name: e.target.value })}
    //                         required
    //                         disabled={isLoading} />
    //                     <label for="name">Họ và tên</label>
    //                 </div>
    //             </div>

    //             <div onClick={() => console.log("infor ", inforData)}>click</div>

    //             <div className='flex items-center justify-center'>
    //                 <button
    //                     type="submit"
    //                     disabled={isLoading}
    //                     className={` w-fit  !mt-15 !mb-5 px-10   rounded-full font-medium text-white self-center
    //             ${isLoading
    //                             ? 'bg-gray-600 cursor-not-allowed'
    //                             : 'border-[var(--light-gray2)] border-1 hover:bg-[#1ed760]  transform hover:scale-105 transition-all  cursor-pointer'
    //                         }`}>
    //                     {isLoading ? (
    //                         <div className="flex items-center justify-center my-3">
    //                             <svg className="animate-spin h-5 w-5 " viewBox="0 0 24 24">
    //                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    //                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    //                             </svg>

    //                         </div>
    //                     ) : <GrFormNextLink size={40} className='text-[var(--light-gray2)] ' />}
    //                 </button>
    //             </div>
    //         </form>

    //     </div>
    // }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black ">
            <div className='absolute flex gap-2 top-[3vw] left-[3vw]  items-center cursor-pointer' onClick={() => navigate("/")}>
                <FaSpotify className="text-[var(--main-green)] text-4xl " />
                <div className='text-3xl font-bold text-[var(--light-gray3)]'>Spotify</div>
            </div>
            <div className="w-full max-w-[30vw] bg-[var(--dark-gray)] rounded-lg shadow-lg pt-20 px-10 pb-2" style={{ 'box-shadow': 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px' }}>
                <div className="flex flex-col items-center mb-10">

                    <div className="text-[var(--light-gray3)] text-xl font-bold">Đăng ký</div>
                </div>

                {showFormAccount ? <FormAccount /> : <FormInfor />}
                {/* <FormInfor /> */}
                <div className="text-center text-sm">
                    <p className="text-gray-400">
                        Đã có tài khoản?{' '}
                        <Link to="/sign-in" className="text-[#1DB954] hover:text-[#1ed760] font-medium">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
