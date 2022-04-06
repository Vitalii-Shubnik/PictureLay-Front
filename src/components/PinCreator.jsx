import React from 'react'
import { Link } from 'react-router-dom'

const PinCreator = ({ postedBy }) => {
  return (
      <Link
        to={`/user-profile/${postedBy._id}`}
        action='replace'
        className='flex gap-2 items-center md:p-1 pl-2 pr-3 rounded-lg hover:bg-gray-200'
      >
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy.image}
          alt='user-profile'
        />
        <span className='capitalize'>
          {postedBy.userName}
        </span>
      </Link>
  )
}

export default PinCreator