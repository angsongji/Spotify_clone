import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ArtistLayout from "../layouts/ArtistLayout";
import Home from "../pages/user/Home";
import Playlist from "../pages/user/Playlist";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageSongs from "../pages/admin/ManageSongs";
import ManageRoles from "../pages/admin/ManageRoles";
import ManageAlbums from "../pages/admin/ManageAlbums";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import ArtistSongs from "../pages/artist/ArtistSongs";
import ArtistAlbums from "../pages/artist/ArtistAlbums";
import Artist from "../pages/user/Artist";
import Song from "../pages/user/Song";
import Album from "../pages/user/Album";
import ManageCategorys from "../pages/admin/ManageCategorys";
const router = createBrowserRouter([
    {
        path: "/", //Phần chung user và artist
        element: <UserLayout />, // Layout chung
        children: [
            { path: "", element: <Home /> },
            {
                path: "/artist/:id", //xem thông tin chi tiết của nghệ sĩ theo id nghệ sĩ
                element: <Artist />

            },
            {
                path: "/song/:songId", //xem thông tin chi tiết của bài hát theo id bài hát
                element: <Song />
            },
            {
                path: "/album/:id", //xem thông tin chi tiết của album theo id album
                element: <Album />
            },
            {
                path: "/playlist/:playlistId", //xem thông tin chi tiết của playlist theo id playlist
                element: <Playlist />
            },

        ],
    },
    {
        path: "/sign-in",
        element: <SignIn />
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/admin", //Phần quản lí của quyền quản trị
        element: <AdminLayout />,
        children: [
            { path: "", element: <ManageUsers /> },
            { path: "songs", element: <ManageSongs /> },
            { path: "albums", element: <ManageAlbums /> },
            { path: "categorys", element: <ManageCategorys /> },
            { path: "roles", element: <ManageRoles /> },
        ],
    },
    {
        path: "/artist", //Phần quản lí của nghệ sĩ: để nghệ sĩ quản lí bafihast, album của nghệ sĩ đó
        element: <ArtistLayout />, // Layout chung
        children: [
            { path: "", element: <ArtistSongs /> },
            { path: "albums", element: <ArtistAlbums /> },
        ],
    },


    { path: "*", element: <NotFound /> },
]);

export default router;

