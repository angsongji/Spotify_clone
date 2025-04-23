import { useNavigate } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";
import { HiKey } from "react-icons/hi";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Avatar } from "antd";
import { useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';

function PopupMenu({ role }) {
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    const handleMenuClick = ({ key }) => {
        const actions = {
            "1": () => alert("Hiện div hiện thông tin về email, tên, avatar,...\nCó nút cập nhật thông tin"),
            "2": () => alert("Hiện div để đổi pass: input pass hiện tại, input pass mới, input nhập lại pass mới"),
            "3": () => navigate("/artist", { replace: true }),
            "4": () => { setUser({}); localStorage.removeItem('user'); navigate("/", { replace: true }) },
        };
        actions[key]?.();
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" icon={<UserOutlined />}>
                Tài khoản
            </Menu.Item>
            <Menu.Item key="2" icon={<HiKey />}>
                Đổi mật khẩu
            </Menu.Item>
            {role === "artist" && (
                <Menu.Item key="3" icon={<GrUserAdmin />}>
                    Quản lí
                </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item key="4" icon={<LogoutOutlined />} className="!text-red-500">
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight">
            <div className="cursor-pointer p-0.5 bg-[var(--light-gray2)] rounded-full" >
                <Avatar src={user?.avatar ? user?.avatar : "/user.png"} size={40} />
            </div>
        </Dropdown>
    );
}

export default PopupMenu;
