// miniprogram/pages/selfQuestion/selfQuestion.js
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
    questionBriefList: []
  },

  onViewQuestion: function (e) {
    let index = parseInt(e.currentTarget.id);
    wx.navigateTo({
      url: '../viewQuestion/viewQuestion?questionId=' + this.data.questionBriefList[index]._id,
    })
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
    let curTime = Math.round(new Date().getTime()/1000);
    publishUtil.loadSelfBriefPublishTechnologyQuestion(curTime).then(res => {

      let questionBriefList = res;


      for (let i = 0; i < questionBriefList.length; i++) {

        questionBriefList[i].createTimeFormat = new Date(questionBriefList[i].briefComment.created_at * 1000).toLocaleString();
      }
      this.setData({
        questionBriefList: questionBriefList
      });
      wx.hideLoading();
    }).catch(err => {
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
  onReachBottom: util.throttle(function () {
    wx.showLoading({
      title: '加载',
    })

    let questionBriefList=  this.data.questionBriefList;
    let curTime = questionBriefList[questionBriefList.length-1].created_at;
    publishUtil.loadSelfBriefPublishTechnologyQuestion(curTime).then(res => {

  
      for (let i = 0; i < res.length; i++) {

        res[i].createTimeFormat = new Date(res[i].briefComment.created_at * 1000).toLocaleString();
        questionBriefList.push(res[i]);
      }
      this.setData({
        questionBriefList: questionBriefList
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    });
  },2500),

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})