// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let{
    userInfo
  }= event;

  let openId = userInfo.openId;
  let appId = userInfo.appId;

  try{
    const db = cloud.database();

    let result = await db.collection('demo-shopping').where({
      appId:appId,
      openId:openId
    }).get();

    return {
      code: 0,
      data: result.data
    }

  }catch(err){
    return {
      code: -1,
      data:err
    }

  }
}