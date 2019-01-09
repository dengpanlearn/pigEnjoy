// miniprogram/pages/publishQuestion/publishQuestion.js
var publishUtil = require('../../zhyUtil/publishUtil.js');
var serverUtil = require('../../zhyUtil/serverUtil.js');

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
    questionPeriods:['哺乳仔猪','断奶仔猪','保育猪','育肥猪', '后备母猪', '妊娠母猪', '哺乳母猪', '空怀母猪', '种公猪'],
    selectedPeriodIndex: 0,
    quetionNum: '0',
    quetionTmp:'0.0',
    questionSymptoms:'',
    questionTitle:'',
    curTypeIdx: 0,
    toLoadedPhotos: [],
    curAddress: '选择地址',
    bModify: false
  },

  onInput:function(e){
    this.setData({
      bModify:true
    });
  },

  onCancle: function (e) {

    getInputContent('.quetion-num-input').then(res => {
      let inputValue = res.trim();
      let inputNum = parseInt(inputValue);

      getInputContent('.quetion-temp-input').then(res => {
        let inputTempValue = res.trim();
        let inputTemp = parseFloat(inputTempValue);

        getInputContent('.quetion-title-input').then(res => {
          let inputTitleValue = res.trim();


          getInputContent('.quetion-symptoms-input').then(res => {
            let inputSymptomsValue = res.trim();

            if (this.data.bModify) {
              wx.showModal({
                title: '提示',
                content: '是否保存当前编辑内容',
                success: res => {
                  if (res.confirm) {

                    publishUtil.setUnUpdatePublishQuestion({
                      title: inputTitleValue,
                      content: {
                        selectedPeriodIndex: this.data.selectedPeriodIndex,
                        inputNum: inputNum,
                        inputTemp: inputTemp,
                        inputSymptomsValue: inputSymptomsValue
                      },
                      toLoadedPhotos: this.data.toLoadedPhotos,
                      address: this.data.curAddress,
                      bPhotoHighFormat: this.data.bPhotoHighFormat,
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


          });
        });

      });
    });
  


  },

  onConfirm: function (e) {

    getInputContent('.quetion-num-input').then(res => {
      let inputValue = res.trim();
      let inputNum = parseInt(inputValue);

      getInputContent('.quetion-temp-input').then(res => {
        let inputTempValue = res.trim();
        let inputTemp = parseFloat(inputTempValue);
        getInputContent('.quetion-title-input').then(res => {
          let inputTitleValue = res.trim();

          if (inputTitleValue == "") {
            wx.showToast({
              title: '提示!标题不能为空',
              icon: 'none',
              duration: 2000
            })

            return;
          }

          getInputContent('.quetion-symptoms-input').then(res => {
            let inputSymptomsValue = res.trim();

            if (inputSymptomsValue == "") {
              wx.showToast({
                title: '提示!症状描述不能为空',
                icon: 'none',
                duration: 2000
              })

              return;
            }


            let toLoadedPhotos = this.data.toLoadedPhotos;
            let toLoadedPhotoDir = [];
            for (let i = 0; i < toLoadedPhotos.length; i++) {

              toLoadedPhotoDir.push(toLoadedPhotos[i].src);
            }

            wx.showLoading({
              title: '发表中..',
            });

            publishUtil.publishQuestion({
              title: inputTitleValue,
              content: {
                selectedPeriodIndex: this.data.selectedPeriodIndex,
                inputNum: inputNum,
                inputTemp: inputTemp,
                inputSymptomsValue, inputSymptomsValue
              },
              curAddress: this.data.curAddress,
              toLoadedPhotoDir: toLoadedPhotoDir,
            }).then(res=>{
              wx.hideLoading();
              console.log(res);
              let pages = getCurrentPages();
              let currentPage = pages[pages.length - 2];
    
              let questionBriefList = currentPage.data.questionBriefList;

              let briefComment = {
                count: 0,
                created_at: 0
              };


              let newBrief = {
                _id: res._id,
                avatarUrl: res.avatarUrl,
                title: res.title,
                userName: res.userName,
                created_at: res.created_at,
                createTimeFormat: new Date(res.created_at*1000).toLocaleString(),
                briefComment: briefComment
              }
              questionBriefList.unshift(newBrief);
              currentPage.setData({
                questionBriefList: questionBriefList
              });
              publishUtil.setUnUpdatePublishQuestion({
                title: '',
                content: {
                  selectedPeriodIndex: 0,
                  inputNum: 0,
                  inputTemp: 0.0,
                  inputSymptomsValue:''
                },
                toLoadedPhotos: [],
                address: '选择地址',
                bPhotoHighFormat: false,
              });
              wx.navigateBack({
                delta: 1
              })
            }).catch(err=>{
              wx.hideLoading();
              wx.showToast({
                title: '发表失败',
                duration: 2000
              })
            });
          });
        });



      });

    })
  },

  onSelectPeriod:function(e){
    let index = e.detail.value;
    this.setData({
      selectedPeriodIndex:index,
      bModify:true
    });
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
    let unPublishUtil = publishUtil.getUnUpdatePublishQuestion();
    let content = unPublishUtil.content;
    console.log(unPublishUtil);
    this.setData({
      selectedPeriodIndex: (content == undefined)? 0:unPublishUtil.content.selectedPeriodIndex,
      quetionNum: (content == undefined)?0: unPublishUtil.content.inputNum,
      quetionTmp: (content == undefined)? 0.0 : unPublishUtil.content.inputTemp,

      toLoadedPhotos: unPublishUtil.photoPathList,
      curAddress: unPublishUtil.address,
      questionTitle: unPublishUtil.title,
      questionSymptoms: (content == undefined) ? '' :unPublishUtil.content.inputSymptomsValue,
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