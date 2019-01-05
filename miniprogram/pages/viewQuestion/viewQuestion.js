// miniprogram/pages/viewQuestion/viewQuestion.js
var publishUtil = require("../../util/publishUtil.js");
var serverUtil = require("../../util/serverUtil.js");
var util = require("../../util/util.js");
function getInputContent(className) {
  return new Promise((resolve, reject) => {
    wx.createSelectorQuery().select(className).fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['value']
    }, res => {
      resolve(res.value);
    }).exec();
  })
}
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
    getInputContent('.comment-input').then(res=>{
      let comment = res.trim();
      if (comment ==''){
        wx.showLoading({
          title: '请输入有效内容!!',
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
    let urls = this.data.question.fileIdList;
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

      question.createTimeFormate = new Date(question.createTime).toLocaleString();
      for (let i = 0; i < question.comment.length; i++){
      question.comment[i].createTimeFormate = new Date(question.comment[i].createTime).toLocaleString();
      }
      console.log(question);
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
          briefComment.createTime = tmpQuestion.comment[tmpQuestion.comment.length - 1].createTime;
          questionBriefList[i].createTimeFormat = new Date(briefComment.createTime).toLocaleString();
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