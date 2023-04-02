import { useSearch } from "@/context/search"
import useYoutubeVideoDetail from "@/hooks/use-youtube-video-detail";
import Loader from "../loader";


function YoutubeVideoList() {
    const [url] = useSearch();

    const { data, loading, error } = useYoutubeVideoDetail(url);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error.message}</div>
    }

    return (
        <div >
            {data.map(detail => (
                <div key={detail.videoId} className="flex flex-col">
                    <div>{detail?.title}</div>
                    <div>{detail?.thumbnail}</div>
                    <div>{detail?.definition}</div>
                    <div>{detail?.duration}</div>
                </div>
            ))}
        </div>
    )
}

export default YoutubeVideoList