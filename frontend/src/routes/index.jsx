import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ArtistLayout from "../layouts/ArtistLayout";

// Lazy load pages
const Home = lazy(() => import("../pages/user/Home"));
const Playlist = lazy(() => import("../pages/user/Playlist"));
const Search = lazy(() => import("../pages/user/Search"));
const Artist = lazy(() => import("../pages/user/Artist"));
const Song = lazy(() => import("../pages/user/Song"));
const Album = lazy(() => import("../pages/user/Album"));

const SignIn = lazy(() => import("../pages/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp"));
const NotFound = lazy(() => import("../pages/NotFound"));

const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const ManageSongs = lazy(() => import("../pages/admin/ManageSongs"));
const ManageAlbums = lazy(() => import("../pages/admin/ManageAlbums"));
const ManageCategorys = lazy(() => import("../pages/admin/ManageCategorys"));

const ArtistSongs = lazy(() => import("../pages/artist/ArtistSongs"));
const ArtistAlbums = lazy(() => import("../pages/artist/ArtistAlbums"));

const router = createBrowserRouter([
    {
        path: "/", // Layout user
        element: <UserLayout />,
        children: [
            { path: "", element: <Home /> },
            { path: "search", element: <Search /> },
            { path: "artist/:id", element: <Artist /> },
            { path: "song/:songId", element: <Song /> },
            { path: "album/:id", element: <Album /> },
            { path: "playlist/:playlistId", element: <Playlist /> },
        ],
    },
    {
        path: "/sign-in",
        element: <SignIn />,
    },
    {
        path: "/sign-up",
        element: <SignUp />,
    },
    {
        path: "/admin", // Layout admin
        element: <AdminLayout />,
        children: [
            { path: "", element: <ManageUsers /> },
            { path: "songs", element: <ManageSongs /> },
            { path: "albums", element: <ManageAlbums /> },
            { path: "categorys", element: <ManageCategorys /> },
        ],
    },
    {
        path: "/artist", // Layout artist quản lý
        element: <ArtistLayout />,
        children: [
            { path: "", element: <ArtistSongs /> },
            { path: "albums", element: <ArtistAlbums /> },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
