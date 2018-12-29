// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    publishId,
    userInfo
  } = event;

  const db = cloud.database();
  try{

    let result = await db.collection("pigEnjoy-praise").orderBy('createTime', 'asc').where({
      publishId: publishId
    }).field({
      _id:true,
      publishId: true,
      createTime: true
    }).get();

    if (result.data.length > 0){
      let praiseResult = [];
      for (let i = 0; i < result.data.length; i++){
        let userResult = await db.collection("pigEnjoy-user").where({
          openId: result.data[i].openId,
          appId: result.data[i].appId,
        }).get();

        if (userResult.data.length > 0) {
          let tmpPraiseResult = result.data[i];
          tmpPraiseResult.userName = userResult.data[0].userName;
          praiseResult.push(tmpPraiseResult);
        } 
      }

      return {
        code: 0,
        data: praiseResult
      }
    }else{
      return {
        code: -1,
        data:'no praise'
      }
    }

  }catch(e){
    return{
      code: -1,
      data:e
    }
  }
}