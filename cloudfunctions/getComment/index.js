// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let{
    publishId,
    userInfo
  } = event;

  const db = cloud.database();
  try{
    let result = await db.collection("pigEnjoy-comment").where({
      publishId: publishId
    }).get();

    let commentResults = [];
    if (result.data.length > 0){
      for (let i = 0; i < result.data.length; i++){
        let userResult = await db.collection("pigEnjoy-user").where({
          openId: result.data[i].openId,
          appId: result.data[i].appId,
        }).orderBy('createTime', 'desc').get();

        if (userResult.data.length > 0){
          let tmpCommentResult = result.data[i];
          tmpCommentResult.userName = userResult.data[0].userName;
          commentResults.push(tmpCommentResult);
        }
      }

      return {
        code: 0,
        data: commentResults
      }
    }else{
      return {
        code: -1,
        data: 'none'
      }
    }

  }catch(e){
    return {
      code: -1,
      data: e
    }
  }
  
}