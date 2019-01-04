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
    let userResult = await db.collection("pigEnjoy-user").where({
      openId: openId,
      appId: appId,
    }).get();

    if (userResult.data.length <= 0){
      return {
        code: -1,
        data:'user not register'
      }
    }
    let creatTime =  new Date().getTime();
     let addResult = await db.collection("pigEnjoy-comment").add({
      data:{
        publishId: publishId,
        content: content,
        openId: openId,
        appId:appId,
        createTime: creatTime
      }
    });
    return {
      code: 0,
      data: {
        _id: addResult._id,
        publishId: publishId,
        content: content,
        createTime: creatTime,
        userName: userResult.data[0].userName,
        avatar: userResult.data[0].avatarUrl,
      }
    }
  }catch(e){
    return {
      code: -1,
      data: e
    }
  }

}