/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1579572466130_7361';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 关闭安全认证
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

  // 跨域
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 配置mysql
  exports.mysql = {
    // database configuration
    client: {
      // host
      host: '39.106.10.163',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: 'asdf123456A*',
      // database
      database: 'monitor',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '39.106.10.163', // Redis host
      password: '',
      db: 0,
    },
  };
  config.email = {
    client: {
      host: 'smtp.163.com',
      secureConnection: true,
      port: 465,
      auth: {
        user: '18335774773@163.com',
        pass: 'asdf123456A',
      },
    },
  };

  exports.proxy = true;

  return config;
};
