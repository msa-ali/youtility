import { YoutubeVideoDetail } from "@/types/youtube"
import Dropdown from "../dropdown"
import Image from "next/image"
import { limit } from "@/lib/utils";

import { BsDownload } from 'react-icons/bs';


interface Props extends YoutubeVideoDetail { }

function MediaCard({ videoId, title, duration, thumbnail, definition }: Props) {
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
                    <button 
                        title="Download"
                        className="border rounded md:p-3 p-1 shadow bg-black text-white text-lg">
                            <BsDownload />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MediaCard