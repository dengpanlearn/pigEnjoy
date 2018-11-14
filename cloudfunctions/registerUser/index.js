// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let{
    userName,
    gender,
    city,
    province,
    country,
    avatarUrl,
    language,
    userInfo
  } = event;

  let openId = userInfo.openId;
  let appId = userInfo.appId;

  const db = cloud.database();
  const collection = db.collection('demo-user');

  try{
    let result = await collection.where({
      openId: openId
    }).get();

  // user already exit
    if (result.data.length != 0){
      return {
        code: 0,
        data: result.data
      }
    }

    try {
      let result = await collection.add({
        data: {
          description: "demo registered user database",
          userName:userName,
          gender:gender,
          city:city,
          province:province,
          country:country,
          openId:openId,
          appId:appId,
          avatarUrl: avatarUrl,
          language: language,
          right:'custom',
          createTime: db.serverDate()
        }
      });
      return {
        code: 0,
        data: result._id
      }
    } catch (err) {
      return {
        code: -1,
        data: err
      }
    }

   
  }catch (err) {
   
      return {
        code: -1,
        data: err
      }
  }

}