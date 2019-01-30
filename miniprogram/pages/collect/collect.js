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

  onView: function (e) {
    //console.log(e);
    let curType = this.data.curType;
    if (curType == 0) {
      wx.navigateTo({
        url: '../viewTopNew/viewTopNew?topNewsId=' + e.currentTarget.id,
      })
    } else {
      let tmpPublish = this.data.collectPublish[parseInt(e.currentTarget.id)];
      wx.navigateTo({
        url: '../viewTechnology/viewTechnology?_id=' + tmpPublish._id + '&technologyTypeIdx=' + tmpPublish.topicType,
      })
    }

  },


  onNextNews: util.throttle(function (e) {
    wx.showLoading({
      title: '加载',
      mask: true
    })

    let curType = this.data.curType;
    if (curType == 0) {
      let pushNews = this.data.collectPushNews;
      let offset = pushNews.length;

      publishUtil.loadSelfNewsCollect(offset).then(tmpPushNews => {
        //console.log(pushNews);
        pushNews = pushNews.concat(tmpPushNews)
        this.setData({
          collectPushNews: pushNews
        });

        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();

      })
    } else {
      let collectPublish = this.data.collectPublish;
      let offset = collectPublish.length;

      publishUtil.loadSelfTopicCollect(offset).then(nextPublish => {
        //  console.log(topPublish);
        for (let i = 0; i < nextPublish.length; i++) {
          nextPublish[i].description = nextPublish[i].userName + '  ' + new Date(nextPublish[i].created_at * 1000).toLocaleString();
        }
        collectPublish = collectPublish.concat(nextPublish)
        this.setData({
          collectPublish: collectPublish
        });
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
      });
    }


  }, 2500),


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
    let collectPushNews =[];
    let collectPublish = [];
    
    publishUtil.loadSelfTopicCollect(0).then(res=>{
      for (let i = 0; i < res.length; i++){
      res[i].description = res[i].userName + '  ' + new Date(res[i].created_at * 1000).toLocaleString();
      }

      collectPublish =res;
      waitTimes++;
     // console.log(collectPublish);
   
    }).catch(err => {
      //  console.log(err);
      waitTimes++;
    });

    publishUtil.loadSelfNewsCollect(0).then(res => {
    
      collectPushNews = res;
   //   console.log(res);
      waitTimes++;
     
    }).catch(err => {
      //  console.log(err);
      waitTimes++;
    });


    let timeNum = setInterval(result => {
      if (waitTimes == 2) {
        clearInterval(timeNum);
        this.setData({
          collectPublish: collectPublish,
          collectPushNews: collectPushNews
        });
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