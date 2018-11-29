// miniprogram/pages/publish/publish.js

var publishUtil = require('../../util/publishUtil.js');

function getInputContent(className){
  return new Promise((resolve, reject)=>{
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
    publishType:['文章','求助'],
    publishTypeIcon: ['../../images/original.png', '../../images/question.png'],
    curTypeIdx:0,
    toLoadedPhotos:[],
    curAddress:'选择地址',
    content:'',
    title:'',
    bPhotoHighFormat:false,
    bModify:false
  },

  onChangePhotoType: function(e){
    this.setData({
      bPhotoHighFormat:e.detail.value
    });
  },

  onInput:function(e){
    this.data.bModify=true;
  },

  onShowImage:function(e){
    let toLoadedPhotos = this.data.toLoadedPhotos;
    let toShowPhoto ='';
    let toLoadPhotosSrc =[];
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

  onTouchDelete:function(e){
    let toLoadedPhotos = this.data.toLoadedPhotos;
    for (let i = 0; i < toLoadedPhotos.length; i++){
      if (toLoadedPhotos[i].src == e.currentTarget.id){
          toLoadedPhotos[i].bDelete = !toLoadedPhotos[i].bDelete;
      }
    }

    this.setData({
      toLoadedPhotos: toLoadedPhotos
    });
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

  onGetPhoto:function(e){
    
    wx.chooseImage({
      sizeType: 'original',
      success: res=> {
       
        let toLoadedPhotos = this.data.toLoadedPhotos;
        for (let i = 0; i < res.tempFilePaths.length; i++){
          let tmpLoadedPhotos = {
            src: res.tempFilePaths[i],
            bDelete:false
          }
          toLoadedPhotos.push(tmpLoadedPhotos);
        }
        wx.showLoading({
          title: '加载中',
        })
        this.setData({
          toLoadedPhotos:toLoadedPhotos,
          bModify: true
        });
        wx.hideLoading();
      },
    })
  },
 
 
  onSelectType:function(e){
    this.setData({
      curTypeIdx: e.detail.value
    })
  },

  onGetAddress:function(e){
 
    let that = this;
    wx.authorize({
      scope: 'scope.userLocation',

      success: function () {
        wx.chooseLocation({
          success: res => {
            that.setData({
              curAddress: res.address
            });
           // console.log(res);
          },

        })
      },
      fail: function () {
        wx.showToast({
          title: '请容许访问地址',
          icon: 'none',
          duration: 2000
        });
      }
    })

  },

  onCancle:function(e){

    getInputContent('.publish-title-input').then(res=>{
      this.data.title =res;
      getInputContent('.publish-input').then(res=>{
        this.data.content = res;

        if (this.data.bModify){
          wx.showModal({
            title: '提示',
            content: '是否保存当前编辑内容',
            success: res => {
              if (res.confirm) {
              
                publishUtil.setUnUpdatePublish({
                  curTypeIdx: this.data.curTypeIdx,
                  title: this.data.title,
                  content: this.data.content,
                  toLoadedPhotos: this.data.toLoadedPhotos,
                  address: this.data.curAddress,
                  bPhotoHighFormat: this.data.bPhotoHighFormat,
                });

                wx.reLaunch({
                  url: '../center/center',
                })
              } else if (res.cancel) {
                wx.reLaunch({
                  url: '../center/center',
                })
              }
            }
          })
        }else{
          wx.reLaunch({
            url: '../center/center',
          })
        }

      })

    })


  },

  onConfirm:function(e){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let unPublishUtil = publishUtil.getUnUpdatePublish();
   this.setData({
     title: unPublishUtil.title,
     content: unPublishUtil.content,
     curTypeIdx: unPublishUtil.curTypeIdx,
     toLoadedPhotos: unPublishUtil.toLoadedPhotos,
     curAddress: unPublishUtil.address,
     bPhotoHighFormat: unPublishUtil.bPhotoHighFormat
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