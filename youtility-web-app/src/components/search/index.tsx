import { useSearch } from "@/context/search";
import tw from "tailwind-styled-components";
import debounce from 'lodash.debounce';
import { ChangeEventHandler } from "react";
const Wrapper = tw.div`
    w-full
    flex
    flex-row
    justify-center
    items-center
    mt-16
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

const Button = tw.button`
    p-4
    h-16
    text-xl
    bg-black
    text-white
    border-2
    border-l-0
  border-blue-300
`;

export default function Search() {
    const [value, setValue] = useSearch();

    const onChange = debounce(((event) => {
        setValue(event.target.value);
    }) as ChangeEventHandler<HTMLInputElement>, 300);

    return (
        <Wrapper>
            <Input
                type="text"
                value={value}
                placeholder="Paste a link here to download your video"
                onChange={onChange}
            />
            <Button>Download</Button>
        </Wrapper>
    )
}