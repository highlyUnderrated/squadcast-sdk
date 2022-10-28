const axios = require('axios')

const getAccessToken = async (refreshToken) => {
  var config = {
    method: 'get',
    url: 'https://auth.squadcast.com/oauth/access-token',
    headers: {
      'X-Refresh-Token': refreshToken,
    },
  }
  const barer_token = await axios(config)
  return barer_token.data.data.access_token
}

module.exports = getAccessToken
