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
    userInfoIsGetted: true,
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

    centerMenu:[{
      name: '我的原创',
      url:'../selfTopic/selfTopic'
    },{
      name: '我的求助',
      url: '../selfQuestion/selfQuestion'
    },{
      name: '我的收藏',
      url: '../collect/collect'
    }
    ],

    connectMenu: [{
      name: '反馈问题',
      url: '../feedBack/feedBack'
    }, {
        name: '联系方式',
        url: '../homeContact/homeContact'
      }
    ]
  },

  onViewSelfTopic:function(e){
    wx.navigateTo({
      url: e.currentTarget.id,
    })
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
      this.setData({
        userInfoIsGetted: false,
      });
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
      this.setData({
        userInfoIsGetted: false,
      });
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