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
  let result = await db.collection("pigEnjoy-praise").where({
    openId: openId,
    appId: appId
  }).count();

  if (result.total > 0){
    return {
      code: 0,
      data:'already praise'
    }
  }

  await db.collection("pigEnjoy-praise").add({
    data:{
      publishId: publishId,
      openId: openId,
      appId: appId,
      createTime: db.serverDate()
    }
  });

  return {
    code: 0,
    data: 'add praise'
  }

}catch(e){
  return {
    code: -1,
    data: e
  }
}



}