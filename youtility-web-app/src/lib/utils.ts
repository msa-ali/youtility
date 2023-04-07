import humanizeDuration from 'humanize-duration';
import parseUrl from 'parse-url';
import { YoutubeVideoDetail } from "@/types/youtube";

type URLParseResult = {
    isVideo: boolean;
    isPlaylist: boolean;
    isValid: boolean;
    videoId?: string;
};

export const isVideo = (url: URL) => url.hostname === "youtu.be" || (url.pathname === "/watch" && url.search.includes("?v="));
export const isPlaylist = (url: URL) => url.pathname === "/playlist" && url.search.includes("?list=");

export const parseURL = (text: string): URLParseResult  => {
    let result: URLParseResult = {
        isVideo: false,
        isPlaylist: false,
        isValid: false,
    };
    try {
        const url = parseUrl(text);
        const hostname = url.resource;
        if (hostname === "www.youtube.com") {
            if (url.pathname === "/watch") {
                const videoId = url.query["v"];
                if (!!videoId) {
                    result = {
                        ...result,
                        videoId,
                        isVideo: true,
                        isValid: true,
                    }
                }
            } else if (url.pathname === "/playlist") {
                if(!!url.query["list"]) {
                    result = {
                        ...result,
                        isPlaylist: true,
                        isValid: true,
                    }
                }
            }
        } else if(hostname === "youtu.be" && url.pathname?.length && url.pathname.startsWith("/")) {
            const videoId = url.pathname.replace("/", "");
            if (videoId.length > 0) {
                result = {
                    ...result,
                    videoId,
                    isVideo: true,
                    isValid: true,
                }
            }
        }
        return result;
    } catch (err) {
        return result;
    }
}

export const isValidURL = (text: string): boolean => {
    try {
        const url = new URL(text);
        const condition1 = url.hostname === "www.youtube.com" &&
            (isVideo(url) || isPlaylist(url)) &&
            url.search.split("=")[1].length > 0;
        const condition2 = url.hostname === "youtu.be" && url.pathname.length > 1;
        if (condition1 || condition2) {
            return true;
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