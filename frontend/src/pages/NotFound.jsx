import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const naigate = useNavigate();
    return <div className="bg-gradient-to-tl from-stone-900 to-neutral-700 text-white text-xl flex justify-center items-center h-screen bg-">
        <div className="flex flex-col gap-2 items-center ">
            <h1>❌ 404 - Không tìm thấy trang</h1>
            <div className="underline text-base cursor-pointer" onClick={() => naigate("/")}>Quay về trang chủ</div>
        </div>

    </div>;
};
export default NotFound;
