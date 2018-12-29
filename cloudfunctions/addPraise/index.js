// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    publishId,
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

  if (userResult.data.length <= 0) {
    return {
      code: -1,
      data: 'user not register'
    }
  }

  let result = await db.collection("pigEnjoy-praise").where({
    openId: openId,
    appId: appId,
    publishId: publishId
  }).count();

  if (result.total > 0){
    return {
      code: -1,
      data:'already praise'
    }
  }
  let creatTime = new Date().getTime();
  let addResult = await db.collection("pigEnjoy-praise").add({
    data:{
      publishId: publishId,
      openId: openId,
      appId: appId,
      createTime: creatTime
    }
  });

  return {
    code: 0,
    data: {
      _id: addResult._id,
      publishId: publishId,
      userName: userResult.data[0].userName,
      createTime: creatTime
    }
  }

}catch(e){
  return {
    code: -1,
    data: e
  }
}



}