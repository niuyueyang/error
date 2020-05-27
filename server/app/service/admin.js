'use strict';

const Service = require('egg').Service;
const request = require('request');

class AdminService extends Service {
  async insert(dataBase, data) {
    const result = await this.app.mysql.insert(dataBase, data);
    return result;
  }
  async getToday() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const todayTimeStamp0 = today.getTime();
    const todayTimeStamp1 = todayTimeStamp0 + 1000 * 60 * 60 * 24;
    return { todayTimeStamp0, todayTimeStamp1 };
  }
  async getYesterDay() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const yesterdayTimeStamp1 = today.getTime();
    const yesterdayTimeStamp0 = yesterdayTimeStamp1 - 1000 * 60 * 60 * 24;
    return { yesterdayTimeStamp0, yesterdayTimeStamp1 };
  }

  async getRangeDay() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const rangedayTimeStamp1 = new Date().getTime();
    const rangedayTimeStamp0 = today.getTime() - 1000 * 60 * 60 * 24 * 7;
    return { rangedayTimeStamp0, rangedayTimeStamp1 };
  }

  async formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [ year, month, day ].join('-');
  }

  async select(sql) {
    const result = await this.app.mysql.query(sql);
    return result;
  }
  async query(sql) {
    const result = await this.app.mysql.query(sql);
    return result;
  }
  /*
  * @params ip：{String} ip地址
  * @desc 根据IP反查地址
  * @version 1.0.0
  * @author niuyueyang
  * @date 2020-01-27
  * @return {Object} 地址信息
  * */
  async getIpDetail(ip) {
    return new Promise((resolve, reject) => {
      try {
        const url = 'http://ip-api.com/json/' + ip + '?lang=zh-CN';
        request(url, function(error, response, body) {
          resolve(JSON.parse(body));
        });
      } catch (err) {
        reject(err);
      }
    });
    if (ip === '127.0.0.1' || ip === 'localhost') {
      return { address: '本地地址' };
    }
  }
  /*
      * @params ip：{Number} 随机字符串位数
      * @desc 生成随机字符串
      * @version 1.0.0
      * @author niuyueyang
      * @date 2020-01-27
      * @return {Object} 随机字符串
      * */
  async randomString(len) {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  /*
   * @desc email发送
   * @date 2020-02-03
   * @version 1.0.0
   * @author niuyueyang
   * */
  async email(title = 'bug信息', detail) {
    return new Promise((resolve, reject) => {
      try {
        const { app } = this;
        const mailOptions = {
          from: '18335774773@163.com',
          to: detail.email,
          subject: title,
          html: `<!DOCTYPE html>
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <title>Title</title>
                      <style>
                          body {
                              width: 600px;
                              margin: 40px auto;
                              font-family: 'trebuchet MS', 'Lucida sans', Arial;
                              font-size: 14px;
                              color: #444;
                          }
                  
                          table {
                              *border-collapse: collapse; /* IE7 and lower */
                              border-spacing: 0;
                              width: 100%;
                          }
                  
                          .bordered {
                              border: solid #ccc 1px;
                              -moz-border-radius: 6px;
                              -webkit-border-radius: 6px;
                              border-radius: 6px;
                              -webkit-box-shadow: 0 1px 1px #ccc;
                              -moz-box-shadow: 0 1px 1px #ccc;
                              box-shadow: 0 1px 1px #ccc;
                          }
                  
                          .bordered tr:hover {
                              background: #fbf8e9;
                              -o-transition: all 0.1s ease-in-out;
                              -webkit-transition: all 0.1s ease-in-out;
                              -moz-transition: all 0.1s ease-in-out;
                              -ms-transition: all 0.1s ease-in-out;
                              transition: all 0.1s ease-in-out;
                          }
                  
                          .bordered td, .bordered th {
                              border-left: 1px solid #ccc;
                              border-top: 1px solid #ccc;
                              padding: 10px;
                              text-align: left;
                          }
                  
                          .bordered th {
                              background-color: #dce9f9;
                              background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf3fc), to(#dce9f9));
                              background-image: -webkit-linear-gradient(top, #ebf3fc, #dce9f9);
                              background-image: -moz-linear-gradient(top, #ebf3fc, #dce9f9);
                              background-image: -ms-linear-gradient(top, #ebf3fc, #dce9f9);
                              background-image: -o-linear-gradient(top, #ebf3fc, #dce9f9);
                              background-image: linear-gradient(top, #ebf3fc, #dce9f9);
                              -webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
                              -moz-box-shadow:0 1px 0 rgba(255,255,255,.8) inset;
                              box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
                              border-top: none;
                              text-shadow: 0 1px 0 rgba(255,255,255,.5);
                          }
                  
                          .bordered td:first-child, .bordered th:first-child {
                              border-left: none;
                          }
                  
                          .bordered th:first-child {
                              -moz-border-radius: 6px 0 0 0;
                              -webkit-border-radius: 6px 0 0 0;
                              border-radius: 6px 0 0 0;
                          }
                  
                          .bordered th:last-child {
                              -moz-border-radius: 0 6px 0 0;
                              -webkit-border-radius: 0 6px 0 0;
                              border-radius: 0 6px 0 0;
                          }
                  
                          .bordered th:only-child{
                              -moz-border-radius: 6px 6px 0 0;
                              -webkit-border-radius: 6px 6px 0 0;
                              border-radius: 6px 6px 0 0;
                          }
                  
                          .bordered tr:last-child td:first-child {
                              -moz-border-radius: 0 0 0 6px;
                              -webkit-border-radius: 0 0 0 6px;
                              border-radius: 0 0 0 6px;
                          }
                  
                          .bordered tr:last-child td:last-child {
                              -moz-border-radius: 0 0 6px 0;
                              -webkit-border-radius: 0 0 6px 0;
                              border-radius: 0 0 6px 0;
                          }
                  
                          /*----------------------*/
                  
                          .zebra td, .zebra th {
                              padding: 10px;
                              border-bottom: 1px solid #f2f2f2;
                          }
                  
                          .zebra tbody tr:nth-child(even) {
                              background: #f5f5f5;
                              -webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
                              -moz-box-shadow:0 1px 0 rgba(255,255,255,.8) inset;
                              box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
                          }
                  
                          .zebra th {
                              text-align: left;
                              text-shadow: 0 1px 0 rgba(255,255,255,.5);
                              border-bottom: 1px solid #ccc;
                              background-color: #eee;
                              background-image: -webkit-gradient(linear, left top, left bottom, from(#f5f5f5), to(#eee));
                              background-image: -webkit-linear-gradient(top, #f5f5f5, #eee);
                              background-image: -moz-linear-gradient(top, #f5f5f5, #eee);
                              background-image: -ms-linear-gradient(top, #f5f5f5, #eee);
                              background-image: -o-linear-gradient(top, #f5f5f5, #eee);
                              background-image: linear-gradient(top, #f5f5f5, #eee);
                          }
                  
                          .zebra th:first-child {
                              -moz-border-radius: 6px 0 0 0;
                              -webkit-border-radius: 6px 0 0 0;
                              border-radius: 6px 0 0 0;
                          }
                  
                          .zebra th:last-child {
                              -moz-border-radius: 0 6px 0 0;
                              -webkit-border-radius: 0 6px 0 0;
                              border-radius: 0 6px 0 0;
                          }
                  
                          .zebra th:only-child{
                              -moz-border-radius: 6px 6px 0 0;
                              -webkit-border-radius: 6px 6px 0 0;
                              border-radius: 6px 6px 0 0;
                          }
                  
                          .zebra tfoot td {
                              border-bottom: 0;
                              border-top: 1px solid #fff;
                              background-color: #f1f1f1;
                          }
                  
                          .zebra tfoot td:first-child {
                              -moz-border-radius: 0 0 0 6px;
                              -webkit-border-radius: 0 0 0 6px;
                              border-radius: 0 0 0 6px;
                          }
                  
                          .zebra tfoot td:last-child {
                              -moz-border-radius: 0 0 6px 0;
                              -webkit-border-radius: 0 0 6px 0;
                              border-radius: 0 0 6px 0;
                          }
                  
                          .zebra tfoot td:only-child{
                              -moz-border-radius: 0 0 6px 6px;
                              -webkit-border-radius: 0 0 6px 6px
                              border-radius: 0 0 6px 6px
                          }
                  
                  
                      </style>
                  </head>
                  <body>
                  <table class="bordered">
                      <thead>                  
                      <tr>
                          <th>页面地址</th>
                          <th>ip</th>
                          <th>时间</th>
                          <th>错误地址</th>
                          <th>状态</th>
                          <th>错误信息</th>
                          <th>错误组件信息</th>
                          <th>系统</th>
                          <th>系统版本</th>
                          <th>详细错误信息</th>
                          <th>浏览器</th>
                          <th>省份</th>
                          <th>城市</th>
                      </tr>
                      </thead>
                      <tr>
                          <td>${detail.pageUrl}</td>
                          <td>${detail.ip}</td>
                          <td>${detail.date}</td>
                          <td>${detail.url}</td>
                          <td>${detail.status}</td>
                          <td>${detail.statusText}</td>
                          <td>${detail.componentName}</td>
                          <td>${detail.os}</td>
                          <td>${detail.OSVersion}</td>
                          <td>${detail.stack}</td>
                          <td>${detail.browserInfo}</td>
                          <td>${typeof detail.ipDetail.regionName === 'undefined' ? '' : detail.ipDetail.regionName}</td>
                          <td>${typeof detail.ipDetail.city === 'undefined' ? '' : detail.ipDetail.city}</td>
                      </tr>                                    
                  </table>
                  </body>
                  </html>`,
        };

        app.email.sendMail(mailOptions, (error, response) => {
          if (error) {
            resolve(error);
          } else {
            resolve(response);
          }
          app.email.close();
        });
      } catch (err) {
        reject(err);
      }

    });

  }

  async getNewsContent(aid) {
    const url = this.config.api + 'appapi.php?a=getPortalArticle&aid=' + aid;
    const response = await this.ctx.curl(url);
    const data = JSON.parse(response.data); // 返回Buffer
    return data.result;
  }
}

module.exports = AdminService;
