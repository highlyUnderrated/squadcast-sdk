const axios = require("axios");

const getAccessToken = async = (refreshToken) => {
    var config = {
        method: 'get',
        url: 'https://auth.squadcast.com/oauth/access-token',
        headers: { 
          'X-Refresh-Token': refreshToken
        }
      };
      
      axios(config)
      .then(function (response) {
        return response.body.data.access_token
      })
      .catch(function (error) {
        return error
      });
};

module.export = {
    getAccessToken
};