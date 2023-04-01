'use strict';

module.exports = core;

// require支持的文件：.js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> c++
// 其他任何文件都会被当做.js文件来解析，如果里面包含js代码就会被正常解析出来，所以也是可以获取.txt文件的， .txt -> .js
const semver = require('semver')
const colors = require('colors/safe')
const log = require('@yang-cli/log')
const pkg = require('../package.json')
const constant = require('./const')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
  }catch(e) {
    log.error(e.message)
  }
}

// 对root降级
function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck()
}

function checkNodeVersion() {
  // 第一步，获取当前版本号
  const currentVersion = process.version
  // 第二步，比对最低版本号
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if(!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`yang-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
  }
}

function checkPkgVersion() {
  console.log(pkg.version)
  log.notice('cli', pkg.version)
}
