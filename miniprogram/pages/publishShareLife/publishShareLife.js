// miniprogram/pages/publish/publish.js

var publishUtil = require('../../util/publishUtil.js');
var serverUtil = require('../../util/serverUtil.js');

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
    toLoadedPhotos: [],
    curAddress: '添加地点',
    content: '',
    bPhotoHighFormat: false,
    bModify: false,
    
  },

  onChangePhotoType: function (e) {
    this.setData({
      bPhotoHighFormat: e.detail.value
    });
  },

  onInput: function (e) {
    this.data.bModify = true;
  },

  onShowImage: function (e) {
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


  onGetAddress: function (e) {

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

  onCancle: function (e) {
      getInputContent('.publish-input').then(res => {
        this.data.content = res;

        if (this.data.bModify) {
          wx.showModal({
            title: '提示',
            content: '是否保存当前编辑内容',
            success: res => {
              if (res.confirm) {

                publishUtil.setUnUpdatePublishShareLife({
                  content: this.data.content,
                  toLoadedPhotos: this.data.toLoadedPhotos,
                  address: this.data.curAddress,
                  bPhotoHighFormat: this.data.bPhotoHighFormat,
                });

                wx.redirectTo({
                  url: '../shareLife/shareLife',
                })
              } else if (res.cancel) {
                wx.redirectTo({
                  url: '../shareLife/shareLife',
                })
              }
            }
          })
        } else {
          wx.redirectTo({
            url: '../shareLife/shareLife',
          })
        }

      })

  },

  onConfirm: function (e) {

      getInputContent('.publish-input').then(res => {
        let content = res.trim();
        if (content == "") {
          wx.showToast({
            title: '提示!请输入有效内容',
            icon: 'none',
            duration: 2000
          })

          return;
        }

        wx.showLoading({
          title: '发表中..',
        });


        let toLoadedPhotos = this.data.toLoadedPhotos;
        let toLoadedPhotoDir = [];
        for (let i = 0; i < toLoadedPhotos.length; i++) {

          toLoadedPhotoDir.push(toLoadedPhotos[i].src);
        }

        serverUtil.publishTopicShareLife({
          content: content,
          address: this.data.curAddress,
          photoPathList: toLoadedPhotoDir,
          bPhotoHighFormat: this.data.bPhotoHighFormat
        }).then(res => {
          wx.hideLoading();
          wx.showToast({
            title: '发表成功',
            duration: 2000
          })

          publishUtil.setUnUpdatePublishShareLife({
            content: '',
            toLoadedPhotos: [],
            address: '添加地点',
            bPhotoHighFormat: false
          });

          wx.redirectTo({
            url: '../shareLife/shareLife',
          });

        }).catch(e => {
          wx.hideLoading();
          wx.showToast({
            title: '发表失败',
            duration: 2000
          })
        });

      })
   


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let unPublishUtil = publishUtil.getUnUpdatePublishShareLife();

    this.setData({
      content: unPublishUtil.content,
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