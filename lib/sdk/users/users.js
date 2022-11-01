const axios = require('axios')
const getAccessToken = require('../../utils/getAccessToken')

const getAllUsers = async () => {
  let access = await getAccessToken(
    '',
  )
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/users',
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let data = await axios(config)
  return data.data.data
  //   console.log(JSON.stringify(data.data.data))
}

const users = {
  getAllUsers: getAllUsers,
}
module.exports = users
