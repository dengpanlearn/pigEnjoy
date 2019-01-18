// miniprogram/pages/pigHome/pigHome.js


var publishUtil = require("../../zhyUtil/publishUtil.js");
var serverUtil = require("../../zhyUtil/serverUtil.js");
var util = require("../../zhyUtil/util.js");
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNews:[],
    pushNews: [],
    curType: 0
  },

onSelectTopNews:function(e){
  this.setData({
    curType:0
  });
},

  onSelectHotPublishs: function (e) {
    this.setData({
      curType: 1
    });
  },

  onView:function(e){
    //console.log(e);
    wx.navigateTo({
      url: '../viewTopNew/viewTopNew?topNewsId='+e.currentTarget.id,
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

    util.userLoad().then(res=>{
    // 
      let waitTimes = 0;
      publishUtil.loadBriefPublishedPushNews().then(pushNews=>{
       // console.log(pushNews);
        this.setData({
          pushNews: pushNews
        });
        waitTimes++;
      }).catch(err=>{
        console.log(err);
        waitTimes++;
      });
      publishUtil.loadBriefPublishedTopNews().then(topNews=>{
       // console.log(topNews);
       this.setData({
         topNews: topNews
       });
        waitTimes++
      //  wx.hideLoading();
      }).catch(err=>{
       // wx.hideLoading();
        waitTimes++;
      })


      let timeNum = setInterval(result => {
        if (waitTimes == 2) {
          clearInterval(timeNum);
          wx.hideLoading();
        }
      }, 500, 0);

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