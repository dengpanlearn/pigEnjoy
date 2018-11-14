// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    userInfo
  } = event;

  let openId = userInfo.openId;
  const db = cloud.database();

  try{
    let result = await db.collection('demo-default-addr').where({
      openId:openId
    }).get();
    if (result.data.length!=0){
      return {
        code:0,
        data: result.data[0]
      }
    }else{
      return {
        code:-1,
        data: -1
      }
    }
  }catch(err){
    return {
      code: -1,
      data: err
    }
  }


}