// miniprogram/pages/technology/technology.js
var publishUtil = require("../../util/publishUtil.js");
var serverUtil = require("../../util/serverUtil.js");
var util = require("../../util/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    technologyType:[
      '养猪',
      '疾病',
      '猪价'
    ],
    curTypeIdx: 0,
    publishTechnology:[]
  },


  onPublish:function(e){
    let curTypeIdx = this.data.curTypeIdx;
    let curType = this.data.technologyType[curTypeIdx];
    wx.redirectTo({
      url: '../publish/publish?technologyTypeIdx='+curTypeIdx+'&technologyType='+curType,
    })

  },
  onSelectType:function(e){
    let curTypeIdx = parseInt(e.currentTarget.id);
    this.setData({
      curTypeIdx: curTypeIdx
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    publishUtil.loadBriefPublishTechnology(this.data.curTypeIdx);
    wx.showLoading({
      title: '加载',
    });

    let interNum = setInterval(res => {
      if (publishUtil.loadBriefPublishTechnologyCompeted(this.data.curTypeIdx)) {
        clearInterval(interNum);
        wx.hideLoading();
        console.log(publishUtil.getBriefPublishTechnoloy(this.data.curTypeIdx));
        let tmpTechnology = this.data.publishTechnology;
        tmpTechnology[this.data.curTypeIdx] = publishUtil.getBriefPublishTechnoloy(this.data.curTypeIdx);
   
        this.setData({
          publishTechnology: tmpTechnology
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