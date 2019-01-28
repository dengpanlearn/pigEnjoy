// miniprogram/pages/collect/collect.js
var publishUtil = require("../../zhyUtil/publishUtil.js");
var serverUtil = require("../../zhyUtil/serverUtil.js");
var util = require("../../zhyUtil/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userName: 'Hi，你好！',
    collectPushNews:[],
    collectPublish: [],
    curType: 0
  },

  onSelectTopNews: function (e) {
    this.setData({
      curType: 0
    });
  },

  onSelectHotPublishs: function (e) {
    this.setData({
      curType: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    })
    this.setData({
      avatarUrl: util.getUserAvatarUrl(),
      userName: util.getUserName()
    });

    let waitTimes = 0;
    let curTime = Math.round(new Date().getTime() / 1000);
    publishUtil.loadBriefPublishedTopNews(curTime).then(collectPushNews => {
      
      this.setData({
        collectPushNews: collectPushNews
      });
      waitTimes++;
    }).catch(err => {
      //  console.log(err);
      waitTimes++;
    });


    let timeNum = setInterval(result => {
      if (waitTimes == 1) {
        clearInterval(timeNum);
        wx.hideLoading();
      }
    }, 500, 0);
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