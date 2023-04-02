import { useSearch } from "@/context/search"
import useYoutubeVideoDetail from "@/hooks/use-youtube-video-detail";
import Loader from "../loader";
import MediaCard from "../media-card";


function YoutubeVideoList() {
    const [url] = useSearch();

    const { data, loading, error } = useYoutubeVideoDetail(url);

    if (loading) {
        return <div className="w-full h-full self-center">
            <Loader />
        </div>;
    }

    if (error) {
        return <div>{error.message}</div>
    }

    return (
        <div >
            {data.map(detail => (
                <MediaCard key={detail.videoId} {...detail} />
            ))}
        </div>
    )
}

export default YoutubeVideoList