import React, { useState, useEffect, useRef } from 'react'
import { MdOutlineRemoveCircleOutline } from 'react-icons/md'
import { BiSend } from 'react-icons/bi'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
import DownloadPin from './DownloadPin'
import LikePin from './LikePin'
import DestinationPin from './DestinationPin'
import DeletePin from './DeletePin'
import PinCreator from './PinCreator'
import Comment from './Comment'

const PinDetail = () => {
  const searchInput = useRef(null)

  const { pinId } = useParams()
  const [fetchingMorePins, setFetchingMorePins] = useState(true)
  const [pins, setPins] = useState([])
  const [pinDetail, setPinDetail] = useState()
  const [comment, setComment] = useState('')
  const [likes, setLikes] = useState([0])
  const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()

  const handleFocus = () => {
    searchInput.current.focus()
  }

  const addComment = () => {
    if (comment) {
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user?.googleId
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails()
          setComment('')
        })
    }
  }

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0])
          if (data[0]) {
            setFetchingMorePins(true)
            query = pinDetailMorePinQuery(data[0])
            client.fetch(query)
              .then((res) => {
                setPins(res)
                setFetchingMorePins(false)
              })
          }
        })
    }
  }

  const deleteComment = (pinId, commentKey) => {
    client
      .patch(pinId)
      .unset([`comments[_key=="${commentKey}"]`])
      .commit()
      .then(() => {
        fetchPinDetails()
      })
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if (!pinDetail) return <Spinner message='Loading pin' />

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl p-4">
        <div className="flex flex-col justify-center items-center ">
          {pinDetail.title && (<div className='flex flex-row justify-between gap-2 w-full p-2 '>
            <h1 className='text-2xl font-bold break-words mt-2'>
              {pinDetail.title}
            </h1>
          </div>)}
          <div className="relative">
            <img
              style={{
                maxHeight: 600,
                maxWidth: 1000
              }}
              className="rounded-2xl w-full h-full"
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            />
            {pinDetail?.destination && (
              <div
                className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pt-2 pr-2 pb-2 z-50'
                style={{ height: '100%' }}
              >
                <div className='flex flex-row-reverse items-center'>
                  <DestinationPin destination={pinDetail.destination} />
                </div>
              </div>
            )}
          </div>
          <div className="w-full p-2 xl:min-w-620">
            <div className="flex items-center flex-1 justify-between">
              <div className="flex items-center justify-between gap-2">
                <LikePin pin={pinDetail} user={user} SetLikes={setLikes} />
                <DownloadPin url={pinDetail.image?.asset?.url} />
                <Comment func={handleFocus} />
              </div>
              {pinDetail.postedBy?._id === user?.googleId ? (<DeletePin pin={pinDetail} />) : (<PinCreator postedBy={pinDetail.postedBy} />)}
            </div>
          </div>
        </div>
        <div className='flex flex-row justify-between text-gray-400 text-sm ml-2 mr-2'>
          <p>{`${likes?.length ? likes?.length : 0} ${likes?.length === 1 ? 'like' : 'likes'}`}</p>
          <p>{`${new Date(pinDetail._createdAt).toLocaleDateString()}`}</p>
        </div>
        <div className='flex flex-col p-2'>
          {pinDetail.about && (<div className='gap-2'>
            <h2 className='gap-2 text-md font-bold'>
              {`${pinDetail?.postedBy?.userName}: `}
              <span className='text-md font-normal'>
                {`${pinDetail?.about}`}
              </span>
            </h2>
          </div>
          )}
          <div className='w-full mt-2'>
            <hr />
          </div>
          {pinDetail?.comments ? (
            <>
              <div className="max-h-370 overflow-y-auto">
                {pinDetail?.comments?.map((item) => (
                  <div className="flex gap-2 mt-2 items-center bg-white rounded-lg" key={item.comment}>
                    {/* <img
                      src={item.postedBy?.image}
                      className="w-8 h-8 rounded-full cursor-pointer"
                      alt="user-profile"
                    /> */}
                    <div className="gap-2 text-md font-normal">
                      {`${item.postedBy?.userName}: `}
                      <span className='text-sm'>{`${item.comment}`}</span>
                    </div>
                    {item.postedBy._id === user?.googleId && (
                      <button
                        type='button'
                        className='bg-white opacity-70 hover:opacity-100 rounded-full hover:shadow-md outline-none'
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteComment(pinDetail._id, item._key)
                        }}
                      >
                        <MdOutlineRemoveCircleOutline />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h3 className='mt-2 text-sm text-gray-400'>
              No comments yet
            </h3>
          )}
        </div>
        <div className="flex row mt-2 gap-2 pl-1">
          <input
            ref={searchInput}
            type="text"
            className='flex-1 border-gray-100 outline-none border-2 pl-2 pr-2 rounded-2xl focus:border-gray-300'
            placeholder='Add comment'
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
            }}
          />
          <button
            type='button'
            className='bg-white border border-gray-500 p-2 opacity-70 hover:opacity-100 text-dark font-bold text-xl rounded-full hover:shadow-md outline-none'
            onClick={addComment}
          >
            <BiSend />
          </button>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h3 className='text-center font-bold text-xl mt-6 mb-3'>
            More Like this
          </h3>
          <MasonryLayout pins={pins} />
        </>
      ) : fetchingMorePins && (
        <Spinner message={'Loading more pins'} />
      )}
    </>
  )
}

export default PinDetail