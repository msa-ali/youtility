import { YoutubeVideoDetail } from "@/types/youtube"
import Dropdown from "../dropdown"
import Image from "next/image"
import { limit } from "@/lib/utils";

import { BsDownload } from 'react-icons/bs';
import { BASE_URL } from "@/lib/axios";


interface Props extends YoutubeVideoDetail {
    url: string;
}

function MediaCard({  title, duration, thumbnail, url }: Props) {
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
                        options={[{ label: "MP4 720P", value: "mp4-720" }, { label: "MP4 360P", value: "mp4-360" }]}
                        value={{ label: "MP4 720P", value: "mp4-720" }}
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