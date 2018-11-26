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
      content: '介绍了MLCP的翻译内容，本次介绍如果参与微软Docs翻译，微软Docs是微软的技术文档网站，里边有各种产品技术的文档说明介绍，但是里边的内容多是机器翻译的，所以翻译效果不是很好，因为微软开放了编辑翻译功能，希望更多的人来参与进来，把文档内容补充的更好，本次介绍一下如何参与Docs翻译。',
      views:0,
      time:'2018-11-26 16:56:32'
    },{
        title: '参与微软本地化翻译——MLCP',
        content: ' 为了帮助当地社区成员更好的使用微软产品、服务，微软开辟了一个开放社区，微软本地化社区(https://aka.ms/MVP19Q2CNTeam31O)，又称MLCP。这是一种集投票、建议、翻译本地化字符串的一个社区平台，所有人都可以注册account来参与微软的本地化翻译。每个参与的人都可以通过Microsoft Cloud + AI International Community Leaderboard（https://microsoftl10n.github.io/）来查看自己的分数贡献值。',
        views: 0,
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