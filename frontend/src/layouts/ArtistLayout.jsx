import { useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { Outlet, Link } from "react-router-dom";
import {
    HiOutlineMusicNote,
    HiOutlineCollection,
} from "react-icons/hi";
import '../index.css';
import PopupMenu from "../components/PopupMenu";
const { Header, Sider, Content } = Layout;

const ArtistLayout = () => {
    const navigate = useNavigate();
    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider collapsible >
                <div className="flex justify-center my-5" >
                    <img onClick={() => navigate("/", { replace: true })} src="https://tse4.mm.bing.net/th?id=OIP.TIk8dC3O2hUW2V_GfO94egHaHa&pid=Api&P=0&h=220" className="rounded-full w-[50%] cursor-pointer" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} >
                    <Menu.Item key="1" icon={<HiOutlineMusicNote />}>
                        <Link to="/artist">Bài hát</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<HiOutlineCollection />}>
                        <Link to="/artist/albums">Albums</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main Layout */}
            <Layout>
                <Header style={{ background: "#fff", padding: "0 40px 0 40px", textAlign: "center", fontSize: 20, display: "flex", justifyContent: "space-between" }}>
                    <h1>Welcome!</h1>
                    <div className="flex gap-2 items-center">
                        <span className="text-lg">Oanh le</span>
                    </div>

                </Header>
                <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
                    <Outlet /> {/* Hiển thị nội dung tương ứng với route */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ArtistLayout;