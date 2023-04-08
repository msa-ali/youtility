import { YoutubeVideoDetail } from "@/types/youtube";
import { axios } from '@/lib/axios';
import { useEffect, useState } from "react";
import { formatDuration, parseURL } from "@/lib/utils";
import { AxiosError } from "axios";

const getYoutubeVideoDetail = (id: string): Promise<YoutubeVideoDetail[]> => {
    return axios.get(`/api/youtube/${id}`).then(res => res.data);
}

const getYoutubePlaylistDetail = (url: string): Promise<YoutubeVideoDetail[]> => {
    return axios.get('/api/youtube/playlist/details', {
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
        if (!url) {
            return;
        }
        const { isValid, isVideo, videoId } = parseURL(url);

        if (!isValid) {
            return;
        }

        setLoading(true);
        const fetchData = isVideo ? () => getYoutubeVideoDetail(videoId as string) : () => getYoutubePlaylistDetail(url);
        fetchData()
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