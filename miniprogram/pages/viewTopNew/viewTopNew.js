// miniprogram/pages/viewTopNew/viewTopNew.js

const wxParser = require('../../zhyUtil/wxParser/index');
var publishUtil = require("../../zhyUtil/publishUtil.js");
var util = require("../../zhyUtil/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNew:{},

    contentHtml:'',
    commenFocus:false,
    commentValue:''
  },

  onSend:function(e){
    util.getInputContent('.comment-input').then(content=>{
      if (content != '') {
        wx.showLoading({
          title: '加载',
        })
      

        publishUtil.addNewsComment({
          content: content,
          newsId: this.data.topNew.id
        }).then(res => {
          wx.hideLoading();
          let topNew = this.data.topNew;
         // console.log(res);
          topNew.comment.push(res);
          this.setData({
            topNew: topNew,
            commenFocus: false,
            commentValue: ''
          });
        }).catch(err => {
          wx.hideLoading();
        });
      }
    });
  },

  onPraise: function (e) {
    wx.showLoading({
      title: '加载',
    })

    publishUtil.addNewsPraise(this.data.topNew.id).then(res=>{
      wx.hideLoading();
      let topNew = this.data.topNew;
      topNew.praise.push(res);
      this.setData({
        topNew:topNew
      });
    }).catch(err=>{
      wx.hideLoading();
    });
  },

  onTapTextArea:function(e){
    this.setData({
      commenFocus:true
    });
  },

  onTextAreaBlur: function (e) {
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
      console.log(e);

      publishUtil.addNewsComment({
        content: e.detail.value,
        newsId: this.data.topNew.id
      }).then(res => {
        wx.hideLoading();
        let topNew = this.data.topNew;
        console.log(res);
        topNew.comment.push(res);
        this.setData({
          topNew: topNew,
          commenFocus:false,
          commentValue:''
        });
      }).catch(err => {
        wx.hideLoading();
      });
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    })
  //  console.log(options);
    publishUtil.getTopNews(parseInt(options.topNewsId)).then(res=>{
      wx.hideLoading();
   //   console.log(res);
      res.createTimeFormate = new Date(res.created_at*1000).toLocaleString();
      this.setData({
        topNew:res,
        contentHtml: res.content
      });
      wxParser.parse({
        bind: 'richText',
        html: res.content,
        target: this,
      })
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})