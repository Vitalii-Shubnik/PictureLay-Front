import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdSearch, IoMdAddCircleOutline } from 'react-icons/io'

const Navbar = ({ searchTerm, setSearchTerm, user }) => {

  const navigate = useNavigate()
  if (!user)
    return null

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-5'>
      <Link
        to={`create-pin`}
        className='bg-black text-white opacity-100 rounded-lg w-12 h-12 md:w-14 flex justify-center items-center hover:opacity-80'
      >
        <IoMdAddCircleOutline />
      </Link>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch
          fontSize={21}
          className='ml-1'
        />
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 w-full bg-white outline-none'
        />
      </div>
      <div className='flex gap-3'>
        <Link
          to={`user-profile/${user._id}`}
          className='hidden md:block'
        >
          <img src={user.image} alt='user' className='w-14 h-12 rounded-lg' />
        </Link>
      </div>
    </div>
  )
}

export default Navbar