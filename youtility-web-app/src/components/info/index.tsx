import tw from "tailwind-styled-components";

const Wrapper = tw.div`
    w-full
    flex
    flex-col
    justify-center
    items-center
`;

export default function Info() {
  return (
    <Wrapper>
        <div className="md:text-3xl text-xl mt-16 text-gray-600 font-bold tracking-wider">
            Youtube Video Downloader
        </div>
        <div className="text-sm mt-4 text-gray-600 font-bold tracking-wider">
            Stream YouTube on your terms with <span className="text-red-600">You</span>tility
        </div>
    </Wrapper>
  )
}