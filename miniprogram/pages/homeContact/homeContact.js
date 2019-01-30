// miniprogram/pages/homeContact/homeContact.js

const wxParser = require('../../zhyUtil/wxParser/index');
var publishUtil = require("../../zhyUtil/publishUtil.js");
var serverUtil = require("../../zhyUtil/serverUtil.js");
var util = require("../../zhyUtil/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeContact:[],
    curContactIndex:0
  },

  onSwiperChange:function(opt){
    this.setData({
      curContactIndex: opt.detail.current
    });
  },

  onView:function(opt){
    let homeContact = this.data.homeContact[parseInt(opt.currentTarget.id)];

    wx.previewImage({
      urls: [homeContact.cover],
      current: homeContact.cover
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
      mask: true
    })

    let curTime = Math.round(new Date().getTime() / 1000);
    publishUtil.loadHomeContactNews(curTime).then(homeContact => {
      // console.log(pushNews);

      let waitTimes = 0;
      let homeContactInfo = [];
      for (let i = 0; i < homeContact.length; i++){
        publishUtil.getTopNews(homeContact[i].id).then(res => {
         
         //    console.log(res);
         
          homeContactInfo.push(res);
          waitTimes++;
        }).catch(err => {
          wx.hideLoading();
          waitTimes++;
        })
      }

      let timeNum = setInterval(result => {
        if (waitTimes == homeContact.length) {
          clearInterval(timeNum);
          wx.hideLoading();
          this.setData({
            homeContact: homeContact,
          });
         // console.log(homeContact);
          wxParser.parse({
            bind: 'richText',
            html: homeContactInfo[0].content,
            target: this,
          })
        }
      }, 500, 0);

  
    }).catch(err => {
      //  console.log(err);
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