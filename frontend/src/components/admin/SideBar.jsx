import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMusicNote, HiOutlineCollection } from "react-icons/hi";
import { AiFillTags } from "react-icons/ai";
import {
    UserOutlined,
} from "@ant-design/icons";
import "../../index.css"
const chucnangs = [
    {
        name: "Người dùng",
        icon: <UserOutlined />,
        link: "/admin"
    },
    {
        name: "Bài hát",
        icon: <HiOutlineMusicNote />,
        link: "/admin/songs"
    },
    {
        name: "Albums",
        icon: <HiOutlineCollection />,
        link: "/admin/albums"
    },
    {
        name: "Thể loại",
        icon: <AiFillTags />,
        link: "/admin/categorys"
    },
];

function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const Card = ({ chucnang }) => (
        <div
            className={`flex items-center gap-2 justify-between p-3 rounded-lg hover:bg-[var(--light-gray1)] cursor-pointer transition-colors duration-200 text-[var(--light-gray3)] text-sm
                ${location.pathname === chucnang.link ? 'bg-[var(--light-gray1)]' : ''}`}
            onClick={() => navigate(chucnang.link)}
        >
            <div className="text-xl">{chucnang.icon}</div>
            <div className="font-medium">{chucnang.name}</div>
        </div>
    );

    return (
        <div className="flex flex-col gap-2 w-[15vw] p-2">
            {chucnangs.map((chucnang, index) => (
                <Card key={index} chucnang={chucnang} />
            ))}
        </div>
    );
}

export default SideBar;