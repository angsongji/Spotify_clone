import { useNavigate } from "react-router-dom";
import { Dropdown, Avatar } from "antd";
import { GrUserAdmin } from "react-icons/gr";
import {
    HiKey
} from "react-icons/hi";
import {
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

function PopupMenu({ role }) {
    const navigate = useNavigate();
    const menuItems = [
        {
            key: "1",
            label: "Tài khoản",
            icon: <UserOutlined />
        },
        {
            key: "2",
            label: "Đổi mật khẩu",
            icon: <HiKey />
        },
        {
            key: "4",
            label: "Đăng xuất",
            icon: <LogoutOutlined />
        }
    ];

    const artistMenuItems = [
        {
            key: "1",
            label: "Tài khoản",
            icon: <UserOutlined />
        },
        {
            key: "2",
            label: "Đổi mật khẩu",
            icon: <HiKey />
        },
        {
            key: "3",
            label: "Quản lí",
            icon: <GrUserAdmin />
        },
        {
            key: "4",
            label: "Đăng xuất",
            icon: <LogoutOutlined />
        }
    ];

    const chooseMenuItem = () => { //qui định 2 là artist
        return role === 2 ? artistMenuItems : menuItems;
    };

    const handleMenuClick = (e) => {
        if (e.key === "1") {
            alert("Hiện div hiện thông tin về email, tên, avatar,...\n Có nút cập nhật thông tin");
        } else if (e.key === "2") {
            alert("Hiện div để đổi pass: input pass hiện tại, input pass mới, input nhập lại pass mới");
        } else if (e.key === "3") {
            navigate("/artist", { replace: true });
        } else if (e.key === "4") {
            navigate("/", { replace: true });
        }
    };
    return <Dropdown menu={{ items: chooseMenuItem(), onClick: handleMenuClick }}>
        <Avatar
            size="large"
            src="https://tse4.mm.bing.net/th?id=OIP.TIk8dC3O2hUW2V_GfO94egHaHa&pid=Api&P=0&h=220"
            className="cursor-pointer"
        />
    </Dropdown>
}
export default PopupMenu;