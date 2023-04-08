'use strict';

module.exports = core;

// require支持的文件：.js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> c++
// 其他任何文件都会被当做.js文件来解析，如果里面包含js代码就会被正常解析出来，所以也是可以获取.txt文件的， .txt -> .js
const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
// todo: 目前装的4.x版本的，最新版本的require会报错，后续看看解决方案
const pathExists = require('path-exists').sync
const log = require('@yang-cli/log')
const pkg = require('../package.json')
const constant = require('./const')

let args, config

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
  }catch(e) {
    log.error(e.message)
  }
}

// 检查环境变量
function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  if(pathExists(dotenvPath)) {
    dotenv.config({ //将.env文件的内容配置到process.env中
      path: dotenvPath
    })
  }
  createDefaultConfig()
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

// 创建cli默认配置
function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if(process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  }else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

// 入参检查
function checkInputArgs() {
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2))
  console.log(args)
  checkArgs()
}

// 入参模式和debug模式开发
function checkArgs() {
  if(args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  }else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

// 判断用户主目录
function checkUserHome() {
  if(!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'))
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
