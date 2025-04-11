import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import "../../index.css";
// const categories = [
//     {
//         id: "1231231",
//         name: "Pop",
//         status: 1
//     },
//     {
//         id: "1231231",
//         name: "Dunk",
//         status: 1
//     },
//     {
//         id: "1231231",
//         name: "Ballad",
//         status: 1
//     },
//     {
//         id: "1231231",
//         name: "Ballad",
//         status: 1
//     },
//     {
//         id: "1231231",
//         name: "Ballad",
//         status: 1
//     },
// ]
const Search = () => {
    const { generateLinearGradient, fetchCategories, setLoading, loading, SongCard, AlbumCard } = useApi();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("value");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data.message);
            } catch (error) {
                console.error("Lỗi khi tải categories:", error);
            } finally {
                setLoading(false); // Đặt loading thành false khi quá trình tải hoàn tất
            }
        };

        loadCategories();
    }, []); // Chạy lại khi id thay đổi

    const randomHexColor = () => {
        let hex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let value = generateLinearGradient(hex, 1, 0.5, 120);
        console.log(value);
        return value;
    };

    const CategoryCard = ({ category }) => {
        return <div className="cursor-pointer  w-full h-fit p-10 text-center transition-transform duration-300 hover:scale-105 rounded-sm"
            style={{ background: randomHexColor() }}>
            <h1 className="text-xl font-bold text-center text-white text-shadow"
                style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}>{category.name}</h1>
        </div>
    }
    const SearchCategory = () => {

        return <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {
                categories.map((item, index) => (
                    <CategoryCard key={index} category={item} />
                ))
            }
        </div>
    }

    const ArtistCard = ({ artist }) => {
        return <div className='cursor-pointer w-1/6 h-fit hover:bg-[var(--light-gray2)] p-2 rounded-sm'>
            <img loading="lazy" src="https://i.scdn.co/image/ab67616d00001e02f6b55ca93bd33211227b502b" alt="Album Cover" className="w-full h-auto object-cover aspect-square rounded-full" />
            <div className='text-xl text-white mt-3 mb-2'>{artist.name}</div>
            <div className='text-gray-500'>Nghe si</div>
        </div>
    }

    const SearchAll = () => {
        let artists = [
            {
                "name": "hoi chi"
            },
            {
                "name": "toi la Jack"
            }
        ];
        let songs = [];
        let albums = [];
        return <div className="p-2 ">
            <div>
                <div className='text-2xl font-bold text-white mb-10'>Nghệ sĩ</div>
                <div className='flex gap-5'>
                    {
                        artists.map((item, index) => (
                            <ArtistCard key={index} artist={item} />
                        ))
                    }
                </div>

            </div>

        </div>
    }
    return <>
        {
            !loading ? <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 py-10 px-5">
                {
                    query === "" ?
                        <SearchCategory /> :
                        <SearchAll />
                    // <div className="text-white">
                    //     <h2>Kết quả tìm kiếm</h2>
                    //     {query ? <p>Từ khóa: {query}</p> : <p>Vui lòng nhập từ khóa để tìm kiếm</p>}
                    // </div>
                }
            </div> :
                <div className='loader-container min-h-[50vh]'>
                    <span className="loader">&nbsp;</span>
                </div>
        }

    </>


};

export default Search;
