import { useSearch } from "@/context/search";
import tw from "tailwind-styled-components";
import { ChangeEventHandler, useState } from "react";
import { isValidURL } from "@/lib/utils";
const Wrapper = tw.div`
    w-full
    flex
    flex-col
    gap-1
    mt-16
    justify-center
    items-center
`;

const Input = tw.input`
    p-4
    h-16
    w-3/5
    md:placeholder:text-xl
    text-xl
    rounded-l
    border-2
    border-r-0
    border-blue-300
    focus:outline-0
`;

export default function Search() {
    const [value, setValue] = useSearch();
    const [invalid, setInvalid] = useState(false);

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const text = event.target.value;
        setValue(text);
        setInvalid(text ? !isValidURL(text) : false);
    }

    return (
        <Wrapper>
            <Input
                type="text"
                value={value}
                placeholder="Paste a link here to download your video"
                onChange={onChange}
            />
            {invalid && <div className="text-red-500 text-sm border-2 border-red-300 p-4 mt-4 flex flex-col gap-2 tracking-wide shadow-lg rounded-xl">
                <p>Invalid URL format <span className="text-xl">😪</span>. Please enter a valid YouTube video URL in one of the following formats:</p>
                <ul className="list-disc self-center">
                    <li>https://www.youtube.com/watch?v=videoId</li>
                    <li>https://www.youtube.com/playlist?list=playlistId</li>
                </ul>
                <p>Make sure to replace "videoId" or "playlistId" with the actual ID of the video or playlist you want to download.</p>
            </div>
            }
        </Wrapper>
    )
}