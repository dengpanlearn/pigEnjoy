// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
let{
  commodityId,
  num,
  userInfo
}=event;

  let appId = userInfo.appId;
  let openId = userInfo.openId;

  const db = cloud.database();

  try{
     let result = await db.collection('demo-shopping').where({
       appId: appId,
        openId: openId,
        commodityId: commodityId,
    }).get();

    if (result.data.length == 0){

      result = await db.collection("demo-shopping").add({
        data:{
          openId: openId,
          commodityId: commodityId,
          num: num,
          appId: appId,
          time:db.serverDate()
        }
   
      });
      return {
        code: 0,
        data: result
      }
    }else{
      const _ = db.command;
      let newNum = result.data[0].num+num;
      if (newNum == 0 ){
        result = await db.collection("demo-shopping").doc(result.data[0]._id
        ).remove();

        return {
          code: 0,
          data:result
        }

      }else{
        result = await db.collection("demo-shopping").doc(result.data[0]._id
        ).update({
          data:{
            num: newNum,
            time: db.serverDate()
          }
    
        });

        return {
          code: 0,
          data: result
        }
      }
    }
  }catch(err){
    return {
      code:-1,
      data:err
    }
  }
}