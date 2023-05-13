const path = require('node:path')

module.exports = path.dirname(require.main.filename) //using require.main.filename we are getting the filename and using path.dirname() we can get the path of root directory