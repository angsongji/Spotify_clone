

import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/admin/SideBar";
import PopupMenu from "../components/PopupMenu";
import {useApi} from "../context/ApiContext"
import "../index.css"
const AdminLayout = () => {
    const [title, setTitle] = useState("");
    const location = useLocation();
    const {user} = useApi();
    useEffect(() => {
        if(location.pathname === "/admin"){
            setTitle("Người dùng");
        }
        if(location.pathname === "/admin/songs"){
            setTitle("Bài hát");
        }
        if(location.pathname === "/admin/albums"){
            setTitle("Albums");
        }   
        if(location.pathname === "/admin/categorys"){
            setTitle("Thể loại");
        }
    }, [location.pathname]);
    return (
        <div className="flex w-full min-h-screen bg-black py-5 px-3 gap-3">
            <div className="w-1/6 bg-[var(--dark-gray)]  flex flex-col items-center rounded-2xl">
                <img src="/spotify_logo.jpg" className="w-1/3 h-auto my-5" alt="Logo" />
            <SideBar />
            </div>
            <div className="flex-1 flex flex-col text-[var(--light-gray3)]">
                <div className="h-fit flex justify-end items-center bg-black ">
                    <div className="font-bold text-xl pl-5 flex-1 bg-[var(--dark-gray)] h-full rounded-tl-xl rounded-tr-xl flex items-center ">
                        {title}
                    </div>
                    <div className="bg-black pb-2 pl-2 w-fit rounded-xl rounded-tr-none">
                    <div className="flex gap-2 items-center bg-[var(--dark-gray)] rounded-xl py-2 px-5 ">
                         <span className="text-base font-bold">{user.name}</span>
                         <PopupMenu role={1} />
                     </div>

                    </div>
                     
                </div>
                <div className="flex-1 bg-[var(--dark-gray)] rounded-bl-xl rounded-br-xl p-5 pb-0 rounded-tr-xl">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;
