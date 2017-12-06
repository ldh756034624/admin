const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  BASE_API: '"https://console-test-h9.thy360.com/h9/admin/"',
  IMGUP_API: '"https://console-test-h9.thy360.com/h9/admin/common/file/upload"'
})
