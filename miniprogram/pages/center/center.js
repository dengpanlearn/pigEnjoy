// miniprogram/pages/center/center.js

var util = require('../../util/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    userName: 'Hi，你好！',
    userInfoIsGetted: false,
    userBlogInfos:[{
      name:'等级',
      value: 0
    },
      {
        name: '原创',
        value: 0
      },

      {
        name: '提问',
        value: 0
      },

      {
        name: '回复',
        value: 0
      },

      {
        name: '获赞',
        value: 0
      }
    ],

    blogOriginal:[{
      title:'参与微软Docs翻译',
      content: '介绍了MLCP的翻译内容，本次介绍如果参与微软Docs翻译，微软Docs是微软的技术文档网站，里边有各种产品技术的文档说明介绍.....',
      viewReads:0,
      viewDiscuss: 0,
      time:'2018-11-26 16:56:32'
    },{
        title: '参与微软本地化翻译——MLCP1',
        content: ' 为了帮助当地社区成员更好的使用微软产品、服务，微软开辟了一个开放社区，微软本地化社区(https://aka.ms/MVP19Q2CNTeam31O).....',
        viewReads: 0,
        viewDiscuss: 0,
        time: '2018-11-26 16:56:32'
    }
      , {
        title: '参与微软本地化翻译——MLCP2',
        content: ' 为了帮助当地社区成员更好的使用微软产品、服务，微软开辟了一个开放社区，微软本地化社区(https://aka.ms/MVP19Q2CNTeam31O).....',
        viewReads: 0,
        viewDiscuss: 0,
        time: '2018-11-26 16:56:32'
      }
      , {
        title: '参与微软本地化翻译——MLCP3',
        content: ' 为了帮助当地社区成员更好的使用微软产品、服务，微软开辟了一个开放社区，微软本地化社区(https://aka.ms/MVP19Q2CNTeam31O).....',
        viewReads: 0,
        viewDiscuss: 0,
        time: '2018-11-26 16:56:32'
      }
    ],

    question: [{
      title: '同一主体认证的公众号可以注册几个小程序',
      content: '公众号已经用主体信息创建了10个小程序，再创建就创建不了了，如果再用这个主体注册认证一个公众号，是不是还能重新注册10个小程序......',
      questionReads: 0,
      questionAns: 0,
      time: '2018-11-26 16:56:32'
    }, {
        title: 'form submit事件无效',
        content: '当前 Bug 的表现（可附上截图）form button[type = submit]无法触发submit事件, 但是tap事件依然有效',
        questionReads: 0,
        questionAns: 0,
        time: '2018-11-26 16:56:32'
      }, 
      {
        title: 'form submit事件无效1',
        content: '当前 Bug 的表现（可附上截图）form button[type = submit]无法触发submit事件, 但是tap事件依然有效',
        questionReads: 0,
        questionAns: 0,
        time: '2018-11-26 16:56:32'
      },
      {
        title: 'form submit事件无效2',
        content: '当前 Bug 的表现（可附上截图）form button[type = submit]无法触发submit事件, 但是tap事件依然有效',
        questionReads: 0,
        questionAns: 0,
        time: '2018-11-26 16:56:32'
      }
    ]
  },

  onGetUserInfo: function (e) {
    if (!util.objectIsEmpty(e.detail.userInfo)) {
      util.setUserInfo(e.detail.userInfo);
      wx.showLoading({
        title: '注册中',
      })
      util.registerUser(app.globalData.appName).then((res) => {
        this.setData({
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo,
          userName: e.detail.userInfo.nickName,
          userInfoIsGetted: true
        })
        wx.hideLoading();
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
      });
    }
  },

  onOpenSetting: function (e) {
    wx.openSetting({
      success: res => {
        console.log(res);
      }
    })
  },

  onPublish:function(e){
    wx.redirectTo({
      url: '../publish/publish',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (util.getIsUpdateInfo()) {
      this.setData({
        avatarUrl: util.getAvatarUrl(),
        userInfo: util.getUserInfo(),
        userName: util.getUserInfo().nickName,
        userInfoIsGetted: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})