// miniprogram/pages/feedBack/feedBack.js
var publishUtil = require('../../zhyUtil/publishUtil.js');
var serverUtil = require('../../zhyUtil/serverUtil.js');
var util = require('../../zhyUtil/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerIndex: 0,
    range:['应用崩溃，闪退',
    '不流畅，运行卡顿',
    '内容更新不及时',
    '社区管理混乱',
    '其他'],
    bModify:false,
    toLoadedPhotos:[],
    content:''
  },

  onInput: function (e) {
    this.data.bModify = true;
  },

  onConfirm: function (e) {
    util.getInputContent('.add-feed-back-input').then(res => {
            let feedAdd= res.trim();
            let content = {
              feedTypeIdx: this.data.pickerIndex,
              feedAdd: feedAdd
            };

            let toLoadedPhotos = this.data.toLoadedPhotos;
            let toLoadedPhotoDir = [];
            for (let i = 0; i < toLoadedPhotos.length; i++) {

              toLoadedPhotoDir.push(toLoadedPhotos[i].src);
            }

            wx.showLoading({
              title: '发表中..',
            });

            publishUtil.publishFeedBack({
              content:content,
              toLoadedPhotoDir: toLoadedPhotoDir,
            }).then(res => {
              wx.hideLoading();
             // console.log(res);

              publishUtil.setUnUpdatePublishFeedBack({
                content: {
                  feedTypeIdx: 0,
                  feedAdd: ''
                },
                toLoadedPhotos: [],
              });
              wx.navigateBack({
                delta: 1
              })
            }).catch(err => {
              wx.hideLoading();
              wx.showToast({
                title: '发表失败',
                duration: 2000
              })
            });
          });
  },

  onCancle: function (e) {
      util.getInputContent('.add-feed-back-input').then(res => {
        let content = {
          feedTypeIdx:this.data.pickerIndex,
          feedAdd:res
        };


        if (this.data.bModify) {
          wx.showModal({
            title: '提示',
            content: '是否保存当前编辑内容',
            success: res => {
              if (res.confirm) {

                publishUtil.setUnUpdatePublishFeedBack( {
                  content: content,
                  toLoadedPhotos: this.data.toLoadedPhotos,
                });

                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }

      })
  },

  onTouchDelete: function (e) {
    let toLoadedPhotos = this.data.toLoadedPhotos;
    for (let i = 0; i < toLoadedPhotos.length; i++) {
      if (toLoadedPhotos[i].src == e.currentTarget.id) {
        toLoadedPhotos[i].bDelete = !toLoadedPhotos[i].bDelete;
      }
    }

    this.setData({
      toLoadedPhotos: toLoadedPhotos
    });
  },

  onDeleteImage: function (e) {
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

  onGetPhoto: function (e) {

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


  onGetPhoto: function (e) {

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



  onChangeType:function(opt){
   // console.log(opt);
   this.setData({
     pickerIndex: parseInt(opt.detail.value),
     bModify:true
   });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let unUpdateFeedBack = publishUtil.getUnUpdatePublishFeedBack();
    let content = unUpdateFeedBack.content;
   // console.log(unUpdateFeedBack);
    if (content != undefined){
      this.setData({
        pickerIndex: content.feedTypeIdx,
        content: content.feedAdd,
        toLoadedPhotos: unUpdateFeedBack.photoPathList
    });
    }else{
      this.setData({
        toLoadedPhotos: unUpdateFeedBack.photoPathList
      })
    }


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