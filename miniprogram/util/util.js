
var userInfo = {};
var logged = false;
var right = 'custom'
var appCode = '';

function objectIsEmpty(obj) {
  for (var key in obj) {
    return false;
  }
     
  return true;
}
function getIsLogged() {
  return logged;
}

function getRight() {
  return right;
}

function getUserInfo() {
  return userInfo;
}

function getAvatarUrl() {
  return userInfo.avatarUrl;
}

function getIsUpdateInfo() {
  return !objectIsEmpty(userInfo);
}


function registerUser(appName) {
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({
      name: 'registerUser',
      data: {
        appName: appName,
        userName: userInfo.nickName,
        gender: userInfo.gender,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
        avatarUrl: userInfo.avatarUrl,
        language: userInfo.language
      }
    }).then(res => {
      console.log(res.result);
      if (res.result.code == 0) {
        console.log(res.result.data);
        logged = true;
        resolve(logged);
      } else {
        reject(logged);
      }
    }).catch(res => {
      reject(res);
    })
  })
}

function setUserInfo(info) {
  userInfo = info;
}
// get wx userInfo
function loadWxUserInfo(appName) {

  return new Promise(function (resovle, reject) {
    wx.cloud.callFunction({
      name: 'getUserId',
      data: {
        appName: appName,
        secret: 'f6a008cab77ada27c16a9d2b0ab6c9be',
        code: 'appCode'
      }
    }).then(res => {
      if (res.result.code == 0) {
        console.log(res.result.data);
        let serverUserInfo = res.result.data[0];
        userInfo.nickName = serverUserInfo.userName;
        userInfo.gender = serverUserInfo.gender;
        userInfo.country = serverUserInfo.country;
        userInfo.province = serverUserInfo.province;
        userInfo.city = serverUserInfo.city;
        userInfo.language = serverUserInfo.language;
        userInfo.avatarUrl = serverUserInfo.avatarUrl;
        right = serverUserInfo.right;
        logged = true;
        resovle();
      } else {
        reject();
      }
    }).catch(res => {
      reject(res);
    });
  });



  /*通过云函数可以直接获取到openId,暂时不用获取unionId
  return new Promise(function(resovle, reject){
    wx.login({
      success: res=>{
        if (res.code){
          console.log('logon get code:' + res.code);
          appCode =res.code;

          wx.cloud.callFunction({
            name: 'getUserId',
            data: {
              secret: 'f6a008cab77ada27c16a9d2b0ab6c9be',
              code: appCode
            }
          }).then(res => {
            if (res.result.code == 0) {
              console.log('user open id:' + res.result.data);
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        userInfo = res.userInfo;
                        resovle(res);
                      },
                      fail: res => {
                        reject(res);
                      }
                    })
                  } else {
                    reject(res);
                  }

                },
                fail: res => {
                  reject(res);
                }
              })

            } else {
              reject(res.result.data);
            }


          }).catch(res => {
            reject(res);
          })
          
        }else{
          reject(res.errMsg);
        }
      }
    })
   
  })*/
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

function getInputContent(className) {
  return new Promise((resolve, reject) => {
    wx.createSelectorQuery().select(className).fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      id:true,
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

module.exports = {
  getIsUpdateInfo,
  getAvatarUrl,
  getUserInfo,
  setUserInfo,
  getIsLogged,
  loadWxUserInfo,
  objectIsEmpty,
  registerUser,
  throttle,
  getInputContent,
  getInputContents,
  getRight
}