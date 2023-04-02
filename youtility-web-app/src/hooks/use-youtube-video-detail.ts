import { YoutubeVideoDetail } from "@/types/youtube";
import { axios } from '@/lib/axios';
import { useEffect, useState } from "react";
import { formatDuration, isValidUrl } from "@/lib/utils";

const getYoutubeVideoDetail = (url: string): Promise<YoutubeVideoDetail[]> => {
    return axios.get('/youtube/details', {
        params: {
            video_url: url,
        },
    }).then(res => res.data);
}

const useYoutubeVideoDetail = (url: string) => {
    const [data, setData] = useState<YoutubeVideoDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
        if (!url || !isValidUrl(url)) {
            return;
        }
        setLoading(true);
        getYoutubeVideoDetail(url)
            .then(videos => {
                setData(videos.map(formatDuration));
                setError(undefined);
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false);
            })


    }, [url])
    return {data, loading, error};
}

export default useYoutubeVideoDetail;