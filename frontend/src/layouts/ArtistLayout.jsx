import { Outlet } from "react-router-dom";
import AppBar from "../components/user/AppBar";
import SideBar from "../components/artist/SideBar";
import '../index.css';
const ArtistLayout = () => {
    return (
        <div className="bg-black flex flex-col h-screen">
            <AppBar />

            <div className="flex-1 flex  px-2 gap-2 pb-4">
                {/* Sidebar - Menu trái */}
                <div className="px-2 py-5 w-fit bg-[var(--dark-gray)] rounded-lg h-fit">
                    <SideBar />
                </div>

                {/* Main Content - Nội dung chính */}
                <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 relative flex-1  rounded-lg ">

                    <div>
                    <Outlet />
                    </div>
                    


                </div>

            </div>

        </div>


    );
};

export default ArtistLayout;
