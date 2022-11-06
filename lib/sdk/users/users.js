const axios = require('axios')
const getAccessToken = require('../../utils/getAccessToken')

const getAllUsers = async (xRefreshToken) => {
  let access = await getAccessToken(xRefreshToken)
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/users',
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let data = await axios(config)
  return data.data.data
}

const users = {
  getAllUsers: getAllUsers,
}
module.exports = users
