// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    time,
    typeId,
    userInfo
  } = event;

  const db = cloud.database();
  const _command = db.command;
  try{
    let result = await db.collection("pigEnjoy-publish").limit(10).where({
      topicType: typeId,
      createTime: _command.lte(time)
    }).orderBy('createTime', 'asc').get();

    if (result.data.length > 0)
    {
      return {
        code: 0,
        data: result.data
      }
    }else{
      return {
        code: -1,
        data:'none publish'
      }
    }

  }catch(e){
    return {
      code: -1,
      data: e
    }
  }
}