const getAccessToken = require('../../utils/getAccessToken')
const getAllTeams = async () => {
  let access = await getAccessToken(
    '7dff06a3f403ea58937672cd98d591e022a1b88e37d6f2ac6fa57b7bb4420fb1341e38ba209619ecbb398114d50ffe714403e3697868af1ff07709a11849c8e2',
  )
  return access
}
module.exports = getAllTeams
