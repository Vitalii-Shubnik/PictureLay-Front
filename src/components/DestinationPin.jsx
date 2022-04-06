import React from 'react'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

const DestinationPin = ({ destination }) => {
  return (
    <a
      href={destination}
      target="_blank"
      rel="noreferrer"
      className='bg-white border border-gray-500 flex items-center gap-2 text-base text-black p-1 pl-3 pr-3 rounded-full opacity-75 hover:opacity-100 hover:shadow-md group outline-none'
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <BsFillArrowUpRightCircleFill />
      <span>
        {`${destination.replace(/^http(s)?:\/\/(www.)?/,"").slice(0,12)}`}
      </span>
    </a>
  )
}

export default DestinationPin