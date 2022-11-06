const axios = require('axios')
const getAccessToken = require('../../utils/getAccessToken')
const users = require('../users/users')

const getAllTeams = async (xRefreshToken) => {
  let access = await getAccessToken(xRefreshToken)
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/teams',
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let data = await axios(config)
  return data.data.data
}

const createTeam = async (
  xRefreshToken,
  name,
  emails = '',
  description = '',
) => {
  let access = await getAccessToken(xRefreshToken)
  let data = {
    name: name,
    description: description,
    members_ids: [],
  }
  let user = await users.getAllUsers(xRefreshToken)
  for (let i = 0; i < user.length; i++) {
    if (emails.length > 0 && emails.includes(user[i]['email'])) {
      data.members_ids.push(user[i]['id'])
    }
  }
  let config = {
    method: 'post',
    url: 'https://api.squadcast.com/v3/teams',
    headers: {
      Authorization: 'Bearer ' + access,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  }
  let response = await axios(config)
  return response.data
}

const getTeamByName = async (xRefreshToken, name) => {
  let response = await getAllTeams(xRefreshToken)
  for (let i = 0; i < response.length; i++) {
    if (response[i]['name'] === name) {
      return response[i]
    }
  }
  return null
}

const removeTeam = async (xRefreshToken, name) => {
  let access = await getAccessToken(xRefreshToken)
  let response = await getTeamByName(xRefreshToken, name)
  if (response != null) {
    let del_config = {
      method: 'delete',
      url: 'https://api.squadcast.com/v3/teams/' + response['id'],
      headers: {
        Authorization: 'Bearer ' + access,
      },
    }
    try {
      await axios(del_config)
      return 'Team deleted successfully'
    } catch (error) {
      return error.response.data
    }
  }
  return null
}
const teams = {
  getAllTeams: getAllTeams,
  createTeam: createTeam,
  getTeamByName: getTeamByName,
  removeTeam: removeTeam,
}
module.exports = teams
