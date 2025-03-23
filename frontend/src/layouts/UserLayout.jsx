import { Outlet, Link } from "react-router-dom";
import AppBar from "../components/user/AppBar";
import SideBar from "../components/user/SideBar";
// import MusicQueue from "../components/user/MusicQueue";
import AudioBar from "../components/user/AudioBar";
import Footer from "../components/user/Footer";
import '../index.css';
import { useApi } from "../context/ApiContext";
const UserLayout = () => {
    const { loading } = useApi();
    return (
        <div className="bg-black flex flex-col h-screen">
            <AppBar />

            <div className="flex-1 flex  px-2 gap-2">
                {/* Sidebar - Menu trái */}
                <div className="w-[22.22%] bg-[var(--dark-gray)] rounded-lg">
                    <SideBar />
                </div>

                {/* Main Content - Nội dung chính */}
                <div className="relative flex-1 overflow-y-auto h-[80vh] rounded-lg custom-scroll">

                    <div className="">

                        <Outlet />{/* Nơi hiển thị các trang con theo đường dẫn cấu hình ở routes/index.jsx */}
                        <Footer />
                    </div>


                </div>


                {/* Right Panel - Panel phải */}
                {/* <div className="w-1/5 bg-[var(--dark-gray)] rounded-lg">
                    <MusicQueue />
                </div> */}
            </div>
            <AudioBar />
        </div>


    );
};

export default UserLayout;
