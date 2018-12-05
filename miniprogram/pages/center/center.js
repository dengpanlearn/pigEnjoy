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
        name: '关注',
        value: 0
      },

      {
        name: '粉丝',
        value: 0
      },

      {
        name: '获赞',
        value: 0
      }
    ],

    centerMenu:[
      '我的原创',
      '我的提问',
      '我的回复',
      '我的收藏'
    ],

    connectMenu:[
      '反馈问题',
      '联系方式'
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