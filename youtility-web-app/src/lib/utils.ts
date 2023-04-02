import { parse, toSeconds } from "iso8601-duration";
import humanizeDuration from 'humanize-duration';
import { YoutubeVideoDetail } from "@/types/youtube";

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

export function formatDuration(video: YoutubeVideoDetail): YoutubeVideoDetail {
    return {
        ...video,
        duration: humanizeDuration(toSeconds(parse(video.duration)) * 1000),
    };
}