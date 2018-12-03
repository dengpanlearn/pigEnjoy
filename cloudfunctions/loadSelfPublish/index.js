// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    userInfo
  } = event;

  let openId = userInfo.openId;
  let appId = userInfo.appId;

  const db = cloud.database();
  const collection = db.collection("pigEnjoy-publish");

  try{
    let result = await collection.where({
      openId: openId,
      appId: appId,
    }).orderBy("createTime","desc").get();

    if (result.data.length > 0){
      return {
        code: 0,
        data: result.data
      }
    }else{
      return {
        code: -1,
        data: []
      }
    }
  }catch(e){
    return {
      code:-1,
      data:e
    }
  }
}