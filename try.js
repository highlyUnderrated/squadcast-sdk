const getAllTeams = require('./lib/sdk/teams/teams')

let cc = getAllTeams().then((res) => {
  console.log(res, 'hello')
})
