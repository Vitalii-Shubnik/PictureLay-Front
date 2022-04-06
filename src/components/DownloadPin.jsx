import React from 'react'
import { MdDownloadForOffline } from 'react-icons/md'

const DownloadPin = ({ url }) => {
  return (
    <div className='flex gap-2'>
      <a
        href={`${url}?dl=`}
        download
        onClick={(e) => e.stopPropagation()}
        className='bg-white border border-gray-500 w-9 h-9 rounded-full flex items-center justify-center text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
      >
        <MdDownloadForOffline />
      </a>
    </div>
  )
}

export default DownloadPin