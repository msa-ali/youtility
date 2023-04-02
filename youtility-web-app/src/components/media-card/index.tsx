import { YoutubeVideoDetail } from "@/types/youtube"
import Dropdown, { DropdownItem } from "../dropdown"
import Image from "next/image"
import { limit } from "@/lib/utils";

import { BsDownload } from 'react-icons/bs';
import { BASE_URL } from "@/lib/axios";


interface Props extends YoutubeVideoDetail {
    url: string;
}

function MediaCard({ title, duration, thumbnail, url, formats }: Props) {
    console.log(formats);

    const options: DropdownItem[] = formats.map(format => {
        const mimeType = format.mimeType.split(';')[0];
        const isVideo = mimeType === "video/mp4";
        let label: string;
        if (isVideo) {
            label = `mp4 (${format.qualityLabel})`
        } else {
            const quality = format.audioQuality.split("_")[2]
            label = `mp3 (${quality?.toLowerCase()})`
        }
        return {
            label,
            value: format.itag.toString(),
        }
    });

    return (
        <div className="flex md:flex-row flex-col gap-2 mt-16 border-2 justify-center items-center shadow-lg">
            <div>
                <Image title={title} alt="video-thumbnail" src={thumbnail} width={300} height={200} loader={() => thumbnail} />
            </div>
            <div className="flex flex-col p-4 flex-nowrap">
                <div className="text-lg whitespace-nowrap md:tracking-wide" title={title}>{limit(title, 50)}</div>
                <div className="text-md text-xs text-gray-500 mt-1">{duration}</div>
                <div className="flex mt-4 justify-between">
                    <Dropdown
                        options={options}
                        value={options[0]}
                        onChange={(option) => console.log(option)}
                    />
                    <a
                        title="Download"
                        className="border rounded md:p-3 p-1 shadow bg-black text-white text-lg"
                        href={`${BASE_URL}/youtube/download?video_url=${url}`}
                    >
                        <BsDownload />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default MediaCard