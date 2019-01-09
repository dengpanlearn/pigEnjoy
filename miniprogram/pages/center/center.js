// miniprogram/pages/center/center.js

var zhyUtil = require('../../zhyUtil/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
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
    wx.showLoading({
      title: '加载',
    });
    zhyUtil.registerUser(e).then(res=>{
      wx.hideLoading();
    //  console.log(res);
      this.setData({
        avatarUrl: res.avatarUrl,
        userName: res.nickName,
        userInfoIsGetted: true,
      });
    }).catch(err=>{
      wx.hideLoading();
    });
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
    wx.showLoading({
      title: '加载',
    });

    zhyUtil.getUserInfoSync().then(res=>{
      wx.hideLoading();
   //   console.log(res);
     this.setData({
       avatarUrl: res.avatarUrl,
       userName: res.nickName,
       userInfoIsGetted: true,
     });
    }).catch(err=>{
      wx.hideLoading();
    });
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