import { YoutubeVideoDetail } from "@/types/youtube";
import { axios } from '@/lib/axios';
import { useEffect, useState } from "react";
import { formatDuration, isValidURL, isVideo } from "@/lib/utils";
import { AxiosError } from "axios";

const getYoutubeVideoDetail = (url: string): Promise<YoutubeVideoDetail[]> => {
    return axios.get('/youtube/details', {
        params: {
            video_url: url,
        },
    }).then(res => res.data);
}

const getYoutubePlaylistDetail = (url: string): Promise<YoutubeVideoDetail[]> => {
    return axios.get('/youtube/playlist/details', {
        params: {
            playlist_url: url,
        },
    }).then(res => res.data);
}



const useYoutubeVideoDetail = (url: string) => {
    const [data, setData] = useState<YoutubeVideoDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | undefined>();

    useEffect(() => {
        if (!url || !isValidURL(url)) {
            return;
        }
        setLoading(true);
        const fetchData = isVideo(new URL(url)) ? getYoutubeVideoDetail : getYoutubePlaylistDetail;
        fetchData(url)
            .then(videos => {
                setData(videos.map(formatDuration));
                setError(undefined);
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false);
            })


    }, [url])
    return { data, loading, error };
}

export default useYoutubeVideoDetail;