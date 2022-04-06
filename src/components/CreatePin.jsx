import React, { useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { client } from '../client'
import { categories } from '../utils/data'
import Spinner from './Spinner'

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(null)
  const [category, setCategory] = useState('')
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  const [validDestination, setValidDestination] = useState(true)
  const destinationRef = useRef(null)
  const navigate = useNavigate()

  //Сheck if the url is correct
  function isValidHttpUrl(string) {
    let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    return (res !== null)
  }

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
      setWrongImageType(false)
      setLoading(true)
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error) => {
          console.log('Upload failed:', error.message)
        })
    } else {
      setLoading(false)
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    setDestination(destinationRef.current.value)
    // if (!isValidHttpUrl(destination)) {
    //   setValidDestination(false)
    //     setTimeout(() => { setValidDestination(true) }, 2000)
    //   return false
    // } else
    if (imageAsset?._id) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      }

      client.create(doc)
        .then(() => {
          navigate('/')
        })
    }
    else {
      setFields(true)
      setTimeout(() => { setFields(false) }, 2000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      <div className='flex flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-3/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-gray-300 p-3 w-full h-full'>
            {loading && (
              <Spinner />
            )}
            {wrongImageType && (
              <p>
                Wrong image type
              </p>
            )}
            {!imageAsset ? (
              <label>
                <div className=' flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='mt-8 font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg '>Click to upload</p>
                  </div>
                  <p className='mt-32 mb-8 text-gray-400'>
                    Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className='w-0 h-0'
                >
                </input>
              </label>
            ) : (
              <div className='relative h-full w-full'>
                <div className="flex justify-center items-center">
                  <img src={imageAsset?.url} alt="upload-pic" className='h-full'></img>
                </div>
                <button
                  type='button'
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            key={title._id}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          <input
            key={about._id}
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Set about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            ref={destinationRef}
            key={destination._id}
            type="url"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value)
              //setValidDestination(isValidHttpUrl(destination))
            }}
            placeholder="Set destination"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text:xl'>
                Choose category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Select Category</option>
                {categories.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                type='button'
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
            {!validDestination && (
              <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                Please enter valid url
              </p>
            )}
            {fields && (
              <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                Please fill in all the fields
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin