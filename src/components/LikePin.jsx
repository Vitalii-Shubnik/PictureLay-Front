import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineLoading } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid'
import { client } from '../client'
import { pinLikesQuery } from '../utils/data'

const LikePin = ({ pin, user, SetLikes }) => {
  
  const [fetchingLike, setFetchingLike] = useState(true)
  const [likes, setLikes] = useState([])
  const [myLike, setMyLike] = useState(null)

  const fetchPinLikes = (signal) => {
    const query = pinLikesQuery(pin._id)
    setFetchingLike(true)
    client.fetch(query, { signal })
      .then((data) => {
        SetLikes(data[0].likes)
        setLikes(data[0].likes)
        setFetchingLike(false)
      })
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    fetchPinLikes(signal)
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (likes?.filter((item) => item?.postedBy?._id === user?.googleId))
      setMyLike(likes?.filter((item) => item?.postedBy?._id === user?.googleId)[0])
    else
      setMyLike(null)
    return () => { }
  }, [likes])

  const likePin = (id) => {
    client
      .patch(id)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [{
        _key: uuidv4(),
        userId: user?.googleId,
        postedBy: {
          _type: 'postedBy',
          _ref: user?.googleId,
        },
      }])
      .commit()
      .then(() => {
        fetchPinLikes(pin._id)
      })
  }

  const dislikePin = (id) => {
    client
      .patch(id)
      .unset([`likes[_key=="${myLike._key}"]`])
      .commit()
      .then(() => {
        fetchPinLikes(pin._id)
      })
  }

  return (
    <div>
      {myLike ? !fetchingLike ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            dislikePin(pin?._id)
          }}
          type="button"
          className="bg-red-500 border border-red-800 w-9 h-9 flex items-center justify-center opacity-100 hover:opacity-80 text-white font-bold text-base rounded-full hover:shadow-md outline-none"
        >
          <AiFillHeart />
        </button>
      ) : (
        <div>
          <div className='bg-red-500 border border-red-800 w-9 h-9 flex items-center justify-center text-white font-bold text-base rounded-full outline-none animate-spin'>
          <AiOutlineLoading/>
        </div>
        </div>
      ) : !fetchingLike ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            likePin(pin?._id)
          }}
          type="button"
          className="bg-white border border-gray-500 w-9 h-9 flex items-center justify-center opacity-80 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
        >
          <AiFillHeart />
        </button>
      ):(
        <div className='bg-white border border-gray-500 w-9 h-9 flex items-center justify-center text-dark font-bold text-base rounded-3xl outline-none animate-spin'>
          <AiOutlineLoading/>
        </div>
      )}
    </div>
  )
}

export default LikePin