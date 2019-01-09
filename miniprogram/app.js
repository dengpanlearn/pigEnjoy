//app.js

var zhyUtil = require('./zhyUtil/util.js');
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:'clouddemo-480e99',
        traceUser: true,
      })

      zhyUtil.zhyUtilInit(this.globalData.zhyId);
    }


  },

    globalData: {
    appName: 'pigEnjoy',
    zhyId: 'd26396c499dbfb27717a'
  }
})
