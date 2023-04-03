export interface YoutubeMediaFormat {
    itag: number;
    mimeType: string;
    qualityLabel: string;
    audioQuality: string;
}


export interface YoutubeVideoDetail {
    videoId: string;
    title: string;
    thumbnail: string;
    duration: number | string;
    formats: YoutubeMediaFormat[];
}