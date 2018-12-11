// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let openId = event.userInfo.openId;
  let appId = event.userInfo.appId;;

  const db = cloud.database();
  const collection = db.collection('demo-default-addr');

  try{
    let result = await collection.where({
      openId: openId
    }).get();

    if (result.data.length != 0){
      let _id = result.data[0]._id;
      result = await collection.doc(_id).update({
        data:{
          cityName: event.cityName,
          countyName: event.countyName,
          detailInfo: event.detailInfo,
          nationalCode: event.nationalCode,
          postalCode: event.postalCode,
          provinceName: event.provinceName,
          telNumber: event.telNumber,
          userName: event.userName,
          time: db.serverDate()
      }
      });
      
      return {
        code: 0,
        data: result
      }

    }else{
      result = await collection.add({
        data:{
          openId: openId,
          appId: appId,
          cityName: event.cityName,
          countyName: event.countyName,
          detailInfo: event.detailInfo,
          nationalCode: event.nationalCode,
          postalCode: event.postalCode,
          provinceName: event.provinceName,
          telNumber: event.telNumber,
          userName: event.userName,
          time: db.serverDate
        }
      });

      return {
        code: 0,
        data: result
      };
    }

  }catch(err){
    return {
      code: -1,
      data: err
    }
  }
  
  
}