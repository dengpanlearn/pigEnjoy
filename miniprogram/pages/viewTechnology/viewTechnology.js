// miniprogram/pages/viewTechnology/viewTechnology.js
var publishUtil = require("../../util/publishUtil.js");
var serverUtil = require("../../util/serverUtil.js");
var util = require("../../util/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    technology:{},
    commenFocus: false,
    commentValue:''
  },

  onPraise:function(e){
    wx.showLoading({
      title: '加载',
    });
    serverUtil.addPraise(this.data.technology._id).then(res=>{
      wx.hideLoading();
 
      let tmpTechnology = this.data.technology;
      tmpTechnology.praise.push(res);
      this.setData({
        technology: tmpTechnology
      });
    }).catch(err=>{
      wx.hideLoading();
    });
  },

  onTapTextArea:function(e){
    this.setData({
      commenFocus: true
    });
  },

  onTextAreaBlur:function(e){
    this.setData({
      commenFocus: false
    });
  },

  onCommentInput:function(e){

    let content = e.detail.value.trim();
    if (content != ''){
      wx.showLoading({
        title: '加载',
      })
      serverUtil.addComment({
        publishId: this.data.technology._id,
        content: content
      }).then(res=>{
        wx.hideLoading();
        let tmpTechnology = this.data.technology;
        tmpTechnology.comment.push(res);
        this.setData({
          technology: tmpTechnology,
          commentValue:''
        });
      }).catch(err=>{
        wx.hideLoading();
        this.setData({
          commentValue: ''
        });
      });
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    });
    
    publishUtil.loadTechnologyInfo(parseInt(options.technologyTypeIdx), options._id).then(technology=>{
      wx.hideLoading();

      technology.createTimeFormate = new Date(technology.createTime).toLocaleString();
      console.log(technology);
      this.setData({
        technology: technology
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