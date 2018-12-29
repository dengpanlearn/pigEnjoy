// miniprogram/pages/found/found.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList : [
      {
        url: '../../images/life.jpg',
        text:'分享养猪生活',
        page: '../shareLife/shareLife'
      },{
        url: '../../images/study.jpg',
        text: '交流养猪技术',
        page: '../technology/technology'
      },{
        url: '../../images/help.jpg',
        text: '养猪求助',
        page: '../shareLife/shareLife'
      }
    ],
    curIdx : 0
  },

  onChangeSwiper:function(e){
    
    this.setData({
      curIdx: e.detail.current
    });
  },

  onTapSwiperItem:function(e){
   wx.navigateTo({
     url: e.currentTarget.id,
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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