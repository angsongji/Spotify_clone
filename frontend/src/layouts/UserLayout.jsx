
import { Outlet } from "react-router-dom";
import AppBar from "../components/user/AppBar";
import SideBar from "../components/user/SideBar";
import AudioBar from "../components/user/AudioBar/AudioBar";
import Footer from "../components/user/Footer";
import ChatList from "../components/user/ChatList";
import { useSelector } from "react-redux"
const UserLayout = () => {
    const user = useSelector(state => state.user.user);
    return (
        <div className="bg-black flex flex-col h-screen">
            <AppBar />

            <div className="flex-1 flex  px-2 gap-2">
                {/* Sidebar - Menu trái */}
                <div className="px-2 py-5 w-fit bg-[var(--dark-gray)] rounded-lg">
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
                {
                    user && <div className="w-fit bg-[var(--dark-gray)] rounded-lg">
                        <ChatList />
                    </div>
                }

            </div>
            <AudioBar />
        </div>


    );
};

export default UserLayout;
