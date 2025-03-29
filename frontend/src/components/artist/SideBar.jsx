import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMusicNote, HiOutlineCollection } from "react-icons/hi";
import "../../index.css"
const chucnangs = [
    {
        name: "Bài hát",
        icon: <HiOutlineMusicNote />,
        link: "/artist"
    },
    {
        name: "Albums",
        icon: <HiOutlineCollection />,
        link: "/artist/albums"
    }
];

function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const Card = ({chucnang}) => (
        <div 
            className={`flex items-center gap-2 justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-gray-700 text-sm
                ${location.pathname === chucnang.link ? 'bg-gray-100' : ''}`}
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
