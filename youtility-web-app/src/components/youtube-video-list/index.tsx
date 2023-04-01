import { useSearch } from "@/context/search"
import useYoutubeVideoDetail from "@/hooks/use-youtube-video-detail";


function YoutubeVideoList() {
    const [url] = useSearch();

    const { data, loading, error } = useYoutubeVideoDetail(url);

    if(loading) {
        return <div>loading...</div>
    }

    if(error) {
        return <div>{error.message}</div>
    }

    return (
        <>
        <div>{data?.videoId}</div>
        <div>{data?.title}</div>
        <div>{data?.thumbnail}</div>
        <div>{data?.definition}</div>
        </>
    )
}

export default YoutubeVideoList