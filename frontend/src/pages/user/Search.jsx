import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategories } from "../../services/musicService";
import SongHeader from "../../components/user/SongHeader";
import SongCard from "../../components/user/SongCard";
import AlbumCard from "../../components/user/AlbumCard";
import { useColorUtils } from "../../hooks/useColorUtils";
import { useSelector } from 'react-redux';
const Search = () => {
    const { generateLinearGradient } = useColorUtils();
    const songs = useSelector(state => state.music.songs);
    const albums = useSelector(state => state.music.albums);
    const artists = useSelector(state => state.music.artists);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("value");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedOption, setSelectedOption] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchCategories();
                setCategories(data.data.message);
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
        return <div onClick={() => navigate(`/artist/${artist.id}`)} className='cursor-pointer w-full h-fit hover:bg-[var(--light-gray2)] p-3 rounded-sm'>
            <img loading="lazy" src={artist.avatar} alt="Album Cover" className="w-full h-auto object-cover aspect-square rounded-full" />
            <div className='text-base text-white mt-3 mb-1'>{artist.name}</div>
            <div className='text-gray-500 text-sm'>Nghệ sĩ</div>
        </div>
    }

    const SearchSongs = () => {
        const songsFilter = songs.filter((item) => {
            const matchName = item.name.toLowerCase().includes(query.toLowerCase());
            const matchCategory =
                selectedCategories.length === 0 || // Không lọc theo thể loại nếu mảng rỗng
                item.categories_data.some((category) =>
                    selectedCategories.includes(category.id) // hoặc category.name tùy bạn dùng gì
                );

            return matchName && matchCategory;
        });

        return <>
            {
                songsFilter.length != 0 && <div className='flex flex-col'>
                    <div className='text-2xl font-bold text-white'>Bài hát</div>
                    <SongHeader />
                    <div className='grid grid-cols-1'>
                        {
                            songsFilter.map((item, index) => (
                                <SongCard key={index} song={item} index={index} />
                            ))
                        }
                    </div>

                </div>
            }
        </>
    }

    const SearchArtists = () => {
        const artistsFilter = artists.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        return <>
            {
                artistsFilter.length != 0 && <div className='flex flex-col gap-5'>
                    <div className='text-2xl font-bold text-white'>Nghệ sĩ</div>
                    <div className='grid grid-cols-6'>
                        {
                            artistsFilter.map((item, index) => (
                                <ArtistCard key={index} artist={item} />
                            ))
                        }
                    </div>

                </div>
            }
        </>
    }

    const SearchAlbums = () => {
        const albumsFilter = albums.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        return <>
            {
                albumsFilter.length != 0 && <div className='flex flex-col gap-5'>
                    <div className='text-2xl font-bold text-white'>Album</div>
                    <div className='grid grid-cols-6 gap-4'>
                        {
                            albumsFilter.map((item, index) => (
                                <AlbumCard key={index} album={item} />
                            ))
                        }
                    </div>

                </div>
            }
        </>
    }



    const FilterButtons = ({ activeIndex }) => {

        const filters = [
            { key: 0, value: 'Tất cả' },
            { key: 1, value: 'Bài hát' },
            { key: 2, value: 'Nghệ sĩ' },
            { key: 3, value: 'Album' },
        ];

        return (
            <div className=" flex items-center mb-5 text-sm gap-2 px-2">
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        className={`cursor-pointer px-3 py-1 rounded-full transition-colors duration-300 ${activeIndex === filter.key
                            ? 'bg-[var(--main-green)] text-black' // Màu xanh khi active
                            : 'bg-[var(--light-gray2)] !text-gray-500 hover:bg-[var(--light-gray1)]'
                            }`}
                        onClick={() => setActiveIndex(filter.key)}
                    >
                        {filter.value}
                    </button>
                ))}
            </div>
        );
    };

    const FilterCategories = () => {


        const handleChangeRadio = (event) => {
            const checked = event.target.value;
            if (checked == 'all') setSelectedCategories([]);
            setSelectedOption(checked);
        };
        const handleChangeCheckbox = (id) => {
            const exists = selectedCategories.includes(id);
            if (exists) {
                // Bỏ id ra khỏi mảng
                setSelectedCategories((prev) => prev.filter((item) => item !== id));
            } else {
                // Thêm id vào mảng
                setSelectedCategories((prev) => [...prev, id]);
            }
        };

        return <div className='w-fit px-5 text-[var(--light-gray3)] text-sm  '>
            <div className=' py-1 mb-5 text-white'>Lọc bài hát theo thể loại</div>

            <form className='flex flex-col gap-2'>
                <label className='flex gap-2 items-center'>
                    <input type="radio" name="radio" value="all" checked={selectedOption === 'all'} onChange={handleChangeRadio} />
                    Tất cả
                </label>
                <hr />
                <label className='flex gap-2 items-center'>
                    <input type="radio" name="radio" value="other" checked={selectedOption === 'other'} onChange={handleChangeRadio} />
                    Khác
                </label>
            </form>
            {
                selectedOption === 'other' && <div className='flex flex-col gap-1 my-2 h-[70%] overflow-y-auto custom-scroll'>
                    {
                        categories.map((item, index) => (
                            <div key={index} className='flex gap-2 items-center'>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(item.id)}
                                    onChange={(e) => {
                                        if (selectedOption !== 'other') setSelectedOption('other');
                                        handleChangeCheckbox(item.id);
                                    }}
                                />
                                <span>{item.name}</span>
                            </div>
                        ))
                    }

                </div>
            }
        </div>
    }
    return <>
        {
            !loading ? <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 py-10 px-5 h-screen">
                <div className='flex gap-2 h-full'>
                    <FilterCategories />
                    <div className='flex-1'>
                        <FilterButtons activeIndex={activeIndex} />
                        <div className='h-[90%] overflow-y-auto p-2 flex flex-col gap-10 custom-scroll'>
                            {
                                (activeIndex == 0 || activeIndex == 1) && <SearchSongs />
                            }
                            {
                                (activeIndex == 0 || activeIndex == 2) && <SearchArtists />
                            }
                            {
                                (activeIndex == 0 || activeIndex == 3) && <SearchAlbums />
                            }

                        </div>
                    </div>
                </div>

            </div> :
                <div className='loader-container min-h-[50vh]'>
                    <span className="loader">&nbsp;</span>
                </div>
        }

    </>


};

export default Search;
