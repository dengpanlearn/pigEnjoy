// miniprogram/pages/shareLife/shareLife.js
var publishUtil = require("../../util/publishUtil.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bShowBackBtn:false,
    curTimerNum: 0,
    allShareLifeArry:[]
  },

  onShareSelfLife:function(e){
    wx.redirectTo({
      url: '../publishShareLife/publishShareLife',
    })
  },

  onBackFound:function(e){
    wx.reLaunch({
      url: '../found/found',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    });

    let interNum = setInterval(res => {
      if (publishUtil.loadCompeted()) {
        clearInterval(interNum);
        wx.hideLoading();
        console.log(publishUtil.getAllPublishShareLife());
        this.setData({
          allShareLifeArry: publishUtil.getAllPublishShareLife()
        });
      }
    }, 500, this)
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

  onPageScroll:function(opt){

    
    let curTimerNum = this.data.curTimerNum;
    if (curTimerNum != 0) {
      clearTimeout(curTimerNum);
    }

    curTimerNum = setTimeout(res => {
      this.setData({
        bShowBackBtn: false,
        curTimerNum: 0
      })
    }, 4000, this);

    this.setData({
      bShowBackBtn: true,
      curTimerNum: curTimerNum
    });

 
    
  

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