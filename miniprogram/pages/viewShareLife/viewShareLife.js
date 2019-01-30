// miniprogram/pages/viewShareLife/viewShareLife.js
var publishUtil = require("../../zhyUtil/publishUtil.js");
var serverUtil = require("../../zhyUtil/serverUtil.js");
var util = require("../../zhyUtil/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareLife:{},
    commenFocus: false,
    commentValue: '',
    newComment: false,
    newPraise: false
  },

  onShowMoreComment: function (e) {
    let tmpShareLife = this.data.shareLife;
    wx.showLoading({
      title: '加载',
    })

    serverUtil.getMoreNextComment(tmpShareLife._id, tmpShareLife.comment.length, tmpShareLife.commentCount - tmpShareLife.comment.length).then(comment => {
      tmpShareLife.comment = tmpShareLife.comment.concat(comment);

      this.setData({
        shareLife: tmpShareLife
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    });
  },

  onViewtechnologyPhoto: function (e) {
    let imageFiles = this.data.shareLife.imageFiles;
    let urls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      urls.push(imageFiles[i].path);
    }

    let current = urls[parseInt(e.currentTarget.id)];
    wx.previewImage({
      urls: urls,
      current: current
    })
  },


  onPraise: function (e) {
    wx.showLoading({
      title: '加载',
    });
    serverUtil.addPraise(this.data.shareLife._id).then(res => {
      wx.hideLoading();

      let tmpShareLife = this.data.shareLife;
      tmpShareLife.praise.push(res);
      tmpShareLife.praiseCount++;
      this.setData({
        shareLife: tmpShareLife,
        newPraise:true
      });
    }).catch(err => {
      wx.hideLoading();
    });
  },

  onTapTextArea: function (e) {
    this.setData({
      commenFocus: true
    });
  },

  onTextAreaBlur: function (e) {
    this.setData({
      commenFocus: false
    });
  },

  onCommentInput: function (e) {

    let content = e.detail.value.trim();
    if (content != '') {
      wx.showLoading({
        title: '加载',
      })
      serverUtil.addComment({
        publishId: this.data.shareLife._id,
        content: content
      }).then(res => {
        wx.hideLoading();
        let tmpShareLife = this.data.shareLife;
        tmpShareLife.selfComment.push(res);

        this.setData({
          shareLife: tmpShareLife,
          newComment: true,
          commentValue: ''
        });
      }).catch(err => {
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

    publishUtil.loadPublishShareLifeInfo(options._id).then(shareLife => {
      wx.hideLoading();
      shareLife.selfComment = [];
      shareLife.createTimeFormate = new Date(shareLife.created_at * 1000).toLocaleString();
      console.log(shareLife);
      this.setData({
        shareLife: shareLife
      });
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
    let tmpShareLife = this.data.shareLife;
    if (this.data.newPraise){
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 2];

      let allShareLifeArray = currentPage.data.allShareLifeArry;

      for (let i = 0; i < allShareLifeArray.length; i++) {
        if (allShareLifeArray[i]._id == tmpShareLife._id) {
          let pageShareLife = allShareLifeArray[i];
     //     console.log(tmpShareLife.praise);
          pageShareLife.praise = tmpShareLife.praise;
          pageShareLife.praiseCount = tmpShareLife.praiseCount;
 
          allShareLifeArray[i] = pageShareLife;
          currentPage.setData({
            allShareLifeArry: allShareLifeArray
          });
        }
      }
    }

    if (this.data.newComment) {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 2];

      let allShareLifeArray = currentPage.data.allShareLifeArry;
   
      for (let i = 0; i < allShareLifeArray.length; i++) {
        if (allShareLifeArray[i]._id == tmpShareLife._id) {
          let pageShareLife = allShareLifeArray[i];
          pageShareLife.selfComment = pageShareLife.selfComment.concat(tmpShareLife.selfComment);
          allShareLifeArray[i] = pageShareLife;
          currentPage.setData({
            allShareLifeArry: allShareLifeArray
          });
          return;
        }
      }

    }
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