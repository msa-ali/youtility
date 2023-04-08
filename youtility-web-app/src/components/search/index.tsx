import { useSearch } from "@/context/search";
import tw from "tailwind-styled-components";
import { ChangeEventHandler, useState } from "react";
import { parseURL } from "@/lib/utils";
import Error from "../error";

const Wrapper = tw.div`
    w-full
    flex
    flex-col
    gap-1
    mt-8
    md:mt-16
    justify-center
    items-center
`;

const Input = tw.input<{ invalid: boolean }>`
    p-4
    h-16
    md:w-3/5
    w-11/12
    md:placeholder:text-xl
    text-xl
    rounded-2xl
    border-2
    border-blue-300
    focus:outline-0
    ${props => props.invalid ? 'border-red-300' : 'border-blue-300'}
`;

export default function Search() {
    const [value, setValue] = useSearch();
    const [invalid, setInvalid] = useState(false);

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const text = event.target.value;
        setValue(text);
        if (text) {
            const { isValid } = parseURL(text);
            setInvalid(!isValid);
        } else {
            setInvalid(false);
        }
    }

    return (
        <Wrapper>
            <Input
                type="text"
                value={value}
                placeholder="Paste a link here to download your video"
                onChange={onChange}
                invalid={invalid}
            />
            {invalid && <Error>
                <div className="text-xs md:text-lg flex flex-col justify-center items-center">
                    <p>
                        Invalid URL format. Please paste a valid YouTube video URL in one of the following formats:
                    </p>
                    <ul className="list-disc self-center">
                        <li>https://www.youtube.com/watch?v=videoId</li>
                        <li>https://www.youtube.com/shorts/shortId</li>
                        <li>https://youtu.be/videoId</li>
                        <li>https://www.youtube.com/playlist?list=playlistId</li>
                    </ul>
                </div>
            </Error>
            }
        </Wrapper>
    )
}