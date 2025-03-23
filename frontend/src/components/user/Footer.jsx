import React from 'react'
import { FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa'
import "../../index.css";
const Footer = () => {
    return (
        <footer className=" text-white pt-10 py-10 bg-[var(--dark-gray)]" >
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 px-4">
                {/* Cột 1: Công ty */}
                <div>
                    <h4 className="font-bold text-lg mb-4">Công ty</h4>
                    <ul className="space-y-2">
                        <li>Giới thiệu</li>
                        <li>Việc làm</li>
                        <li>For the Record</li>
                    </ul>
                </div>

                {/* Cột 2: Cộng đồng */}
                <div>
                    <h4 className="font-bold text-lg mb-4">Cộng đồng</h4>
                    <ul className="space-y-2">
                        <li>Dành cho các Nghệ sĩ</li>
                        <li>Nhà phát triển</li>
                        <li>Quảng cáo</li>
                        <li>Nhà đầu tư</li>
                        <li>Nhà cung cấp</li>
                    </ul>
                </div>

                {/* Cột 3: Liên kết hữu ích */}
                <div>
                    <h4 className="font-bold text-lg mb-4">Liên kết hữu ích</h4>
                    <ul className="space-y-2">
                        <li>Hỗ trợ</li>
                        <li>Ứng dụng Di động Miễn phí</li>
                        <li>Các gói của Spotify</li>
                    </ul>
                </div>

                {/* Cột 4: Các gói Premium */}
                <div>
                    <h4 className="font-bold text-lg mb-4">Các gói của Spotify</h4>
                    <ul className="space-y-2">
                        <li>Premium Individual</li>
                        <li>Premium Student</li>
                        <li>Spotify Free</li>
                    </ul>
                </div>

                {/* Cột 5: Icons */}
                <div className="flex flex-col justify-between">
                    <div className="flex justify-center lg:justify-start gap-6 mt-4">
                        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebookF className="text-2xl hover:text-gray-400" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                            <FaInstagram className="text-2xl hover:text-gray-400" />
                        </a>
                        <a href="https://www.github.com" target="_blank" rel="noreferrer">
                            <FaGithub className="text-2xl hover:text-gray-400" />
                        </a>
                    </div>
                    <div className="w-full h-1/3 bg-auto bg-[url('./src/assets/logo2.svg') bg-center "></div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
