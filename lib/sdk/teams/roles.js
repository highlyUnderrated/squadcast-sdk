const axios = require('axios')
const getAccessToken = require('../../utils/getAccessToken')
const team = require('../teams/teams')

const getTeamRoles = async (xRefreshToken, teamName) => {
  let access = await getAccessToken(xRefreshToken)
  let teams = await team.getTeamByName(xRefreshToken, teamName)
  if (teams != null) {
    let config = {
      method: 'get',
      url: 'https://api.squadcast.com/v3/teams/' + teams['id'] + '/roles',
      headers: {
        Authorization: 'Bearer ' + access,
      },
    }
    let res = await axios(config)
    return res.data
  }
}
const getTeamRoleByName = async (xRefreshToken, teamName='', roleName='') => {
  if (teamName.length > 0 && roleName.length > 0) {
    let roles = await getTeamRoles(xRefreshToken, teamName)
    if (roles != null) {
      for (let i = 0; i < roles.data.length; i++) {
        if (roles.data[i]['name'] === roleName) {
          return roles.data[i]
        }
      }
    }
    console.log('Role not found: ' + roleName)
  }
  console.log('teamName and roleName are required')
  return null
}
const mapAbility = (data, ability, abb) => {
  let ability_key = ability
  let ability_val = '-' + ability
  if (ability === 'escalationPolicies') {
    ability_key = 'escalation_policies'
    ability_val = '-escalation-policies'
  } else if (ability === 'statuspages') {
    ability_key = 'status_pages'
    ability_val = '-status-pages'
  } else if (ability === 'teamAnalytics') {
    ability_key = 'team_analytics'
    ability_val = '-team-analytics'
  }
  if (typeof abb === 'string') {
    if (abb === 'create') {
      data.abilities[ability_key]['create' + ability_val] = true
    } else if (abb === 'read') {
      data.abilities[ability_key]['read' + ability_val] = true
    } else if (abb === 'update') {
      data.abilities[ability_key]['update' + ability_val] = true
    } else if (abb === 'delete') {
      data.abilities[ability_key]['delete' + ability_val] = true
    }
  } else if (typeof abb === 'object' && abb.length > 0) {
    for (let i = 0; i < abb.length; i++) {
      if (abb[i] === 'create') {
        data.abilities[ability_key]['create' + ability_val] = true
      } else if (abb[i] === 'read') {
        data.abilities[ability_key]['read' + ability_val] = true
      } else if (abb[i] === 'update') {
        data.abilities[ability_key]['update' + ability_val] = true
      } else if (abb[i] === 'delete') {
        data.abilities[ability_key]['delete' + ability_val] = true
      }
    }
  }
}
const createTeamRole = async (
  xRefreshToken,
  teamName,
  roleName,
  escalationPolicies = [],
  services = [],
  postmortems = [],
  runbooks = [],
  slos = [],
  schedules = [],
  squads = [],
  statuspages = [],
  webforms = [],
  teamAnalytics = [],
) => {
  let access = await getAccessToken(xRefreshToken)
  let teams = await team.getTeamByName(xRefreshToken, teamName)
  if (teams != null && roleName.length > 0) {
    let data = {
      abilities: {
        escalation_policies: {},
        postmortems: {},
        schedules: {},
        services: {},
        squads: {},
        status_pages: {},
        runbooks: {},
        slos: {},
        team_analytics: {},
        webforms: {},
      },
      name: roleName,
    }
    mapAbility(data, 'escalationPolicies', escalationPolicies)
    mapAbility(data, 'services', services)
    mapAbility(data, 'schedules', schedules)
    mapAbility(data, 'squads', squads)
    mapAbility(data, 'runbooks', runbooks)
    mapAbility(data, 'slos', slos)
    mapAbility(data, 'webforms', webforms)
    mapAbility(data, 'statuspages', statuspages)
    mapAbility(data, 'teamAnalytics', teamAnalytics)
    mapAbility(data, 'postmortems', postmortems)
    let config = {
      method: 'post',
      url: 'https://api.squadcast.com/v3/teams/' + teams['id'] + '/roles',
      headers: {
        Authorization: 'Bearer ' + access,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    }
    let response = await axios(config)
    return response.data
  }
}

const uptateTeamRole = async (
  xRefreshToken,
  teamName,
  prevRoleName,
  newRoleName = '',
  escalationPolicies = [],
  services = [],
  postmortems = [],
  runbooks = [],
  slos = [],
  schedules = [],
  squads = [],
  statuspages = [],
  webforms = [],
  teamAnalytics = [],
) => {
  let access = await getAccessToken(xRefreshToken)
  let role = await getTeamRoleByName(xRefreshToken, teamName, prevRoleName)
  let teams = await team.getTeamByName(xRefreshToken, teamName)
  if (role != null && teams != null) {
    let data = {
      abilities: {
        escalation_policies: {},
        postmortems: {},
        schedules: {},
        services: {},
        squads: {},
        status_pages: {},
        runbooks: {},
        slos: {},
        team_analytics: {},
        webforms: {},
      },
      name: role['name'],
    }
    mapAbility(data, 'escalationPolicies', escalationPolicies)
    mapAbility(data, 'services', services)
    mapAbility(data, 'schedules', schedules)
    mapAbility(data, 'squads', squads)
    mapAbility(data, 'runbooks', runbooks)
    mapAbility(data, 'slos', slos)
    mapAbility(data, 'webforms', webforms)
    mapAbility(data, 'statuspages', statuspages)
    mapAbility(data, 'teamAnalytics', teamAnalytics)
    mapAbility(data, 'postmortems', postmortems)
    if (newRoleName.length > 0) {
      data.name = newRoleName
    }
    let config = {
      method: 'put',
      url:
        'https://api.squadcast.com/v3/teams/' +
        teams['id'] +
        '/roles/' +
        role['id'],
      headers: {
        Authorization: 'Bearer ' + access,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    }
    let response = await axios(config)
    return response.data
  }
}

const deleteTeamRole = async (xRefreshToken, teamName, roleName) => {
  let teams = await team.getTeamByName(xRefreshToken, teamName)
  let roles = null
  if (teams !== null) {
    roles = await getTeamRoleByName(xRefreshToken, teamName, roleName)
  }

  if (roles != null && teams != null) {
    let access = await getAccessToken(xRefreshToken)
    let config = {
      method: 'delete',
      url:
        'https://api.squadcast.com/v3/teams/' +
        teams['id'] +
        '/roles/' +
        roles['id'],
      headers: {
        Authorization: 'Bearer ' + access,
        'Content-Type': 'application/json',
      },
    }
    try {
      await axios(config)
      return 'Role deleted successfully'
    } catch (error) {
      return error.response.data
    }
  }
  return null
}

const roles = {
  getTeamRoles: getTeamRoles,
  getTeamRoleByName: getTeamRoleByName,
  createTeamRole: createTeamRole,
  uptateTeamRole: uptateTeamRole,
  deleteTeamRole: deleteTeamRole,
}
module.exports = roles
