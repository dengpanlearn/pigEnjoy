// miniprogram/pages/shareLife/shareLife.js
var publishUtil = require("../../util/publishUtil.js");
var serverUtil = require("../../util/serverUtil.js");
var util = require("../../util/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bShowBackBtn:false,
    curTimerNum: 0,
    allShareLifeArry:[]
  },

  onViewSharePhoto:function(e){
    let indexArray = e.currentTarget.id.split('+');
    if (indexArray.length != 2)
     return;

    let urls = this.data.allShareLifeArry[parseInt(indexArray[0])].fileIdList;
    let current = urls[parseInt(indexArray[1])];
    wx.previewImage({
      urls: urls,
      current: current
    })
  },

  onShareSelfLife:function(e){
    wx.redirectTo({
      url: '../publishShareLife/publishShareLife',
    })
  },

  onTextAreaBlur:function(e){
   
    let allShareLifeArry = this.data.allShareLifeArry;
    let lifeIndex = parseInt(e.currentTarget.id);
    allShareLifeArry[lifeIndex].focus = false;
    this.setData({
      allShareLifeArry: allShareLifeArry
    });
  },
  
  onTapTextArea:function(e){
   
    let allShareLifeArry = this.data.allShareLifeArry;
    let lifeIndex = parseInt(e.currentTarget.id);
    allShareLifeArry[lifeIndex].focus = true;
    this.setData({
      allShareLifeArry: allShareLifeArry
    });
  },

  onCommentInputBtn:function(e){
  
    util.getInputContents('.comment-input').then(res=>{

      for (let i = 0; i < res.length; i++){
        if (res[i].id == e.currentTarget.id){
      
          let content = res[i].value.trim();
          if (content != '') {
            wx.showLoading({
              title: '加载',
            });
            let lifeIndex = parseInt(e.currentTarget.id);

            publishUtil.addComment({
              shareLifeIndex: lifeIndex,
              content: content
            }).then(res => {
              wx.hideLoading();
              
              let loadedShareLifeArry = publishUtil.getAllPublishShareLife();
              let allShareLifeArry = [];
              for (let i = 0; i < loadedShareLifeArry.length; i++) {
                let tmpShareLife = loadedShareLifeArry[i];
                tmpShareLife.focus = false;
                tmpShareLife.inputComment = '';
                allShareLifeArry.push(tmpShareLife);
              }
              this.setData({
                allShareLifeArry: allShareLifeArry
              });
            }).catch(res => {
              wx.hideLoading();
              wx.showToast({
                title: '评论失败',
              })
            });
          }

          return;
        }
      }
    
    })
  },

  onPraise:function(e){
    wx.showLoading({
      title: '加载',
    });
    serverUtil.addPromise(e.currentTarget.id).then(res=>{
      wx.hideLoading();

    }).catch(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '点赞失败',
      })
    });
  },

onCommentInput:function(e){
  let content = e.detail.value.trim();
  if (content != ''){
    wx.showLoading({
      title: '加载',
    });
    let lifeIndex = parseInt(e.currentTarget.id);

    publishUtil.addComment({
      shareLifeIndex: lifeIndex,
      content: e.detail.value
    }).then(res=>{
      wx.hideLoading();

      let loadedShareLifeArry = publishUtil.getAllPublishShareLife();
      let allShareLifeArry = [];
      for (let i = 0; i < loadedShareLifeArry.length; i++) {
        let tmpShareLife = loadedShareLifeArry[i];
        tmpShareLife.focus = false;
        tmpShareLife.inputComment = '';
        allShareLifeArry.push(tmpShareLife);
      }
      this.setData({
        allShareLifeArry: allShareLifeArry
      });
    }).catch(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '评论失败',
      })
    });
  }
},
  onBackFound:function(e){
    wx.reLaunch({
      url: '../found/found',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    });

    let interNum = setInterval(res => {
      if (publishUtil.loadShareLifeCompeted()) {
        clearInterval(interNum);
        wx.hideLoading();
        console.log(publishUtil.getAllPublishShareLife());
        let loadedShareLifeArry = publishUtil.getAllPublishShareLife();
        let allShareLifeArry = [];
        for (let i = 0; i < loadedShareLifeArry.length; i++)
        {
          let tmpShareLife = loadedShareLifeArry[i];
          tmpShareLife.focus = false;
          tmpShareLife.inputComment = '';
          tmpShareLife.creatTimeFormat = new Date(tmpShareLife.createTime).toLocaleString();
          allShareLifeArry.push(tmpShareLife);
        }
        this.setData({
          allShareLifeArry: allShareLifeArry
        });
      }
    }, 500, this)
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

  onPageScroll:function(opt){

    
    let curTimerNum = this.data.curTimerNum;
    if (curTimerNum != 0) {
      clearTimeout(curTimerNum);
    }

    curTimerNum = setTimeout(res => {
      this.setData({
        bShowBackBtn: false,
        curTimerNum: 0
      })
    }, 4000, this);

    this.setData({
      bShowBackBtn: true,
      curTimerNum: curTimerNum
    });

 
    
  

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