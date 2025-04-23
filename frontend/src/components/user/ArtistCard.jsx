import { useNavigate } from "react-router-dom";
const ArtistCard = ({ artist }) => {
    const navigate = useNavigate();
    return <div onClick={() => navigate(`/artist/${artist.id}`)} className="flex flex-col items-center w-full cursor-pointer">
        <div className="border-2 border-[var(--light-gray2)] hover:border-[var(--main-green)] rounded-full transition-all duration-300">
            <img loading="lazy" src={artist.avatar} alt={artist.name} className="w-full aspect-square rounded-full object-cover" />
        </div>
        <div className="text-white font-medium text-center text-base mt-2">{artist.name}</div>
        <div className="text-gray-400 text-sm">Nghệ sĩ</div>
    </div>
}

export default ArtistCard;