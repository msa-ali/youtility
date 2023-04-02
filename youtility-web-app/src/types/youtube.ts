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
    definition: string;
    duration: string;
    formats: YoutubeMediaFormat[];
}