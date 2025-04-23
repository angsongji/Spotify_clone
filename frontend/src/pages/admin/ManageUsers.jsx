import { useState, useEffect } from "react";
import { Select, Table, Dropdown, message } from "antd";
import { FaSearch, FaPlusCircle, FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { fetchUsers, updateUser } from "../../services/musicService";
import { signUp } from "../../services/authService";
const { Option } = Select;
const options = [
    { value: "all", label: "Tất cả" },
    { value: "user", label: "Người dùng" },
    { value: "artist", label: "Nghệ sĩ" },
    { value: "admin", label: "Admin" },
];

const ManageUsers = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectValue, setSelectValue] = useState("all");
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showFormAddUser, setShowFormAddUser] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchDataUsers = async () => {
            try {
                const fetchedUser = await fetchUsers();
                setUsers(fetchedUser.data.message);
                setFilteredUsers(fetchedUser.data.message);
            } catch (error) {
                console.log("Lỗi lấy users ", error.message);
            } finally {
                setLoading(false);
            }

        };
        fetchDataUsers();
    }, []);

    useEffect(() => {
        let filtered = [...users];

        if (selectValue !== "all") {
            filtered = filtered.filter((user) => user.role === selectValue);
        }

        if (searchValue) {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [selectValue, searchValue, users]);

    // Xử lý chọn menu
    const handleMenuClick = (key, record) => {
        if (key === "edit") {
            setUser(record);
        } else if (key === "delete") {
            console.log("Xóa:", record);
        }
    };

    const columns = [
        {
            title: "",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => (
                <div className="flex justify-center">
                    <img loading="lazy" src={avatar || "/user.png"} alt="Ảnh đại diện" className="w-10 h-auto aspect-square rounded-full object-cover" />
                </div>
            ),
        },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Họ và tên", dataIndex: "name", key: "name" },
        { title: "Tham gia", dataIndex: "created_at", key: "created_at" },
        { title: "Quyền", dataIndex: "role", key: "role" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status === 1 ? <span className="text-green-500">Hoạt động</span> : <span className="text-red-500">Khóa</span>,
        },
        {
            title: "",
            key: "action",
            render: (record) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: "edit", label: "Chỉnh sửa" },
                            { key: "delete", label: "Xóa", danger: true },
                        ],
                        onClick: ({ key }) => handleMenuClick(key, record),
                    }}
                    trigger={["click"]}
                >
                    <span className="cursor-pointer">
                        <FaEllipsisV className="text-gray-500 hover:text-[var(--main-green)]" />
                    </span>
                </Dropdown>
            ),
        },
    ];

    const FormAddUser = () => {
        const [valueName, setValueName] = useState("");
        const [valueEmail, setValueEmail] = useState("");
        const [valuePassword, setValuePassword] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const handleAddUser = async (e) => {
            e.preventDefault();

            try {
                const userData = {
                    name: valueName,
                    email: valueEmail,
                    password: valuePassword,
                };
                message.loading({ content: "Đang tạo tài khoản...", key: "add" });
                const addUserResponse = await signUp(userData);
                if (addUserResponse?.data.status === 201) {
                    console.log(addUserResponse);
                    setUsers((prev) => [...prev, addUserResponse.data.data.user]);
                    setShowFormAddUser(false);
                    setValueName("");
                    setValueEmail("");
                    setValuePassword("");
                    message.success({ content: addUserResponse.data.message, key: "add", duration: 2 });
                }
            } catch (error) {
                console.error("API Error", error);
                message.error({ content: error.message, key: "add", duration: 2 });
            }


        };
        return (
            <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col gap-2 w-1/4 ">
                    <HiX className="text-white text-3xl cursor-pointer self-end translate-x-[100%]" onClick={() => setShowFormAddUser(false)} />
                    <form onSubmit={handleAddUser} className="p-2 bg-[var(--dark-gray)] rounded-md w-full shadow-md h-fit flex flex-col gap-3">
                        <div className="flex flex-col gap-5  p-2">
                            <label htmlFor="name">Tên người dùng</label>
                            <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="name" type="text" value={valueName} onChange={(e) => setValueName(e.target.value)} />
                            <label htmlFor="email">Email</label>
                            <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="email" type="email" value={valueEmail} onChange={(e) => setValueEmail(e.target.value)} />
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="flex items-center gap-2 w-full">
                                <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="password" type={showPassword ? "text" : "password"} value={valuePassword} onChange={(e) => setValuePassword(e.target.value)} />
                                {showPassword ? <FaEye className="text-[var(--light-gray3)] cursor-pointer" onClick={() => setShowPassword(!showPassword)} /> : <FaEyeSlash className="text-[var(--light-gray3)] cursor-pointer" onClick={() => setShowPassword(!showPassword)} />}
                            </div>
                            <button className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm" type="submit" >Thêm người dùng</button>

                        </div>
                    </form>
                </div>

            </div>

        );
    };
    const FormUpdateUser = ({ user }) => {
        const [selectValueRole, setSelectValueRole] = useState(user.role);
        const [selectValueStatus, setSelectValueStatus] = useState(user.status);
        const optionsRole = [
            { value: "user", label: "Người dùng" },
            { value: "artist", label: "Nghệ sĩ" },
            { value: "admin", label: "Admin" },
        ];
        const optionsStatus = [
            { value: user.status, label: user.status == 1 ? "Hoạt động" : "Khóa" }
        ];
        if (user.status == 1) {
            optionsStatus.push({ value: 0, label: "Khóa" });
        }
        if (user.status == 0) {
            optionsStatus.push({ value: 1, label: "Hoạt động" });
        }
        const handleUpdateUser = async () => {
            let data = {};
            if (selectValueRole != user.role) {
                console.log(selectValueRole)
                data.role = selectValueRole;
            }
            if (selectValueStatus != user.status) {
                data.status = selectValueStatus;
            }
            if (Object.keys(data).length > 0) {
                try {
                    message.loading({ content: "Đang lưu...", key: "update" });
                    const updateUserResponse = await updateUser(user.id, data);

                    if (updateUserResponse?.status === 200) {
                        console.log(updateUserResponse);
                        setUsers(prev => prev.map(item => item.id === user.id ? updateUserResponse.data.message : item));
                        setUser({});
                        message.success({ content: "Cập nhật người dùng thành công", key: "update", duration: 2 });

                    }
                } catch (error) {
                    message.success({ content: error, key: "update", duration: 2 });

                }
            } else {
                message.error("Vui lòng chọn giá trị");
            }
        }
        return (
            <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col gap-2 w-1/4">
                    <HiX className="text-white text-3xl cursor-pointer self-end translate-x-[100%]" onClick={() => setUser({})} />
                    <div className="p-5 bg-[var(--dark-gray)] rounded-md shadow-md w-full h-fit flex flex-col gap-5">
                        <div className="flex gap-5 items-center w-full h-fit ">
                            <img loading="lazy" src={user.avatar} alt="Ảnh người dùng" className="w-1/3 h-auto object-cover rounded-md " />
                            <div className="text-white flex flex-col gap-2">
                                <div className="text-2xl font-bold">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.created_at}</div>
                            </div>
                        </div>

                        <div className="flex gap-5 items-center ">
                            Quyền:
                            <Select
                                style={{ width: 120 }}
                                onChange={setSelectValueRole}
                                defaultValue={selectValueRole}
                            >
                                {optionsRole.map((item, index) => (
                                    <Option key={index} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="flex gap-5 items-center">
                            Trạng thái:
                            <Select
                                style={{ width: 120 }}
                                onChange={setSelectValueStatus}
                                defaultValue={selectValueStatus}
                            >
                                {optionsStatus.map((item) => (
                                    <>
                                        {
                                            item.value !== -1 && <Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Option>

                                        }
                                    </>
                                ))}
                            </Select>
                        </div>
                        <button onClick={handleUpdateUser} className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm my-2" >Lưu</button>

                    </div>
                </div>


            </div>
        );
    }
    return (
        <div>
            {loading ? (
                <div className="loader-container min-h-[50vh] flex justify-center items-center">
                    <span className="loader">&nbsp;</span>
                </div>
            ) : (
                <div className="flex flex-col gap-7">
                    {showFormAddUser && <FormAddUser />}
                    {!!Object.keys(user).length && <FormUpdateUser user={user} />}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Họ và tên"
                                    className="bg-[var(--light-gray2)] text-white p-2 rounded-full w-full focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <FaSearch className="absolute left-2 top-0 translate-x-[50%] translate-y-[50%] text-[var(--light-gray3)]" />
                            </div>
                            <Select
                                style={{ width: 120 }}
                                placeholder="Chọn một mục"
                                onChange={setSelectValue}
                                defaultValue={selectValue}
                            >
                                {options.map((item) => (
                                    <Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <FaPlusCircle onClick={() => setShowFormAddUser(true)} className="cursor-pointer hover:text-white text-[var(--main-green)] text-2xl" />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        pagination={{ pageSize: 6 }}
                        scrollToFirstRowOnChange={true}
                        rowKey="email"
                    />
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
