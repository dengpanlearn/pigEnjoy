
const app = getApp();
var  loadedCompeted = false;
var userInfo = {

}


function zhyUtilInit(zhyId){
  require('./sdk-v1.14.0.js');
  wx.BaaS.init(zhyId);
}

function getUserAvatarUrl(){
  return userInfo.avatarUrl;
}

function getUserName() {
  return userInfo.nickName;
}

function getUserId() {
  return userInfo.id;
}

function userLoad(){
 
  return new Promise((resovle, reject)=>{
    wx.getSetting({
      success: res => {
        let authSetting = res.authSetting;

        if ((authSetting['scope.userInfo'] == undefined) || (!authSetting['scope.userInfo'])){
          loadedCompeted = true;
            reject('not author');
            
          }else{
          wx.BaaS.login().then(res=>{
            userInfo = res;
            loadedCompeted = true;
            resovle(res);
            
          }).catch(err=>{
            loadedCompeted = true;
            reject(err);
          })
          }
      },
      fail: err => {
        reject(err);
      }
    })
    
    ;
  })
}

function getUserInfoSync(){
  return new Promise((resolve, reject)=>{
    let intNum = setInterval(res => {
      if (loadedCompeted) {
        clearInterval(intNum);
        if (Object.keys(userInfo).length == 0){
          reject(userInfo);
        }else{
          resolve(userInfo);
        }
      }
    }, 500, 0)
  })

}

function registerUser(data){
  return new Promise((resovle, reject)=>{
    wx.BaaS.handleUserInfo(data).then(res => {
      userInfo = res;
      resovle(res);
    }, res => {
      reject(res);
    })
  });
}

function getInputContent(className) {
  return new Promise((resolve, reject) => {
    wx.createSelectorQuery().select(className).fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      id: true,
      properties: ['value']
    }, res => {
      console.log(res);
      resolve(res.value);
    }).exec();
  })
}

function getInputContents(className) {
  return new Promise((resolve, reject) => {
    wx.createSelectorQuery().selectAll(className).fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      id: true,
      properties: ['value']
    }, res => {
      resolve(res);
    }).exec();
  })
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null
  return function () {

    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments);
      _lastTime = _nowTime
    }
  }
}

module.exports = {
  zhyUtilInit,
  userLoad,
  registerUser,
  getUserInfoSync,
  getUserAvatarUrl,
  getUserName,
  getUserId,
  getInputContent,
  getInputContents,
  throttle

}