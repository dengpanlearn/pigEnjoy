// miniprogram/pages/shareLife/shareLife.js
var publishUtil = require("../../zhyUtil/publishUtil.js");
var serverUtil = require("../../zhyUtil/serverUtil.js");
var util = require("../../zhyUtil/util.js");
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


    let imageFiles = this.data.allShareLifeArry[parseInt(indexArray[0])].imageFiles;
    let urls = [];
    for (let i = 0; i < imageFiles.length; i++){
      urls.push(imageFiles[i].path);
    }
    let current = urls[parseInt(indexArray[1])];
    wx.previewImage({
      urls: urls,
      current: current
    })
  },

  onShareSelfLife:function(e){
    wx.navigateTo({
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
            let shareLifeIndex = parseInt(e.currentTarget.id);
            let allShareLifeArry = this.data.allShareLifeArry;
            let tmpShareLife = allShareLifeArry[shareLifeIndex];

            publishUtil.addComment({
              publishId: tmpShareLife._id,
              content: content
            }).then(res => {
              wx.hideLoading();
              
           
              tmpShareLife.focus = false;
              tmpShareLife.inputComment = '';
              tmpShareLife.comment.push(res);
              allShareLifeArry[shareLifeIndex] = tmpShareLife;

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
    let shareLifeIndex = parseInt(e.currentTarget.id);
    let allShareLifeArry = this.data.allShareLifeArry;
    let tmpShareLife = allShareLifeArry[shareLifeIndex];

    publishUtil.addPraise(tmpShareLife._id).then(res=>{
     
      tmpShareLife.praise.push(res);
      allShareLifeArry[shareLifeIndex] = tmpShareLife
  
      this.setData({
        allShareLifeArry: allShareLifeArry
      });
      wx.hideLoading();


    }).catch(res=>{
      wx.hideLoading();
 
    });
  },

onCommentInput:function(e){
  let content = e.detail.value.trim();
  if (content != ''){
    wx.showLoading({
      title: '加载',
    });

    let shareLifeIndex = parseInt(e.currentTarget.id);
    let allShareLifeArry = this.data.allShareLifeArry;
    let tmpShareLife = allShareLifeArry[shareLifeIndex];
    publishUtil.addComment({
      publishId: tmpShareLife._id,
      content: e.detail.value
    }).then(res=>{
      wx.hideLoading();

        tmpShareLife.focus = false;
        tmpShareLife.inputComment = '';
        tmpShareLife.comment.push(res);
        allShareLifeArry[shareLifeIndex] = tmpShareLife;
       
      
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载',
    });
    let curTime = Math.round(new Date().getTime()/1000);
    publishUtil.loadAllPublishShareLife(curTime).then(res=>{
      wx.hideLoading();
      let loadedShareLifeArry = res;
      let allShareLifeArry = [];

      for (let i = 0; i < loadedShareLifeArry.length; i++) {
        let tmpShareLife = loadedShareLifeArry[i];
        tmpShareLife.focus = false;
        tmpShareLife.inputComment = '';
        tmpShareLife.creatTimeFormat = new Date(tmpShareLife.created_at*1000).toLocaleString();
        allShareLifeArry.push(tmpShareLife);
      }
      this.setData({
        allShareLifeArry: allShareLifeArry
      });
    }).catch(err=>{
      wx.hideLoading();
    })
/*
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
    }, 500, this)*/
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
  onPullDownRefresh: util.throttle(function () {
    wx.showLoading({
      title: '加载',
    });
    let curTime = Math.round(new Date().getTime() / 1000);
    publishUtil.loadAllPublishShareLife(curTime).then(res => {
      wx.hideLoading();
      let loadedShareLifeArry = res;
      let allShareLifeArry = [];

      for (let i = 0; i < loadedShareLifeArry.length; i++) {
        let tmpShareLife = loadedShareLifeArry[i];
        tmpShareLife.focus = false;
        tmpShareLife.inputComment = '';
        tmpShareLife.creatTimeFormat = new Date(tmpShareLife.created_at * 1000).toLocaleString();
        allShareLifeArry.push(tmpShareLife);
      }
      this.setData({
        allShareLifeArry: allShareLifeArry
      });
      wx.stopPullDownRefresh();
    }).catch(err => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })

  
  },2000),

  



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let allShareLifeArry = this.data.allShareLifeArry;
   let curTime = allShareLifeArry[allShareLifeArry.length - 1].created_at;
    wx.showLoading({
      title: '加载',
    })

    publishUtil.loadAllPublishShareLife(curTime).then(res=>{
      let loadedShareLifeArry = res;
   

      for (let i = 0; i < loadedShareLifeArry.length; i++) {
        let tmpShareLife = loadedShareLifeArry[i];
        tmpShareLife.focus = false;
        tmpShareLife.inputComment = '';
        tmpShareLife.creatTimeFormat = new Date(tmpShareLife.created_at * 1000).toLocaleString();
        allShareLifeArry.push(tmpShareLife);


      }

      this.setData({
        allShareLifeArry: allShareLifeArry
      });
      wx.hideLoading();
    }).catch(err=>{
      wx.hideLoading();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})