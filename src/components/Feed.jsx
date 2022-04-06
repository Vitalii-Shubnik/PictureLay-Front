import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const Feed = () => {
  const [pins, setPins] = useState()
  const [loading, setLoading] = useState(true)
  const { categoryId } = useParams()

  useEffect(() => {
    if (categoryId) {
      setLoading(true)
      const query = searchQuery(categoryId)
      client.fetch(query).then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
      setLoading(true)

      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [categoryId])
  const ideaName = categoryId || 'new'


  return (
    <div>
      {loading ? (
        <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
      ) : (
        pins.length ? (
          <MasonryLayout pins={pins} />
        ) : (
          <div className='mt-10 text-center text-xl'>
            No pins found
          </div>
        )
      )}
    </div>
  )
}

export default Feed