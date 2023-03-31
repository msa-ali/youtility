import tw from "tailwind-styled-components";

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
    return (
        <Wrapper>
            <Input type="text" placeholder="Paste a link here to download your video" />

            <Button>Download</Button>
        </Wrapper>
    )
}