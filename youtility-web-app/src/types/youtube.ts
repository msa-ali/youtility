export interface YoutubeMediaFormat {
    itag: number;
    mimeType: string;
    qualityLabel: string;
    audioQuality: string;
    hasAudioChannel: boolean;
}


export interface YoutubeVideoDetail {
    videoId: string;
    title: string;
    thumbnail: string;
    duration: number | string;
    formats: YoutubeMediaFormat[];
}