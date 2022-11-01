const axios = require('axios')
const getAccessToken = require('../../utils/getAccessToken')
const users = require('../users/users')

const getAllTeams = async () => {
  let access = await getAccessToken(
    '',
  )
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

const createTeam = async (name, emails = '', description = '') => {
  let access = await getAccessToken(
    '',
  )
  let data = {
    name: name,
    description: description,
    members_ids: [],
  }
  let user = await users.getAllUsers()
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

const getTeamByName = async (name) => {
  let access = await getAccessToken(
    '',
  )
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/teams',
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let response = await axios(config)
  for (let i = 0; i < response.data.data.length; i++) {
    if (response.data.data[i]['name'] === name) {
      return response.data.data[i]
    }
  }
  return 'Team not found with the provided name: ' + name
}

const removeTeam = async (name) => {
  let access = await getAccessToken(
    '',
  )
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/teams',
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let response = await axios(config)
  for (let i = 0; i < response.data.data.length; i++) {
    if (response.data.data[i]['name'] === name) {
      let del_config = {
        method: 'delete',
        url:
          'https://api.squadcast.com/v3/teams/' + response.data.data[i]['id'],
        headers: {
          Authorization: 'Bearer ' + access,
        },
      }
      try {
        let del_response = await axios(del_config)
        return "Team deleted successfully"
      } catch (error) {
        return error.response.data
      }
    }
  }
  return 'Team not found with the provided name: ' + name
}
const teams = {
  getAllTeams: getAllTeams,
  createTeam: createTeam,
  getTeamByName: getTeamByName,
  removeTeam: removeTeam,
}
module.exports = teams
