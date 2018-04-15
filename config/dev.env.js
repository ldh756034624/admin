const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   BASE_API: '"https://console-testnew-h9.thy360.com/h9/admin/"',
//   IMGUP_API: '"https://console-testnew-h9.thy360.com/h9/admin/common/images/upload"',
//   FILE_API: '"https://console-testnew-h9.thy360.com/h9/admin/common/file/upload"'
// })

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://console-dev-h9.thy360.com/h9/admin/"',
  IMGUP_API: '"https://console-dev-h9.thy360.com/h9/admin/common/images/upload"',
  FILE_API: '"https://console-dev-h9.thy360.com/h9/admin/common/file/upload"'
})
