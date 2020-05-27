module.exports = {
  schedule: {
    interval: '5s', // 5s间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    // const keys = await ctx.app.redis.keys('*');
    // if (keys.length > 0) {
    //   for (let i = 0; i < keys.length; i++) {
    //     const item = keys[i];
    //     const value = JSON.parse(await ctx.app.redis.get(item));
    //     const ipDetail = JSON.stringify(value.ipDetail);
    //     value.ipDetail = ipDetail;
    //     let result = await ctx.service.admin.insert('performance', value);
    //
    //     console.log(result);
    //   }
    // }
    // const res = await ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });
    // ctx.app.cache = res.data;
  },
};
