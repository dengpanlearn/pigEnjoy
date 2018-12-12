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

  const db = wx.cloud.database();
  const _command = db.command;
  try{
    let result = await db.collection("pigEnjoy-publish").limit(10).where({
      topicType: typeId,
      createTime: _command.lte(time)
    }).get();

    let allPublishArray = [];
    if (result.data.length > 0)
    {
      for (let i = 0; i < result.data.length;i++){
        let tmpPublish = result.data[i];
        
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