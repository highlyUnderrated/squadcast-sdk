const axios = require('axios')
const getAccessToken = require('../../utils/getAccessToken')
const team = require('../teams/teams')
const role = require('../teams/roles')
const users = require('../users/users')

const getTeamMembers = async (xRefreshToken, teamName) => {
  let teams = await team.getTeamByName(xRefreshToken, teamName)
  if (teams != null) {
    return teams['members']
  }
}

const addTeamMember = async (
  xRefreshToken,
  teamName,
  memberEmail,
  teamRoles = [],
) => {
  let access = await getAccessToken(xRefreshToken)
  if (
    teamName.length > 0 &&
    memberEmail.length > 0 &&
    typeof teamRoles === 'object' &&
    teamRoles.length > 0
  ) {
    let user = null
    let teams = await team.getTeamByName(xRefreshToken, teamName)
    if (teams == null) {
      console.log('could not find team with name: ' + teamName)
    } else {
      user = await users.getAllUsers(xRefreshToken)
      for (let i = 0; i < user.length; i++) {
        if (memberEmail === user[i]['email']) {
          let temp_member = {
            user_id: user[i]['id'],
            role_ids: [],
            abilities: {},
          }
          for (let j = 0; j < teamRoles.length; j++) {
            let temp_role = await role.getTeamRoleByName(
              xRefreshToken,
              teamName,
              teamRoles[j],
            )
            if (temp_role == null) {
              console.log('could not find Role with name:' + teamRoles[j])
              return null
            } else {
              temp_member.role_ids.push(temp_role['id'])
            }
          }
          teams['members'].push(temp_member)
          let temp_data = {
            description: teams['description'],
            members: teams['members'],
            name: teams['name'],
          }
          let config = {
            method: 'put',
            url: 'https://api.squadcast.com/v3/teams/' + teams['id'],
            headers: {
              Authorization: 'Bearer ' + access,
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(temp_data),
          }
          let data = await axios(config)
          return data.data
        }
      }
      console.log('could not find member with Email: ' + memberEmail)
      return null
    }
  }
  console.log(
    'Please provide mendetory fields: X-Refresh-Token, teamName, memberEmail, teamRoles',
  )
  return null
}

const updateTeamMemberRole = async (
  xRefreshToken,
  teamName,
  memberEmail,
  teamRoles = [],
) => {
  let access = await getAccessToken(xRefreshToken)
  if (
    teamName.length > 0 &&
    memberEmail.length > 0 &&
    typeof teamRoles === 'object' &&
    teamRoles.length > 0
  ) {
    let user = null
    let teams = await team.getTeamByName(xRefreshToken, teamName)
    if (teams == null) {
      console.log('could not find team with name: ' + teamName)
    } else {
      user = await users.getAllUsers(xRefreshToken)
      for (let i = 0; i < user.length; i++) {
        if (memberEmail === user[i]['email']) {
          let temp_member = {
            user_id: user[i]['id'],
            role_ids: [],
            abilities: {},
          }
          for (let j = 0; j < teamRoles.length; j++) {
            let temp_role = await role.getTeamRoleByName(
              xRefreshToken,
              teamName,
              teamRoles[j],
            )
            if (temp_role == null) {
              console.log('could not find Role with name:' + teamRoles[j])
              return null
            } else {
              temp_member.role_ids.push(temp_role['id'])
            }
          }
          let member_found = false
          for (let k = 0; k < teams['members'].length; k++) {
            if (teams['members'][k]['user_id'] === temp_member.user_id) {
              teams['members'][k] = temp_member
              member_found = true
            }
          }
          if (!member_found) {
            console.log(memberEmail + ' is not added to the team: ' + teamName)
            return null
          }
          let temp_data = {
            description: teams['description'],
            members: teams['members'],
            name: teams['name'],
          }
          let config = {
            method: 'put',
            url: 'https://api.squadcast.com/v3/teams/' + teams['id'],
            headers: {
              Authorization: 'Bearer ' + access,
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(temp_data),
          }
          let data = await axios(config)
          return data.data
        }
      }
      console.log('could not find member with Email: ' + memberEmail)
      return null
    }
  }
  console.log(
    'Please provide mendetory fields: X-Refresh-Token, teamName, memberEmail, teamRoles',
  )
  return null
}

const members = {
  getTeamMembers: getTeamMembers,
  addTeamMember: addTeamMember,
  updateTeamMemberRole: updateTeamMemberRole,
}
module.exports = members
