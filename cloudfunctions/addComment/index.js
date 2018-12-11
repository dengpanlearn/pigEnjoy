// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    publishId,
    content,
    userInfo
  } = event;

  let openId = userInfo.openId;
  let appId = userInfo.appId;

  try{
    const db = cloud.database();
    await db.collection("pigEnjoy-comment").add({
      data:{
        publishId: publishId,
        content: content,
        openId: openId,
        appId:appId,
        createTime: db.serverDate()
      }
    });
    return {
      code: 0,
      data:0
    }
  }catch(e){
    return {
      code: -1,
      data: e
    }
  }

}