import { parse, toSeconds } from "iso8601-duration";
import humanizeDuration from 'humanize-duration';
import { YoutubeVideoDetail } from "@/types/youtube";

export const isValidURL = (text: string): boolean => {
    try {
        const url = new URL(text);
        if (
            url.hostname === "www.youtube.com" &&
            (url.pathname === "/watch" && url.search.includes("?v=") ||
                url.pathname === "/playlist" && url.search.includes("?list=")) &&
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
        duration: humanizeDuration(toSeconds(parse(video.duration)) * 1000),
    };
}

export function limit(str: string, length: number) {
    const strLen = str.length;
    return str.slice(0, length) + (strLen > length ? "..." : "");
}