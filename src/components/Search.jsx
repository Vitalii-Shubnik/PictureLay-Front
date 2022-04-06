import React, { useEffect, useState } from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(searchTerm){
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())

      client.fetch(query)
      .then((data)=>{
        setPins(data)
        setLoading(false)
      })
    }
    else{
      client.fetch(feedQuery)
      .then((data)=>{
        setPins(data)
        setLoading(false)
      })
    }
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message={'Searching for pins'}/>}
      {(!pins?.length && searchTerm !== '' && !loading) ? (
        <div className='mt-10 text-center text-xl'>
          No pins found
        </div>
      ) : <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Search