// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {
  let {
    topicType,
    title,
    content,
    address,
    fileIdList,
    bPhotoHighFormat,
    userInfo
  } = event;

  let appId = userInfo.appId;
  let openId = userInfo.openId;

  const db = cloud.database();

  try{
    let usrInfo = await db.collection("pigEnjoy-user").where({
      appId: appId,
      openId: openId, 
    }).get();

    if (usrInfo.data.length == 0){
      return {
        code: -1,
        data:"no user"
      }
    }
    let dbId = await db.collection("pigEnjoy-publish").add({
      data:{
        appId: appId,
        openId: openId,
        topicType: topicType,
        title: title,
        content: content,
        address: address,
        fileIdList: fileIdList,
        avatar: usrInfo.data[0].avatarUrl,
        userName: usrInfo.data[0].userName,
        createTime: new Date().getTime()
      }

    });

    return {
      code: 0,
      data: 0
    };

  }catch(e){
    return {
      code: -2,
      data:e
    }
  }
}