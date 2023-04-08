import { YoutubeVideoDetail } from "@/types/youtube"
import Dropdown, { DropdownItem } from "../dropdown"
import Image from "next/image"
import { limit } from "@/lib/utils";

import { BsDownload } from 'react-icons/bs';
import { GoMute } from 'react-icons/go';
import { BASE_URL } from "@/lib/axios";
import { useCallback, useMemo, useState } from "react";


interface Props extends YoutubeVideoDetail {
    url: string;
}

function MediaCard({ title, duration, thumbnail, url, formats, videoId }: Props) {
    const sortedOptions = [...formats.filter(f => f.hasAudioChannel), ...formats.filter(f => !f.hasAudioChannel)]
    const options: DropdownItem[] = useMemo(() => sortedOptions.map(format => {
        const mimeType = format.mimeType.split(';')[0];
        const isVideo = mimeType === "video/mp4";
        let label: React.ReactNode;
        if (isVideo) {
            label = <span className="flex justify-center items-center gap-2">
                mp4 ({format.qualityLabel}) 
                {!format.hasAudioChannel ? <GoMute title="No audio available for this video format" /> : null } 
                </span>
        } else {
            const quality = format.audioQuality.split("_")[2]
            label = <span className="flex justify-center items-center gap-2">mp3 ({quality?.toLowerCase()})</span>
        }
        return {
            label,
            value: format.itag.toString(),
        }
    }), [formats]);

    

    const [format, setFormat] = useState(options[0]);

    const onFormatChange = useCallback((option: DropdownItem) => setFormat(option), []);

    return (
        <div className="flex md:flex-row flex-col gap-2 mt-8 mb-8 border-2 justify-center items-center shadow-lg">
            <div>
                <Image title={title} alt="video-thumbnail" src={thumbnail} width={300} height={200} loader={() => thumbnail} />
            </div>
            <div className="flex flex-col p-4 flex-nowrap">
                <div className="text-lg md:whitespace-nowrap md:tracking-wide whitespace-pre-wrap" title={title}>{limit(title, 50)}</div>
                <div className="text-md text-xs text-gray-500 mt-1">{duration}</div>
                <div className="flex mt-4 justify-between">
                    <Dropdown
                        options={options}
                        value={format}
                        onChange={onFormatChange}
                    />
                    <a
                        title="Download"
                        className="border rounded md:p-3 px-2 py-1 shadow bg-black text-white text-lg flex justify-center items-center"
                        href={`${BASE_URL}/api/youtube/download/${videoId}/${format.value}`}
                    >
                        <BsDownload />&nbsp; Download
                    </a>
                </div>
            </div>
        </div>
    )
}

export default MediaCard