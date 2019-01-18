// miniprogram/pages/viewQuestion/viewQuestion.js
var publishUtil = require("../../zhyUtil/publishUtil.js");
var serverUtil = require("../../zhyUtil/serverUtil.js");
var util = require("../../zhyUtil/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:{},
    commenFocus:false,
    commentValue:'',
    newComment:false
  },

  onSendComment:function(e){
    util.getInputContent('.comment-input').then(res=>{
      let comment = res.trim();
      if (comment ==''){
        wx.showToast({
          title: '请输入有效内容!!!',
        })

        return;
      }


      wx.showLoading({
        title: '加载',
      })
      serverUtil.addComment({
        publishId: this.data.question._id,
        content: comment
      }).then(result => {
        result.createtimeFormate = new Date(result.createTime).toLocaleString();
        wx.hideLoading();
        let tmpQuestion = this.data.question;
        tmpQuestion.comment.push(result);

        this.setData({
          question: tmpQuestion,
          newComment: true,
          commentValue: ''
        });
      }).catch(err => {
        wx.hideLoading();
        this.setData({
          commentValue: ''
        });
      });

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

  onViewQuestionPhoto:function(e){
    let imageFiles = this.data.question.imageFiles;
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    })
    let questionId = options.questionId;
    publishUtil.loadTechnologyQuestionInfo(questionId).then(question => {
      wx.hideLoading();

      question.createTimeFormate = new Date(question.created_at*1000).toLocaleString();
      for (let i = 0; i < question.comment.length; i++){
        question.comment[i].createTimeFormate = new Date(question.comment[i].created_at*1000).toLocaleString();
      }
   //   console.log(question);
      this.setData({
        question: question
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
    let tmpQuestion = this.data.question;

    if (this.data.newComment) {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 2];
    
      let questionBriefList = currentPage.data.questionBriefList;
    
      for (let i = 0; i < questionBriefList.length; i++) {
        if (questionBriefList[i]._id == tmpQuestion._id) {
          let briefComment = questionBriefList[i].briefComment;

          briefComment.count = tmpQuestion.comment.length;
          briefComment.created_at = tmpQuestion.comment[tmpQuestion.comment.length - 1].created_at;
          questionBriefList[i].createTimeFormat = new Date(briefComment.created_at*1000).toLocaleString();
          questionBriefList[i].briefComment = briefComment;
          
          currentPage.setData({
            questionBriefList: questionBriefList
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