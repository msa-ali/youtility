import tw from "tailwind-styled-components";

const NavContainer = tw.nav`
    w-full
    h-20
    py-8
    px-4
    flex
    justify-center
    items-center
    text-4xl
    font-bold
    tracking-widest
    border-b-2
    border-b-gray-400
    bg-transparent
`;


export default function Navbar() {
    return (
        <NavContainer>
            <span className="text-red-600">You</span>tility
        </NavContainer>
    );
}