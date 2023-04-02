import { SearchProvider } from '@/context/search'
import React from 'react'
import Search from '../search'
import YoutubeVideoList from '../youtube-video-list'

function SearchWithResult() {
    return (

        <SearchProvider initialValue="">
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <Search />
                <div className='flex-1'>
                    <YoutubeVideoList />
                </div>
            </div>
        </SearchProvider >

    )
}

export default SearchWithResult