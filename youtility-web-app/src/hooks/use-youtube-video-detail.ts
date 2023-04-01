
import { useMemo } from "react";
import useAxios from "./use-axios";
import { AxiosRequestConfig } from "axios";
import { YoutubeVideoDetail } from "@/types/youtube";

const useYoutubeVideoDetail = (url: string) => {
    const requestConfig: AxiosRequestConfig<YoutubeVideoDetail> = useMemo(() => ({
        url: '/youtube/details',
        params: {
            video_url: url,
        },
    }), [url]);

    const [state] = useAxios(
        requestConfig, 
        useMemo(() => ({ preventRequest: () => !url }), [url]),
    );
    return state;
}

export default useYoutubeVideoDetail;