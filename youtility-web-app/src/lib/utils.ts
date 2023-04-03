import humanizeDuration from 'humanize-duration';
import { YoutubeVideoDetail } from "@/types/youtube";

export const isVideo = (url: URL) => url.pathname === "/watch" && url.search.includes("?v=");
export const isPlaylist = (url: URL) => url.pathname === "/playlist" && url.search.includes("?list=");

export const isValidURL = (text: string): boolean => {
    try {
        const url = new URL(text);
        if (
            url.hostname === "www.youtube.com" &&
            (isVideo(url) || isPlaylist(url)) &&
            url.search.split("=")[1].length > 0
        ) {
            return true
        }
        return false
    } catch (error) {
        return false;
    }
}

export function formatDuration(video: YoutubeVideoDetail): YoutubeVideoDetail {
    return {
        ...video,
        duration: humanizeDuration(video.duration as number),
    };
}

export function limit(str: string, length: number) {
    const strLen = str.length;
    return str.slice(0, length) + (strLen > length ? "..." : "");
}