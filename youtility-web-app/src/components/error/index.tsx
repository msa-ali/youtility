import React from 'react'

type Props = {
    children: React.ReactNode;
}

function Error({ children }: Props) {
    return (
        <div className='bg-red-500 text-white text-lg border-2 border-red-300 p-4 mt-4 flex flex-col gap-2 tracking-wide shadow-lg rounded-xl'>
            {children}
        </div>
    )
}

export default Error