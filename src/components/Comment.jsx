import React from 'react'
import {FaRegCommentDots} from 'react-icons/fa'

const Comment = ({func}) => {
  return (
    <button
      type='button'
      className='bg-white border border-gray-500 p-2 opacity-70 hover:opacity-100 text-dark font-bold text-xl rounded-full hover:shadow-md outline-none'
      onClick={(e) => {
        func()
      }}
    >
      <FaRegCommentDots />
    </button>
  )
}

export default Comment