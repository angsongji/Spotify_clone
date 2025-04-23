import { useState, useEffect } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { Table, message } from "antd";
import { fetchCategories, addCategory } from "../../services/musicService";
const ManageCategorys = () => {
    const [searchValue, setSearchValue] = useState("");
    const [categorys, setCategorys] = useState([]);
    const [filteredCategorys, setFilteredCategorys] = useState([]);
    const [showFormAddCategory, setShowFormAddCategory] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchDataCategorys = async () => {
            try {
                const fetchedCategorys = await fetchCategories();
                setCategorys(fetchedCategorys.data.message);
                setFilteredCategorys(fetchedCategorys.data.message);
            } catch (error) {
                console.log("Lỗi lấy thể loại ", error.message);
            } finally {
                setLoading(false);
            }

        };
        fetchDataCategorys();
    }, []);

    useEffect(() => {
        let filtered = [...categorys];

        if (searchValue) {
            filtered = filtered.filter((category) =>
                category.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredCategorys(filtered);
    }, [searchValue, categorys]);

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_text, _record, index) => index + 1,
        },
        { title: "Tên thể loại", dataIndex: "name", key: "name" },
    ];

    const FormAddCategory = () => {
        const [value, setValue] = useState("");
        const handleAddCategory = async (e) => {
            e.preventDefault();
            try {
                message.loading({ content: "Đang lưu...", key: "save" });

                const addCategoryResponse = await addCategory({ name: value });
                if (addCategoryResponse?.data.status === 201) {
                    setCategorys((prev) => [...prev, addCategoryResponse.data.message]);
                    setShowFormAddCategory(false);
                    setValue("");
                    message.success({ content: "Thêm thể loại thành công!", key: "save", duration: 2 });
                }
            } catch (error) {
                console.error("API Error", error);
                message.error({ content: "Lỗi mạng hoặc máy chủ!", key: "save", duration: 2 });
            }


        };
        return (
            <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col gap-2 w-1/4">
                    <HiX className="text-white text-3xl cursor-pointer self-end translate-x-[100%]" onClick={() => setShowFormAddCategory(false)} />
                    <form onSubmit={handleAddCategory} className="p-2 bg-[var(--dark-gray)] rounded-md shadow-md w-full h-fit flex flex-col gap-2">

                        <div className="flex flex-col gap-5  p-2">
                            <label htmlFor="name">Tên thể loại</label>
                            <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="name" type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                            <button className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm" type="submit" >Thêm thể loại</button>

                        </div>
                    </form>
                </div>

            </div>

        );
    };

    return (
        <div>
            {loading ? (
                <div className="loader-container min-h-[50vh] flex justify-center items-center">
                    <span className="loader">&nbsp;</span>
                </div>
            ) : (
                <div className="flex flex-col gap-7">
                    {showFormAddCategory && <FormAddCategory />}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tên thể loại"
                                    className="bg-[var(--light-gray2)] text-white p-2 rounded-full w-full focus:outline-none placeholder-[var(--light-gray3)] text-sm pl-10"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <FaSearch className="absolute left-2 top-0 translate-x-[50%] translate-y-[50%] text-[var(--light-gray3)]" />
                            </div>
                        </div>
                        <FaPlusCircle onClick={() => setShowFormAddCategory(true)} className="cursor-pointer hover:text-white text-[var(--main-green)] text-2xl" />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredCategorys}
                        pagination={{ pageSize: 9 }}
                        scrollToFirstRowOnChange={true}
                        rowKey="email"
                    />
                </div>
            )}
        </div>
    );
};

export default ManageCategorys;
