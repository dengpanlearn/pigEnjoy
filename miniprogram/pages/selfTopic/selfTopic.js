// miniprogram/pages/selfTopic/selfTopic.js
var util = require('../../zhyUtil/util.js');
var serverUtil = require("../../zhyUtil/serverUtil.js");
var publishUtil = require('../../zhyUtil/publishUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userName: 'Hi，你好！',
    userTopicInfos: [{
      name: '生活',
      value: 0
    },
    {
      name: '技术',
      value: 0
    },

    {
      name: '留言',
      value: 0
    },

    {
      name: '获赞',
      value: 0
    }
    ],
    selfPublishTopic:[]
  },

  onShowMoreComment:function(e){
    let selfPublishTopic = this.data.selfPublishTopic;
    let lifeIndex = parseInt(e.currentTarget.id);
    let tmpSelfPublish = selfPublishTopic[lifeIndex];

    wx.showLoading({
      title: '加载',
    })

    serverUtil.getMoreNextComment(tmpSelfPublish._id, tmpSelfPublish.comment.length, tmpSelfPublish.commentCount - tmpSelfPublish.comment.length).then(comment=>{
      tmpSelfPublish.comment = tmpSelfPublish.comment.concat(comment);
      selfPublishTopic[lifeIndex] = tmpSelfPublish;
      this.setData({
        selfPublishTopic: selfPublishTopic
      });
      wx.hideLoading();
    }).catch(err=>{
      wx.hideLoading();
    })

  },


  onViewSelfTopicPhoto:function(e){
    let indexArray = e.currentTarget.id.split('+');
    if (indexArray.length != 2)
      return;


    let imageFiles = this.data.selfPublishTopic[parseInt(indexArray[0])].imageFiles;
    let urls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      urls.push(imageFiles[i].path);
    }
    let current = urls[parseInt(indexArray[1])];
    wx.previewImage({
      urls: urls,
      current: current
    })
  },

  onTextAreaBlur: function (e) {

    let selfPublishTopic = this.data.selfPublishTopic;
    let lifeIndex = parseInt(e.currentTarget.id);
    selfPublishTopic[lifeIndex].focus = false;
    this.setData({
      selfPublishTopic: selfPublishTopic
    });
  },

  onTapTextArea: function (e) {

    let selfPublishTopic = this.data.selfPublishTopic;
    let lifeIndex = parseInt(e.currentTarget.id);
    selfPublishTopic[lifeIndex].focus = true;
    this.setData({
      selfPublishTopic: selfPublishTopic
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl: util.getUserAvatarUrl(),
      userName: util.getUserName()
    });
    wx.showLoading({
      title: '加载',
    })
    let userId = util.getUserId();
    let curTime = Math.round(new Date().getTime()/1000);
    publishUtil.loadSelfOriginalPublish(curTime).then(res=>{
      wx.hideLoading();
     
      let lastYear = 0;
      let lastMonth = 0;
      let selfPublishTopic = res;

      for (let i = 0; i < res.length; i++){
        let creatDate = new Date(selfPublishTopic[i].created_at * 1000);
        let curYear = creatDate.getFullYear();
        let curMonth = creatDate.getMonth()+1;
        selfPublishTopic[i].createFormate = creatDate.toLocaleString();
        selfPublishTopic[i].createYear = curYear;
        selfPublishTopic[i].createMonth = curMonth;
        selfPublishTopic[i].inputComment = '';
        selfPublishTopic[i].focus = false;
        if ((curYear == lastYear) && (curMonth == lastMonth)){
          selfPublishTopic[i].bContinue = true;
        }else{
          selfPublishTopic[i].bContinue = false;
          lastYear = curYear;
          lastMonth = curMonth;
        }
      }
   
      this.setData({
        selfPublishTopic: selfPublishTopic
      });
    }).catch(err=>{
      wx.hideLoading();
    })
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
    let selfPublishTopic = this.data.selfPublishTopic;
    let curTime = selfPublishTopic[selfPublishTopic.length-1].created_at;
    publishUtil.loadSelfOriginalPublish(curTime).then(res => {

      let lastYear = selfPublishTopic[selfPublishTopic.length - 1].createYear;
      let lastMonth = selfPublishTopic[selfPublishTopic.length - 1].createMonth;
   
      for (let i = 0; i < res.length; i++) {
        let creatDate = new Date(res[i].created_at * 1000);
        let curYear = creatDate.getFullYear();
        let curMonth = creatDate.getMonth() + 1;
        res[i].createFormate = creatDate.toLocaleString();
        res[i].createYear = curYear;
        res[i].createMonth = curMonth;
        res[i].inputComment = '';
        res[i].focus = false;
        if ((curYear == lastYear) && (curMonth == lastMonth)) {
          res[i].bContinue = true;
        } else {
          res[i].bContinue = false;
          lastYear = curYear;
          lastMonth = curMonth;
        }

        selfPublishTopic.push(res[i]);
      }

      this.setData({
        selfPublishTopic: selfPublishTopic
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  },2500),

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})