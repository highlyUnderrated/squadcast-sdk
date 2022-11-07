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

const addUser = async (xRefreshToken,email,role,firstName,lastName) => {
  let access = await getAccessToken(xRefreshToken)
  let config = {
    method: 'post',
    url: 'https://api.squadcast.com/v3/users',
    headers: {
      Authorization: 'Bearer ' + access,
    },
    data: {
      "email": email,
      "role": role,
      "first_name": firstName,
      "last_name": lastName
    }
  }
  let data = await axios(config)
  return data.data.data
}

const getUserRoles = async (xRefreshToken) => {
  let access = await getAccessToken(xRefreshToken)
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/users/roles',
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let data = await axios(config)
  return data.data.data
}

const getUserByEmail = async (xRefreshToken,email) => {
  let access = await getAccessToken(xRefreshToken);
  let response = await getAllUsers(xRefreshToken)
  let userDetails = null;
  for (let i = 0; i < response.length; i++) {
    if (response[i]['email'] === email) {
      userDetails = response[i]
    }
  }
  if (userDetails === null) {
    return null
  }
  let config = {
    method: 'get',
    url: 'https://api.squadcast.com/v3/users/'+userDetails.id,
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let data = await axios(config)
  return data.data.data
}

const updateUser = async (xRefreshToken,email,role) => {
  let access = await getAccessToken(xRefreshToken);
  let response = await getAllUsers(xRefreshToken);
  let userDetails = null;
  for (let i = 0; i < response.length; i++) {
    if (response[i]['email'] === email) {
      userDetails = response[i]
    }
  }
  if (userDetails === null) {
    return null
  }
  let config = {
    method: 'put',
    url: 'https://api.squadcast.com/v3/users/'+userDetails.id,
    headers: {
      Authorization: 'Bearer ' + access,
    },
    data: {
      "role": role
    }
  }
  let data = await axios(config)
  let returnResponse = "User Updated";
  return returnResponse
}

const updateOrganizationLevelPermissions = async (xRefreshToken,email,abilities) => {
  let access = await getAccessToken(xRefreshToken);
  let response = await getAllUsers(xRefreshToken);
  let userDetails = null;
  for (let i = 0; i < response.length; i++) {
    if (response[i]['email'] === email) {
      userDetails = response[i]
    }
  }
  if (userDetails === null) {
    return null
  }
  let config = {
    method: 'put',
    url: 'https://api.squadcast.com/v3/users/'+userDetails.id,
    headers: {
      Authorization: 'Bearer ' + access,
    },
    data: 
      [
        {
            "user_id": userDetails.id,
            "abilities": abilities
        }
    ]
  }
  let data = await axios(config)
  return data.data.data
}

const removeUser = async (xRefreshToken,email) => {
  let access = await getAccessToken(xRefreshToken);
  let response = await getAllUsers(xRefreshToken);
  let userDetails = null;
  for (let i = 0; i < response.length; i++) {
    if (response[i]['email'] === email) {
      userDetails = response[i]
    }
  }
  if (userDetails === null) {
    return null
  }
  let config = {
    method: 'delete',
    url: 'https://api.squadcast.com/v3/users/'+userDetails.id,
    headers: {
      Authorization: 'Bearer ' + access,
    },
  }
  let data = await axios(config)
  return data.data.data
}

const users = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  getUserRoles: getUserRoles,
  getUserByEmail: getUserByEmail,
  updateUser: updateUser,
  updateOrganizationLevelPermissions: updateOrganizationLevelPermissions,
  removeUser: removeUser
}

module.exports = users
