const team = require('./lib/sdk/teams/teams')

let cc = team.removeTeam("punit-abc-test123").then((res) => {
  console.log(res)
})
