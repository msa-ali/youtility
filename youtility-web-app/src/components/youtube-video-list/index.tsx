import { useSearch } from "@/context/search"
import useYoutubeVideoDetail from "@/hooks/use-youtube-video-detail";
import Loader from "../loader";
import MediaCard from "../media-card";
import Error from "../error";


function YoutubeVideoList() {
    const [url] = useSearch();

    const { data, loading, error } = useYoutubeVideoDetail(url);

    if (loading) {
        return <div className="w-full h-full self-center">
            <Loader />
        </div>;
    }

    if (error) {
        return (
            <Error>
                {error.response?.status === 400 ? <p className="text-sm">Please provide valid URL <span className="text-xl">🥹</span></p> : <p className="text-sm">OOPS! something went wrong!<span className="text-xl">🥹</span></p>}
            </Error>
        );
    }

    return (
        <div className="mb-4">
            {data.map(detail => (
                <MediaCard key={detail.videoId} {...detail} url={url} />
            ))}
        </div>
    )
}

export default YoutubeVideoList