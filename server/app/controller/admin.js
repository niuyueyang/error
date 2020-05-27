'use strict';

const Controller = require('egg').Controller;
const redis = require('redis');
const client = redis.createClient(6379, '39.106.10.163');

class AdminController extends Controller {
  /*
    * @desc 登录
    * @version 1.0.0
    * @author niuyueyang
    * @date 2020-01-22
    * */
  async login() {
    const username = this.ctx.request.body.username;
    const password = this.ctx.request.body.password;
    const result = await this.app.mysql.get('users', { username, password });
    await this.addIp();
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '请求成功',
        data: result,
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '请求失败',
        data: {},
      };
    }

  }

  /*
      * @desc 注册
      * @version 1.0.0
      * @author niuyueyang
      * @date 2020-01-22
      * */
  async registy() {
    const username = this.ctx.request.body.username;
    const password = this.ctx.request.body.password;
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const currentTime = new Date().getTime();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));
    const resultUser = await this.app.mysql.query(`select id from users where username = '${username}'`);
    if (resultUser !== null && resultUser.length > 0) {
      this.ctx.body = {
        code: 1,
        msg: '用户名已存在',
        data: {},
      };
    } else {
      const result = await this.app.mysql.insert('users', {
        username,
        password,
        date,
        year,
        month,
        day,
        week,
        currentTime,
        ip,
        ipDetail,
      });
      const registyUser = await this.app.mysql.query(`select id from users where username = '${username}' and password = '${password}'`);
      if (result !== null) {
        this.ctx.body = {
          code: 0,
          msg: '注册成功',
          data: registyUser[0],
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '注册失败',
          data: {},
        };
      }
    }

  }

  /*
  * @desc 错误ip地址记录
  * @author niuyueyang
  * @date 2020-01-28
  * @version 1.0.0
  * */
  async addErrorIp(type, ipDetail, apikeys) {
    const apikey = apikeys || '';
    const status = typeof (ipDetail.status) !== 'undefined' ? ipDetail.status : '';
    const country = typeof (ipDetail.country) !== 'undefined' ? ipDetail.country : '';
    const countryCode = typeof (ipDetail.countryCode) !== 'undefined' ? ipDetail.countryCode : '';
    const region = typeof (ipDetail.region) !== 'undefined' ? ipDetail.region : '';
    const regionName = typeof (ipDetail.regionName) !== 'undefined' ? ipDetail.regionName : '';
    const city = typeof (ipDetail.city) !== 'undefined' ? ipDetail.city : '';
    const zip = typeof (ipDetail.zip) !== 'undefined' ? ipDetail.zip : '';
    const lat = typeof (ipDetail.lat) !== 'undefined' ? ipDetail.lat : '';
    const lon = typeof (ipDetail.lon) !== 'undefined' ? ipDetail.lon : '';
    const timezone = typeof (ipDetail.timezone) !== 'undefined' ? ipDetail.timezone : '';
    const isp = typeof (ipDetail.isp) !== 'undefined' ? ipDetail.isp : '';
    const org = typeof (ipDetail.org) !== 'undefined' ? ipDetail.org : '';
    const as = typeof (ipDetail.as) !== 'undefined' ? ipDetail.as : '';
    const ip = typeof (ipDetail.query) !== 'undefined' ? ipDetail.query : '';
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const currentTime = new Date().getTime();
    const result = await this.app.mysql.insert('iperror',
      {
        type,
        status,
        country,
        countryCode,
        region,
        regionName,
        city,
        zip,
        lat,
        lon,
        timezone,
        isp,
        org,
        as,
        date,
        year,
        month,
        day,
        week,
        ip,
        currentTime,
        apikey,
      }
    );
    return result;
  }

  /*
  * @desc 记录错误
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-22
  * */
  async add() {
    const url = this.ctx.request.body.url;
    const apikey = this.ctx.request.body.apikey;
    const pageUrl = this.ctx.request.body.pageUrl;
    const deviceType = this.ctx.request.body.deviceType;
    const os = this.ctx.request.body.os;
    const browserInfo = this.ctx.request.body.browserInfo;
    const OSVersion = this.ctx.request.body.OSVersion;
    const currentTime = this.ctx.request.body.currentTime;
    const status = this.ctx.request.body.status;
    const statusText = this.ctx.request.body.statusText;
    const behaviors = this.ctx.request.body.behaviors;
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));

    const result = await this.service.admin.insert('behavior',
      {
        url,
        pageUrl,
        deviceType,
        os,
        browserInfo,
        OSVersion,
        currentTime,
        status,
        statusText,
        behaviors,
        date,
        year,
        month,
        day,
        week,
        ip,
        ipDetail,
        apikey,
      }
    );
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '添加成功',
        data: {
          url,
          pageUrl,
          deviceType,
          os,
          browserInfo,
          OSVersion,
          currentTime,
          status,
          statusText,
          behaviors: JSON.parse(behaviors),
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail: JSON.parse(ipDetail),
          apikey,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '添加失败',
        data: {},
      };
    }

  }

  /*
  * @desc 记录总数
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-22
  * */
  async error() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const apikey = this.ctx.request.body.apikey;
    const url = this.ctx.request.body.url;
    const pageUrl = this.ctx.request.body.pageUrl;
    const deviceType = this.ctx.request.body.deviceType;
    const os = this.ctx.request.body.os;
    const browserInfo = this.ctx.request.body.browserInfo;
    const OSVersion = this.ctx.request.body.OSVersion;
    const currentTime = this.ctx.request.body.currentTime;
    const status = this.ctx.request.body.status;
    const statusText = this.ctx.request.body.statusText;
    const type = this.ctx.request.body.type;
    const componentName = this.ctx.request.body.componentName;
    const stack = this.ctx.request.body.stack;
    const propsData = this.ctx.request.body.propsData;
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));
    const ipError = await this.addErrorIp('ajax', JSON.parse(ipDetail), apikey);
    const email = await this.service.admin.query(`select email from project where apikey = '${apikey}'`);
    if (ipError !== null) {
      const result = await this.app.mysql.insert('error',
        {
          url,
          pageUrl,
          deviceType,
          os,
          browserInfo,
          OSVersion,
          currentTime,
          status,
          statusText,
          type,
          componentName,
          stack,
          propsData,
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail,
          apikey,
        }
      );
      if (result !== null) {
        await this.service.admin.email('bug信息', {
          url,
          pageUrl,
          deviceType,
          os,
          browserInfo,
          OSVersion,
          currentTime,
          status,
          statusText,
          type,
          componentName,
          stack,
          propsData,
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail: JSON.parse(ipDetail),
          apikey,
          email: email !== null && email.length > 0 ? email[0].email : '255153187@qq.com',
        });
        this.ctx.body = {
          code: 0,
          msg: '请求成功',
          data: {
            url,
            pageUrl,
            deviceType,
            os,
            browserInfo,
            OSVersion,
            currentTime,
            status,
            statusText,
            type,
            componentName,
            stack,
            propsData,
            date,
            year,
            month,
            day,
            week,
            ip,
            ipDetail: JSON.parse(ipDetail),
            apikey,
            email: email !== null && email.length > 0 ? email[0].email : '255153187@qq.com',
          },
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '请求失败',
          data: {},
        };
      }
    } else {
      this.ctx.body = {
        code: 1,
        msg: 'ip添加失败',
        data: {},
      };
    }
  }

  async email() {
    const { app } = this;
    const mailOptions = {
      from: '18335774773@163.com',
      to: '255153187@qq.com',
      subject: 'bug',
      html: '测试111',
    };

    app.email.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(response);
      } else {
        console.log(response.message);
      }
    });
  }

  /*
  * @desc 页面加载
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-22
  * */
  async load() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const apikey = this.ctx.request.body.apikey;
    const url = this.ctx.request.body.url;
    const pageUrl = this.ctx.request.body.pageUrl;
    const deviceType = this.ctx.request.body.deviceType;
    const os = this.ctx.request.body.os;
    const browserInfo = this.ctx.request.body.browserInfo;
    const OSVersion = this.ctx.request.body.OSVersion;
    const currentTime = this.ctx.request.body.currentTime;
    const status = this.ctx.request.body.status;
    const statusText = this.ctx.request.body.statusText;
    const type = this.ctx.request.body.type;
    const componentName = this.ctx.request.body.componentName;
    const stack = this.ctx.request.body.stack;
    const propsData = this.ctx.request.body.propsData;
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));
    const ipError = await this.addErrorIp('load', JSON.parse(ipDetail), apikey);
    if (ipError !== null) {
      const result = await this.service.admin.insert('loads',
        {
          url,
          pageUrl,
          deviceType,
          os,
          browserInfo,
          OSVersion,
          currentTime,
          status,
          statusText,
          type,
          componentName,
          stack,
          propsData,
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail,
          apikey,
        }
      );
      if (result !== null) {
        this.ctx.body = {
          code: 0,
          msg: '请求成功',
          data: {
            url,
            pageUrl,
            deviceType,
            os,
            browserInfo,
            OSVersion,
            currentTime,
            status,
            statusText,
            type,
            componentName,
            stack,
            propsData,
            date,
            year,
            month,
            day,
            week,
            ip,
            ipDetail: JSON.parse(ipDetail),
            apikey,
          },
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '添加失败',
          data: {},
        };
      }
    } else {
      this.ctx.body = {
        code: 1,
        msg: 'ip添加失败',
        data: {},
      };
    }

  }

  /*
  * @desc ip添加
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-22
  * */
  async addIp() {
    const time = new Date().getTime();
    const userid = this.ctx.request.body.userId || '';
    const username = this.ctx.request.body.userName || '';
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));
    const apikey = this.ctx.request.body.apikey;


    const result = await this.service.admin.insert('ips',
      {
        time,
        userid,
        username,
        date,
        year,
        month,
        day,
        week,
        ip,
        ipDetail,
        apikey,
      }
    );
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '请求成功',
        data: {
          time,
          userid,
          username,
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail: JSON.parse(ipDetail),
          apikey,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '添加失败',
        data: {},
      };
    }
  }

  /*
  * @desc 查询今天PV
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-23
  * */
  async todayPv() {
    const today = await this.service.admin.getToday();
    const apikey = this.ctx.request.body.apikey;
    const { todayTimeStamp0, todayTimeStamp1 } = today;
    const result = await this.service.admin.select(`select count (id) from loads where apikey = '${apikey}' and currentTime between ${todayTimeStamp0} and ${todayTimeStamp1}`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          num: result[0]['count (id)'],
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
    * @desc 查询昨天Pv
    * @version 1.0.0
    * @author niuyueyang
    * @date 2020-01-23
    * */
  async yesterDayPv() {
    const yesterday = await this.service.admin.getYesterDay();
    const { yesterdayTimeStamp0, yesterdayTimeStamp1 } = yesterday;
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select count (id) from loads where apikey = '${apikey}' and currentTime between ${yesterdayTimeStamp0} and ${yesterdayTimeStamp1}`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          num: result[0]['count (id)'],
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
    * @desc 查询今天Bug
    * @version 1.0.0
    * @author niuyueyang
    * @date 2020-01-23
    * */
  async todayBug() {
    const today = await this.service.admin.getToday();
    const { todayTimeStamp0, todayTimeStamp1 } = today;
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select count(id) as sum from error where apikey = '${apikey}' and currentTime between ${todayTimeStamp0} and ${todayTimeStamp1}`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          num: result[0].sum,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }
  /*
    * @desc 查询昨天Bug
    * @version 1.0.0
    * @author niuyueyang
    * @date 2020-01-23
    * */
  async yesterDayBug() {
    const yesterday = await this.service.admin.getYesterDay();
    const { yesterdayTimeStamp0, yesterdayTimeStamp1 } = yesterday;
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select count(id) as sum from error where apikey = '${apikey}' and currentTime between ${yesterdayTimeStamp0} and ${yesterdayTimeStamp1}`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          num: result[0].sum,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
  * @desc 今日ip统计
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-23
  * */
  async getTodayIp() {
    const today = await this.service.admin.getToday();
    const { todayTimeStamp0, todayTimeStamp1 } = today;
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select count(id) as sum from iperror where apikey = '${apikey}' and currentTime between ${todayTimeStamp0} and ${todayTimeStamp1}`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          num: result[0].sum,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }
  /*
      * @desc 查询昨天ip
      * @version 1.0.0
      * @author niuyueyang
      * @date 2020-01-23
      * */
  async getYesterDayIp() {
    const yesterday = await this.service.admin.getYesterDay();
    const { yesterdayTimeStamp0, yesterdayTimeStamp1 } = yesterday;
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select count(id) as sum from iperror where apikey = '${apikey}' and currentTime between ${yesterdayTimeStamp0} and ${yesterdayTimeStamp1}`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          num: result[0].sum,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }
  /*
      * @desc pv统计
      * @version 1.0.0
      * @author niuyueyang
      * @date 2020-01-23
      * */
  async pvList() {
    const apikey = this.ctx.request.body.apikey;
    const { rangedayTimeStamp0, rangedayTimeStamp1 } = await this.service.admin.getRangeDay();
    const result = await this.service.admin.select(`select date, count(id) as sum from loads where apikey = '${apikey}' and currentTime between ${rangedayTimeStamp0} and ${rangedayTimeStamp1} group by date`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: result,
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }
  /*
        * @desc bug统计
        * @version 1.0.0
        * @author niuyueyang
        * @date 2020-01-23
        * */
  async bugList() {
    const { rangedayTimeStamp0, rangedayTimeStamp1 } = await this.service.admin.getRangeDay();
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select date, count(id) as sum from error where apikey = '${apikey}' and currentTime between ${rangedayTimeStamp0} and ${rangedayTimeStamp1} group by date`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: result,
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
          * @desc ip统计
          * @version 1.0.0
          * @author niuyueyang
          * @date 2020-01-23
  * */
  async ipList() {
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select date, count(id) as sum from iperror where apikey = '${apikey}'  group by date limit 0,30`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: result,
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
          * @desc ip地图统计
          * @version 1.0.0
          * @author niuyueyang
          * @date 2020-01-23
  * */
  async ipMapList() {
    const apikey = this.ctx.request.body.apikey;
    const result = await this.service.admin.select(`select regionName as name, count(id) as value from iperror where apikey = '${apikey}' group by regionName`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: result,
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: [],
      };
    }
  }

  /*
    * @desc 用户行为列表
    * @version 1.0.0
    * @author niuyueyang
    * @date 2020-01-26
    * */
  async getBehaviorList() {
    const apikey = this.ctx.request.body.apikey;
    const page = this.ctx.request.body.page || 1;
    const limit = this.ctx.request.body.limit || 10;
    const result = await this.app.mysql.select('behavior', {
      columns: [ 'id', 'browserInfo', 'currentTime', 'url' ], // 查询字段，全部查询则不写，相当于查询*
      orders: [
        [ 'id', 'desc' ], // 降序desc，升序asc
      ],
      where: {
        apikey,
      },
      limit, // 查询条数
      offset: (page - 1) * limit, // 数据偏移量（分页查询使用）
    });
    const count = await this.service.admin.query(`select count (id) as count from behavior where apikey = '${apikey}'`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          result,
          count: count[0].count,
          countPage: Math.ceil(count[0].count / limit),
          page,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
      * @desc 用户行为列表详细信息
      * @version 1.0.0
      * @author niuyueyang
      * @date 2020-01-26
      * */
  async getBehaviorDetail() {
    const id = this.ctx.request.body.id;
    if (id === '' || typeof id === 'undefined') {
      this.ctx.body = {
        code: 1,
        msg: 'id不能为空',
        data: {},
      };
      return false;
    }
    const result = await this.app.mysql.select('behavior', {
      columns: [ 'id', 'browserInfo', 'currentTime', 'pageUrl', 'os', 'OSVersion', 'behaviors', 'ip', 'deviceType', 'statusText' ], // 查询字段，全部查询则不写，相当于查询*
      orders: [
        [ 'id', 'desc' ], // 降序desc，升序asc
      ],
      where: { id: Number(id) },
    });
    if (result !== null) {
      result[0].behaviors = typeof result[0].behaviors !== 'undefined' ? JSON.parse(result[0].behaviors) : [];
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: result[0],
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
      * @desc 页面访问列表
      * @version 1.0.0
      * @author niuyueyang
      * @date 2020-01-26
      * */
  async getPageList() {
    const apikey = this.ctx.request.body.apikey;
    const page = Number(this.ctx.request.body.page) || 1;
    const limit = Number(this.ctx.request.body.limit) || 10;
    const offset = (page - 1) * limit;
    const result = await this.service.admin.select(`select date,pageUrl,ip,deviceType, count(id) as sum from loads where apikey = '${apikey}' group by pageUrl order by sum desc limit ${offset},${limit}`);
    const resultCount = await this.service.admin.select(`select date,pageUrl,ip,deviceType, count(id) as sum from loads where apikey = '${apikey}' group by pageUrl order by sum desc`);
    if (result !== null) {
      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          result,
          count: resultCount.length,
          page,
          limit,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
  * @desc 页面性能上报
  * @date 2020-02-02
  * @version 1.0.0
  * @author niuyueyang
  * */
  async performance() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const apikey = this.ctx.request.body.apikey;
    const id = await this.service.admin.randomString(16) + '--' + apikey;
    const pageUrl = this.ctx.request.body.pageUrl;
    const currentTime = new Date().getTime();
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = await this.service.admin.getIpDetail(ip);
    const resourses = this.ctx.request.body.resourses;

    const redirectTiming = this.ctx.request.body.redirectTiming;
    const domainTiming = this.ctx.request.body.domainTiming;
    const connectTiming = this.ctx.request.body.connectTiming;
    const responseTiming = this.ctx.request.body.responseTiming;
    const domTiming = this.ctx.request.body.domTiming;
    const whiteTiming = this.ctx.request.body.whiteTiming;
    const domContentTiming = this.ctx.request.body.domContentTiming;
    const loadTiming = this.ctx.request.body.loadTiming;
    const deviceType = this.ctx.request.body.deviceType;
    const os = this.ctx.request.body.os;
    const browserInfo = this.ctx.request.body.browserInfo;
    const OSVersion = this.ctx.request.body.OSVersion;


    await this.app.redis.set(id,
      JSON.stringify({
        id,
        resourses,
        currentTime,
        date,
        year,
        month,
        day,
        week,
        ip,
        ipDetail,
        pageUrl,
        redirectTiming,
        domainTiming,
        connectTiming,
        responseTiming,
        domTiming,
        whiteTiming,
        domContentTiming,
        loadTiming,
        deviceType,
        os,
        browserInfo,
        OSVersion,
        apikey,
      })
    );
    this.ctx.body = {
      code: 0,
      msg: '请求成功',
      data: JSON.parse(await this.app.redis.get(id)),
    };
  }

  /*
    * @desc 慢性能上报
    * @date 2020-02-02
    * @version 1.0.0
    * @author niuyueyang
    * */
  async slowPerformance() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const apikey = this.ctx.request.body.apikey;
    const initiatorType = this.ctx.request.body.initiatorType;
    const pageUrl = this.ctx.request.body.pageUrl;
    const duration = this.ctx.request.body.duration;
    const name = this.ctx.request.body.name;
    const transferSize = this.ctx.request.body.transferSize;

    const currentTime = new Date().getTime();
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));

    if (ipDetail !== null) {
      const result = await this.service.admin.insert('slowperformance',
        {
          initiatorType,
          pageUrl,
          duration,
          name,
          currentTime,
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail,
          transferSize,
          apikey,
        }
      );
      if (result !== null) {
        this.ctx.body = {
          code: 0,
          msg: '请求成功',
          data: {
            initiatorType,
            pageUrl,
            duration,
            name,
            currentTime,
            date,
            year,
            month,
            day,
            week,
            ip,
            transferSize,
            ipDetail: JSON.parse(ipDetail),
            apikey,
          },
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '添加失败',
          data: {},
        };
      }
    } else {
      this.ctx.body = {
        code: 1,
        msg: 'ip请求失败',
        data: {},
      };
    }
  }

  /*
      * @desc 性能列表
      * @date 2020-02-02
      * @version 1.0.0
      * @author niuyueyang
      * */
  async performanceList() {
    const apikey = this.ctx.request.body.apikey;
    const keys = await this.app.redis.keys('*');
    const page = Number(this.ctx.request.body.page) || 1;
    const limit = Number(this.ctx.request.body.limit) || 10;
    const arr = [];
    if (keys !== null && keys instanceof Array && keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        const id = keys[i];
        if (id.split('--')[1] == apikey) {
          const value = JSON.parse(await this.app.redis.get(id));
          const item = {};
          item.id = value.id;
          item.ip = value.ip;
          item.pageUrl = value.pageUrl;
          item.date = value.date;
          arr.push(item);
        }

      }
    }
    this.ctx.body = {
      code: 0,
      msg: '请求成功',
      data: {
        result: arr.slice((page - 1) * limit, page * limit),
        page,
        limit,
        total: arr.length,
      },
    };
  }

  /*
        * @desc 性能详细信息
        * @date 2020-02-02
        * @version 1.0.0
        * @author niuyueyang
        * */
  async performanceDetail() {
    const id = this.ctx.request.body.id;
    const value = JSON.parse(await this.app.redis.get(id));
    this.ctx.body = {
      code: 0,
      msg: '请求成功',
      data: value,
    };
  }

  /*
  * @desc 慢性能列表
  * @date 2020-02-03
  * @version 1.0.0
  * @author niuyueyang
  * */
  async slowPerformanceList() {
    const apikey = this.ctx.request.body.apikey;
    const page = this.ctx.request.body.page || 1;
    const limit = this.ctx.request.body.limit || 10;
    const result = await this.app.mysql.select('slowperformance', {
      columns: [ 'id', 'initiatorType', 'duration', 'name', 'date', 'pageUrl', 'transferSize', 'ipDetail' ], // 查询字段，全部查询则不写，相当于查询*
      orders: [
        [ 'id', 'desc' ], // 降序desc，升序asc
      ],
      where: {
        apikey,
      },
      limit, // 查询条数
      offset: (page - 1) * limit, // 数据偏移量（分页查询使用）
    });
    const count = await this.service.admin.query(`select count (id) as count from slowperformance where apikey = '${apikey}'`);


    if (result !== null) {
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          if (item.ipDetail !== null) item.ipDetail = JSON.parse(item.ipDetail);
          else item.ipDetail = {};
          item.ip = Object.keys(item.ipDetail).length > 0 ? item.ipDetail.query : '';
          item.regionName = Object.keys(item.ipDetail).length > 0 ? item.ipDetail.regionName : '';
          item.city = Object.keys(item.ipDetail).length > 0 ? item.ipDetail.city : '';
          delete item.ipDetail;
        }
      }

      this.ctx.body = {
        code: 0,
        msg: '统计成功',
        data: {
          result,
          count: count[0].count,
          countPage: Math.ceil(count[0].count / limit),
          page,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '统计失败',
        data: {},
      };
    }
  }

  /*
    * @desc 设置邮箱
    * @date 2020-02-03
    * @version 1.0.0
    * @author niuyueyang
    * */
  async addEmail() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const email = this.ctx.request.body.email;
    const userId = this.ctx.request.body.userId;
    const username = this.ctx.request.body.userName;
    const apikey = this.ctx.request.body.apikey;
    const projectname = this.ctx.request.body.projectName;
    const searchResult = await this.app.mysql.select('email', {
      columns: [ 'id' ], // 查询字段，全部查询则不写，相当于查询*
      where: {
        apikey,
      },
    });
    if (searchResult !== null && searchResult.length > 0) {
      const result = await this.app.mysql.update('email', {
        email,
      }, {
        where: {
          apikey,
        },
      });

      if (result !== null && result.affectedRows === 1) {
        this.ctx.body = {
          code: 0,
          msg: '设置成功',
          data: {
            email,
            userId,
            username,
            apikey,
            projectname,
          },
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '设置失败',
          data: {},
        };
      }
    } else {
      const result = await this.service.admin.insert('email',
        {
          email,
          userId,
          username,
          apikey,
          projectname,
        }
      );
      if (result !== null) {
        this.ctx.body = {
          code: 0,
          msg: '设置成功',
          data: {
            email,
            userId,
            username,
            apikey,
            projectname,
          },
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '设置失败',
          data: {},
        };
      }
    }
  }

  /*
    * @desc 邮箱展示
    * @date 2020-02-03
    * @version 1.0.0
    * @author niuyueyang
    * */
  async showEmail() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const apikey = this.ctx.request.body.apikey;
    const searchResult = await this.app.mysql.select('email', {
      columns: [ 'id', 'email', 'projectname', 'apikey', 'username', 'userid' ], // 查询字段，全部查询则不写，相当于查询*
      where: {
        apikey,
      },
    });
    if (searchResult !== null) {
      this.ctx.body = {
        code: 0,
        msg: '查询成功',
        data: searchResult,
      };
    } else {
      this.ctx.body = {
        code: 0,
        msg: '查询失败',
        data: searchResult,
      };
    }
  }

  /*
      * @desc 项目创建
      * @date 2020-02-02
      * @version 1.0.0
      * @author niuyueyang
      * */
  async addProject() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const projectname = this.ctx.request.body.projectname;
    const email = this.ctx.request.body.email;
    const username = this.ctx.request.body.username;
    const userid = this.ctx.request.body.userid;

    const currenttime = new Date().getTime();
    const date = await this.service.admin.formatDate(new Date().getTime());
    const year = new Date(new Date().getTime()).getFullYear();
    const month = new Date(new Date().getTime()).getMonth() + 1;
    const day = new Date(new Date().getTime()).getDate();
    const week = new Date(new Date().getTime()).getDay();
    const ip = this.ctx.request.ip;
    const ipDetail = JSON.stringify(await this.service.admin.getIpDetail(ip));
    const apikey = await this.service.admin.randomString(16);

    if (ipDetail !== null) {
      const result = await this.service.admin.insert('project',
        {
          projectname,
          email,
          username,
          userid,
          currenttime,
          date,
          year,
          month,
          day,
          week,
          ip,
          ipDetail,
          apikey,
        }
      );
      if (result !== null) {
        this.ctx.body = {
          code: 0,
          msg: '请求成功',
          data: {
            projectname,
            email,
            username,
            userid,
            currenttime,
            date,
            year,
            month,
            day,
            week,
            ip,
            ipDetail: JSON.parse(ipDetail),
            apikey,
          },
        };
      } else {
        this.ctx.body = {
          code: 1,
          msg: '添加失败',
          data: {},
        };
      }
    } else {
      this.ctx.body = {
        code: 1,
        msg: 'ip请求失败',
        data: {},
      };
    }
  }

  /*
      * @desc 项目展示
      * @date 2020-02-03
      * @version 1.0.0
      * @author niuyueyang
      * */
  async showProject() {
    // const result = await this.app.mysql.query('select count(id) from error');
    // this.ctx.body = result;
    const page = this.ctx.request.body.page || 1;
    const limit = this.ctx.request.body.limit || 10;
    const userid = this.ctx.request.body.userid;
    const searchResult = await this.app.mysql.select('project', {
      columns: [ 'id', 'email', 'projectname', 'apikey', 'username', 'userid', 'date', 'ip' ], // 查询字段，全部查询则不写，相当于查询*
      orders: [
        [ 'id', 'desc' ], // 降序desc，升序asc
      ],
      where: {
        userid,
      },
      limit, // 查询条数
      offset: (page - 1) * limit, // 数据偏移量（分页查询使用）
    });
    const total = await this.service.admin.query(`select count (id) as count from project where userid = ${userid}`);
    if (searchResult !== null) {
      this.ctx.body = {
        code: 0,
        msg: '查询成功',
        data: {
          result: searchResult,
          page,
          limit,
          total: total[0].count,
        },
      };
    } else {
      this.ctx.body = {
        code: 0,
        msg: '查询失败',
        data: {
          result: [],
          total: 0,
        },
      };
    }
  }

  /*
        * @desc 项目修改
        * @date 2020-02-02
        * @version 1.0.0
        * @author niuyueyang
        * */
  async updateProject() {
    const email = this.ctx.request.body.email;
    const apikey = this.ctx.request.body.apikey;
    const result = await this.app.mysql.update('project', {
      email,
    }, {
      where: {
        apikey,
      },
    });
    if (result !== null && result.affectedRows === 1) {
      this.ctx.body = {
        code: 0,
        msg: '修改成功',
        data: {
          email,
          apikey,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '修改失败',
        data: {},
      };
    }
  }

  /*
          * @desc 项目删除
          * @date 2020-02-02
          * @version 1.0.0
          * @author niuyueyang
          * */
  async deleteProject() {
    const apikey = this.ctx.request.body.apikey;
    const result = await this.app.mysql.delete('project', {
      apikey,
    });
    if (result !== null && result.affectedRows === 1) {
      this.ctx.body = {
        code: 0,
        msg: '成删除功',
        data: {
          apikey,
        },
      };
    } else {
      this.ctx.body = {
        code: 1,
        msg: '修改删除失败',
        data: {},
      };
    }
  }

  async redis() {
    const { ctx, app } = this;
    // set
    await app.redis.set('foo', 'bar');
    // get
    ctx.body = await app.redis.get('foo');
  }


}

module.exports = AdminController;
