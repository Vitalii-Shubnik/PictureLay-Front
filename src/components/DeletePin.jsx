import React from 'react'
import { AiTwotoneDelete } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'

const DeletePin = ({ pin }) => {
  const navigate = useNavigate()

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload()
      })
  }

  return (
    <button
      type='button'
      className='bg-white border border-gray-500 p-2 opacity-70 hover:opacity-100 text-dark font-bold text-xl rounded-full hover:shadow-md outline-none'
      onClick={(e) => {
        e.stopPropagation()
        deletePin(pin._id)
        navigate('/')
      }}
    >
      <AiTwotoneDelete />
    </button>
  )
}

export default DeletePin