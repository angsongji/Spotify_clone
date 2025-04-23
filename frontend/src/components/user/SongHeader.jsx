import { BiTime } from "react-icons/bi";

const SongHeader = () => {
    return (
        <div className="h-15 w-full flex justify-between items-center py-2 px-5 text-sm text-gray-400">
            <div className="flex items-center gap-5 w-3/5">
                <div className="text-center">#</div>
                <div>Tiêu đề</div>
            </div>
            <div className="flex-1">Nghệ sĩ</div>
            <div className="flex justify-start w-17">
                <BiTime className="w-5 h-5" />
            </div>
        </div>
    );
};

export default SongHeader;
