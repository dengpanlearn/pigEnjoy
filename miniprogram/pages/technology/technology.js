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

  onViewTechnology:function(e){
    let curPublishTechnologyIndex = parseInt(e.currentTarget.id);
    let curPublishTechnology = this.data.publishTechnology[this.data.curTypeIdx][curPublishTechnologyIndex];

    wx.navigateTo({
      url: '../viewTechnology/viewTechnology?_id=' + curPublishTechnology._id +'&technologyTypeIdx='+this.data.curTypeIdx,
    })
  },

  onRefresh: function (curTypeIdx){
    wx.showLoading({
      title: '加载',
    });

    publishUtil.loadBriefPublishTechnology(curTypeIdx).then(res=>{
      let tmpTechnologyArray = this.data.publishTechnology;

      let tmpTechnology = res;

      for (let i = 0; i < tmpTechnology.length; i++) {

        tmpTechnology[i].createTimeFormat = new Date(tmpTechnology[i].briefComment.createTime).toLocaleString();
      }

      tmpTechnologyArray[curTypeIdx] = tmpTechnology
      this.setData({
        publishTechnology: tmpTechnologyArray,
        curTypeIdx: curTypeIdx
      });

      wx.hideLoading();
    }).catch(err=>{
      wx.hideLoading();
    });
    /*publishUtil.loadBriefPublishTechnology(curTypeIdx);
    wx.showLoading({
      title: '加载',
    });

    let interNum = setInterval(res => {
      if (publishUtil.loadBriefPublishTechnologyCompeted(curTypeIdx)) {
        clearInterval(interNum);
        wx.hideLoading();
       
        let tmpTechnologyArray = this.data.publishTechnology;
        let tmpTechnology = publishUtil.getBriefPublishTechnoloy(curTypeIdx);
      
        for (let i = 0; i < tmpTechnology.length; i++) {
        
          tmpTechnology[i].createTimeFormat = new Date(tmpTechnology[i].briefComment.createTime).toLocaleString();
        }

        tmpTechnologyArray[curTypeIdx] = tmpTechnology
        this.setData({
          publishTechnology: tmpTechnologyArray,
          curTypeIdx: curTypeIdx
        });
      }
    }, 500, this)*/
  },

  onPublish:function(e){
    let curTypeIdx = this.data.curTypeIdx;
    let curType = this.data.technologyType[curTypeIdx];
    wx.navigateTo({
      url: '../publish/publish?technologyTypeIdx='+curTypeIdx+'&technologyType='+curType,
    })

  },
  onSelectType:function(e){
    let curTypeIdx = parseInt(e.currentTarget.id);
    this.onRefresh(curTypeIdx);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onRefresh(this.data.curTypeIdx);
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