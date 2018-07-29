const axios = require('axios')

async function fetch({
  uri,
  reporter
}) {

  let allRoutes

  // Attempt to download the data from api
  try {
    let options = {
      method: `get`,
      url: uri,
    }
    allRoutes = await axios(options)
  } catch (e) {
    console.log(e)
  }

  if(allRoutes) {
    return allRoutes.data
  }
}

module.exports = fetch
