import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { urlFor, client } from '../client'
import PinCreator from './PinCreator'
import LikePin from './LikePin'
import DeletePin from './DeletePin'
import DestinationPin from './DestinationPin'
import DownloadPin from './DownloadPin'

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false)
  const [likes, setLikes] = useState([])
  const navigate = useNavigate()
  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()

  return (
    <div className='m-2 '>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${pin._id}`)}
        className='relative cursor-zoom-in mb-2 w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out '
      >
        <img
          className='rounded-lg w-full' alt='use-post'
          src={urlFor(pin.image).width(250).url()}
        />
        {postHovered && (
          <div
            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pt-2 pr-2 pb-2 z-50'
            style={{ height: '100%' }}
          >
            <div className='flex justify-between items-center gap-2 w-full'>
              <DownloadPin url={pin.image?.asset?.url} />
              {pin?.postedBy?._id === user?.googleId && (<DeletePin pin={pin} />)}
            </div>
            <div className='flex items-center'>
              {pin?.destination && (<DestinationPin destination={pin.destination} />)}
            </div>
          </div>
        )}
      </div >
      <div className='flex justify-between w-full'>
        <p >{pin?.postedBy && (<PinCreator postedBy={pin.postedBy} />)}</p>
        <div className='flex justify-between items-center gap-1'>
          <span className='text-sm font-normal text-gray-500'>{`${likes?.length ? likes?.length : 0}`}</span>
          <LikePin pin={pin} user={user} SetLikes={setLikes} />
        </div>
      </div>
      <div className='mt-2 mb-3'>
        <hr />
      </div>
    </div>
  )
}

export default Pin