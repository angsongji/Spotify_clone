import { useState, useEffect } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import { useApi } from "../../context/ApiContext";
import { CiCircleRemove } from "react-icons/ci";
import { Table, message } from "antd";

const ManageCategorys = () => {
    const [searchValue, setSearchValue] = useState("");
    const [categorys, setCategorys] = useState([]);
    const [filteredCategorys, setFilteredCategorys] = useState([]);
    const { fetchCategories, loading, fetchData } = useApi();
    const [showFormAddCategory, setShowFormAddCategory] = useState(false);

    useEffect(() => {
        const fetchDataCategorys = async () => {
            const fetchedCategorys = await fetchCategories();
            setCategorys(fetchedCategorys.message);
            setFilteredCategorys(fetchedCategorys.message);
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
                const addCategoryResponse = await fetchData("add-category/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: value }),
                });
                console.log(addCategoryResponse);
                if (addCategoryResponse?.status === 201) {
                    setCategorys((prev) => [...prev, addCategoryResponse.message]);
                    setShowFormAddCategory(false);
                    setValue("");
                    message.success("Thêm thể loại thành công");
                } else if (addCategoryResponse?.status === 400) {
                    // Giải thích rõ lỗi
                    const errorData = addCategoryResponse;
                    if (errorData?.name) {
                        message.error(`Lỗi: ${errorData.name[0]}`);
                    } else {
                        message.error("Thêm thể loại thất bại!");
                    }
                } else {
                    message.error("Thêm thất bại!");
                }
            } catch (error) {
                console.error("API Error", error);
                message.error("Lỗi mạng hoặc máy chủ!");
            }


        };
        return (
            <div className="z-10 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center gap-2">

                <form onSubmit={handleAddCategory} className="p-2 bg-[var(--dark-gray)] rounded-md shadow-md w-1/4 h-fit flex flex-col gap-2">
                    <CiCircleRemove className="text-white text-3xl cursor-pointer self-end " onClick={() => setShowFormAddCategory(false)} />
                    <div className="flex flex-col gap-5  p-2">
                        <label htmlFor="name">Tên thể loại</label>
                        <input required className="outline-none border-1 border-[var(--light-gray2)] rounded-sm p-1" name="name" type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                        <button className="cursor-pointer self-center bg-[var(--light-gray2)] w-fit text-white p-2 rounded-sm" type="submit" >Thêm thể loại</button>

                    </div>
                </form>
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
