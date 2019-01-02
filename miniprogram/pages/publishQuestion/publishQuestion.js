// miniprogram/pages/publishQuestion/publishQuestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionPeriod:['哺乳仔猪','断奶仔猪','保育猪','育肥猪', '后备母猪', '妊娠母猪', '哺乳母猪', '空怀母猪', '种公猪'],
    selectedPeriod: 0,
    quetionNum: '0',
    quetionTmp:'0.0',
    curTypeIdx: 0,
    toLoadedPhotos: [],
    curAddress: '选择地址',
  },

  onGetPhoto:function(e){
    wx.chooseImage({
      sizeType: 'original',
      success: res => {

        let toLoadedPhotos = this.data.toLoadedPhotos;
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          let tmpLoadedPhotos = {
            src: res.tempFilePaths[i],
            bDelete: false
          }
          toLoadedPhotos.push(tmpLoadedPhotos);
        }
        wx.showLoading({
          title: '加载中',
        })

        this.setData({
          toLoadedPhotos: toLoadedPhotos,
          bModify: true
        });
        wx.hideLoading();
      },
    })
  },

  onShowImage:function(e){
    let toLoadedPhotos = this.data.toLoadedPhotos;
    let toShowPhoto = '';
    let toLoadPhotosSrc = [];
    for (let i = 0; i < toLoadedPhotos.length; i++) {
      toLoadPhotosSrc.push(toLoadedPhotos[i].src);
      if (toLoadedPhotos[i].src == e.currentTarget.id) {
        toShowPhoto = toLoadedPhotos[i].src;

      }
    }

    wx.previewImage({
      current: toShowPhoto,
      urls: toLoadPhotosSrc,
    })
  },

  onDeleteImage:function(e){
    let toLoadedPhotos = this.data.toLoadedPhotos;
    for (let i = 0; i < toLoadedPhotos.length; i++) {
      if (toLoadedPhotos[i].src == e.currentTarget.id) {
        toLoadedPhotos.splice(i, 1);
        this.setData({
          bModify: true
        });
      }
    }

    this.setData({
      toLoadedPhotos: toLoadedPhotos
    });
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