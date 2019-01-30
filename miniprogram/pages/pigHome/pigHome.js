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
    topPublish:[],
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
    let curType = this.data.curType;
    if (curType == 0){
      wx.navigateTo({
        url: '../viewTopNew/viewTopNew?topNewsId=' + e.currentTarget.id,
      })
    }else{
    //  console.log(e);
      let tmpPublish = this.data.topPublish[parseInt(e.currentTarget.id)];
      wx.navigateTo({
        url: '../viewTechnology/viewTechnology?_id=' + tmpPublish._id + '&technologyTypeIdx=' + tmpPublish.topicType,
      })
    }

  },

  onRefreshNews: util.throttle(function(e){
    wx.showLoading({
      title: '加载',
      mask: true
    })


    let curTime = Math.round(new Date().getTime() / 1000);;
    let curType = this.data.curType;
    if (curType == 0){
      publishUtil.loadBriefPublishedTopNews(curTime).then(topNews => {
        // console.log(topNews);
        this.setData({
          topNews: topNews
        });

        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();

      })
    }else{
      publishUtil.loadBriefTopRank(curTime).then(topPublish => {
        //  console.log(topPublish);
        for (let i = 0; i < topPublish.length; i++) {
          topPublish[i].description = topPublish[i].userName + '  ' + new Date(topPublish[i].briefComment.created_at * 1000).toLocaleString();
        }

        this.setData({
          topPublish: topPublish
        });
        wx.hideLoading();
      }).catch(err=>{
        wx.hideLoading();
      });
    }
 
  },2500),

  onNextNews: util.throttle(function (e) {
    wx.showLoading({
      title: '加载',
      mask: true
    })

    let curType = this.data.curType;
    if (curType == 0){
      let topNews = this.data.topNews;
      let curTime = topNews[topNews.length - 1].created_at;

      publishUtil.loadBriefPublishedTopNews(curTime).then(tmpTopNews => {
        //console.log(tmpTopNews);
        topNews = topNews.concat(tmpTopNews)
        this.setData({
          topNews: topNews
        });

        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();

      })
    }else{
      let topPublish = this.data.topPublish;
      let curTime = topPublish[topPublish.length - 1].created_at;

      publishUtil.loadBriefTopRank(curTime).then(nextPublish => {
        //  console.log(topPublish);
        for (let i = 0; i < nextPublish.length; i++) {
          nextPublish[i].description = nextPublish[i].userName + '  ' + new Date(nextPublish[i].briefComment.created_at * 1000).toLocaleString();
        }
        topPublish = topPublish.concat(nextPublish)
        this.setData({
          topPublish: topPublish
        });
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
      });
    }
  

  },2500),

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
      let curTime = Math.round(new Date().getTime()/1000);
      publishUtil.loadBriefPublishedPushNews(curTime).then(pushNews=>{
       // console.log(pushNews);
        this.setData({
          pushNews: pushNews
        });
        waitTimes++;
      }).catch(err=>{
      //  console.log(err);
        waitTimes++;
      });
      publishUtil.loadBriefPublishedTopNews(curTime).then(topNews=>{
       // console.log(topNews);
       this.setData({
         topNews: topNews
       });
        waitTimes++
      //  wx.hideLoading();
      }).catch(err=>{
       // wx.hideLoading();
        waitTimes++;
      });

      publishUtil.loadBriefTopRank(curTime).then(topPublish=>{
      //  console.log(topPublish);
      for (let i = 0; i < topPublish.length; i++){
        topPublish[i].description = topPublish[i].userName + '  ' + new Date(topPublish[i].briefComment.created_at*1000).toLocaleString();
      }
        this.setData({
          topPublish: topPublish
        });
        waitTimes++;

      }).catch(err=>{
        waitTimes++;
      });

      let timeNum = setInterval(result => {
        if (waitTimes == 3) {
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