export const categories = [
  {
    name: 'animals',
    image: 'https://i.natgeofe.com/k/75ac774d-e6c7-44fa-b787-d0e20742f797/giant-panda-eating_16x9.jpg',
  },
  {
    name: 'people',
    image: 'https://img.freepik.com/free-vector/group-people-illustration-set_52683-33806.jpg?size=626&ext=jpg&ga=GA1.2.1758427035.1635897600',
  },
  {
    name: 'nature',
    image: 'https://www.greenqueen.com.hk/wp-content/uploads/2021/06/WEF-Investments-In-Nature-Based-Solutions-Have-To-Triple-By-2030-To-Address-Climate-Change-Biodiversity-Loss.jpg',
  },
  {
    name: 'gaming',
    image: 'https://media.wired.com/photos/61f48f02d0e55ccbebd52d15/3:2/w_1280%2Cc_limit/Gear-Rant-Game-Family-Plans-1334436001.jpg',
  },
  {
    name: 'music',
    image: 'https://images.ctfassets.net/bdyhigkzupmv/6lySzcy7qcIN1tf81Qkus/5b5ac73daeaf61f9057c0b0dd8447a31/hero-guitar-outro.jpg',
  },
  {
    name: 'leisure',
    image: 'https://federalresumecoach.com/wp-content/uploads/2020/11/business-and-leisure.jpg',
  },
]

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
    asset->{
        url
    }
    },
    _id,
    title, 
    about,
    category,
    destination,
    _createdAt,
    postedBy->{
    _id,
    userName,
    image
    },
    likes[]{
    _key,
    postedBy->{
        _id,
        userName,
        image
    },
    },
    comments[]{
    comment,
    _key,
    postedBy->{
        _id,
        userName,
        image
    },
    }
}`
  return query
}
export const pinLikesQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
        likes[]{
        _key,
        postedBy->{
            _id
        },
        },
    }`
  return query
}
export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        _key,
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`
  return query
}

export const pinDetailMoreDataQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']`

  return query
}

export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`

  return query
}

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image {
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            userName,
            image
        },
        likes[] {
            _key,
            postedBy -> {
                _id,
                userName,
                image
            },
        },
    }`
  return query
}

export const feedQuery = `*[_type == 'pin'] | order(_createAt desc){
    image {
        asset -> {
            url
        }
    },
    _id,
    destination,
    postedBy -> {
        _id,
        userName,
        image
    },
    likes[] {
        _key,
        postedBy -> {
            _id,
            userName,
            image
        },
    },
}`

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      likes[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`
  return query
}

export const userLikedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in likes[].userId ] | order(_createdAt desc) {
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      likes[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`
  return query
}