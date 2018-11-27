// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publishType:['文章','求助'],
    publishTypeIcon: ['../../images/original.png', '../../images/question.png'],
    curTypeIdx:0,
    loadedPhoto:[],
    curAddress:'选择地址'

  },

  onGetPhoto:function(e){
    wx.chooseImage({
      success: function(res) {},
    })
  },

  onSelectType:function(e){
    this.setData({
      curTypeIdx: e.detail.value
    })
  },

  onGetAddress:function(e){

    wx.authorize({
      scope: 'scope.address',

      success: function () {
        wx.chooseAddress({
          success: res => {
            this.setData({
              curAddress:res.detailInfo
            });
           // console.log(res);
          },

        })
      },
      fail: function () {
        wx.showToast({
          title: '请容许添加地址',
          icon: 'none',
          duration: 2000
        });
      }
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