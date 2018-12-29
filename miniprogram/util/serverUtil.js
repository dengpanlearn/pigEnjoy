
function uploadFileToCloud(cloudFile, localFile){
  return new Promise((resolve, reject)=>{
    wx.cloud.uploadFile({
      cloudPath: cloudFile,
      filePath: localFile
    }).then(res=>{
      resolve(res.fileID);
    }).catch(res=>{
      reject(res);
    });
  })
}

function publishTopic(topic){
  return new Promise((resolve, reject) =>{
    let promiseArray =[];
    let   photoPathList = topic.photoPathList;

    for (let i = 0; i < photoPathList.length; i++) {
    
      let tmpList = photoPathList[i].split(".", 8);
     
      if (tmpList.length > 1) {
        let tmpFileName = tmpList[tmpList.length - 2];
        let sliceStart = tmpFileName.lastIndexOf('/');
        if (sliceStart){
          tmpFileName = tmpFileName.slice(sliceStart+1, tmpFileName.length);
        }
        let cloudPath = topic.topicType ? "enjoyPig/questionImage/" : "enjoyPig/originalImage/" ;
        cloudPath = cloudPath + tmpFileName + "." + tmpList[tmpList.length - 1];
      
       let tmpPromise =  uploadFileToCloud(cloudPath, photoPathList[i]);
        promiseArray.push(tmpPromise);
      }
    }

   
    Promise.all(promiseArray).then(res=>{
      
      wx.cloud.callFunction({
        name: 'publishTopic',
        data: {
          topicType: topic.topicType,
          title: topic.title,
          content: topic.content,
          address: topic.address,
          fileIdList: res,
          bPhotoHighFormat: topic.bPhotoHighFormat
        }
      }).then(res => {
        if (res.result.code == 0) {
          resolve(res.result.data);
        } else {
          console.log(res);
          reject(res.result);
        }
      }).catch(e => {
        console.log(res);
        reject(e);
      })
      
    }).catch(res=>{
      console.log(res);
      reject(res);
  });
 
 
  })
}

function loadSelfPublish(){
  return new Promise((resolve, reject) =>{
    wx.cloud.callFunction({
      name: 'loadSelfPublish',

    }).then(res=>{
      if (res.result.code == 0){
        resolve(res.result.data);
      }else{
        reject(res.result.data);
      }
    }).catch(res=>{
      reject(res);
    });
  })
}


function publishTopicShareLife(topicShareLife){
  
  return publishTopic({
    topicType: 0,
    title: '分享',
    content: topicShareLife.content,
    address: topicShareLife.address,
    photoPathList: topicShareLife.photoPathList,
    bPhotoHighFormat: topicShareLife.bPhotoHighFormat
  });
}

function publishTopicTechnology(technologyTopic){
 
  let publishTopicVar = technologyTopic;
  publishTopicVar.topicType += 1; 

  return publishTopic(
    publishTopicVar
   );
}

function addComment(comment){    

  return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: 'addComment',
      data: comment
    }).then(res=>{
      if (res.result.code == 0) {
        resolve(res.result.data);
      } else {
        reject(res.result.data);
      }
    }).catch(res=>{
      reject(res);
    });
  }); 
}

function addPraise(publishId) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'addPraise',
      data: {
        publishId: publishId
      }
    }).then(res => {
      if (res.result.code == 0){
        resolve(res.result.data);
      }else{
        reject(res.result.data);
      }
    }).catch(res => {
      reject(res);
    });
  });
}

function getComment(publishId){
  return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: "getComment",
      data:{
        publishId: publishId
      }
    }).then(res=>{
      if (res.result.code == 0){
        resolve(res.result.data);
      }else{
        reject(res.result.data);
      }
    }).catch(res=>{
      reject(res);
  })
  })
}


function getPraise(publishId) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "getPraise",
      data: {
        publishId: publishId
      }
    }).then(res => {
      if (res.result.code == 0) {
        resolve(res.result.data);
      } else {
        reject(res.result.data);
      }
    }).catch(res => {
      reject(res);
    })
  })
}

function getBriefComment(publishId){
  return new Promise((resolve, reject)=>{
    const db = wx.cloud.database();
    const collection = db.collection("pigEnjoy-comment");

    collection.where({
      publishId: publishId
    }).count().then(res=>{
      let commentCount = res.total;
      if (commentCount > 0){
        collection.where({
          publishId: publishId
        }).orderBy('createTime', 'desc').limit(1).get().then(res=>{
          resolve({
            count: commentCount,
            createTime:res.data[0].createTime
          });
        }).catch(err=>{
          reject(err);
        });
      }else{
        reject({
          count: 0,
          createTime:0
        });
      }
    }).catch(err=>{
      reject(err);
    });
  })
}

function loadAllPublish(time, typeId) {
  /*
  return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: 'getAllPublish',
      data: {
        time:time,
        typeId: typeId,
      }
    }).then(res=>{
      if (res.result.code == 0) {
        resolve(res.result.data);
      } else {
        reject(res.result.data);
      }
    }).catch(res=>{
      reject(res);
    });
  });
*/
  return new Promise((resolve, reject) => {
    const db = wx.cloud.database();
    const _command = db.command;
    const collection = db.collection("pigEnjoy-publish");
    collection.where({
      topicType: typeId,
      createTime: _command.lte(time)
    }).orderBy("createTime", 'desc').limit(10).field({
      _id:true,
      topicType: true,
      title: true,
      content: true,
      address: true,
      fileIdList: true,
      avatar: true,
      userName: true,
      createTime: true
    }).get().then(res => {
      resolve(res.data)
    }).catch(res => {
      reject(res);
    });
  });

 
}

function loadAllPublishShareLife(time) {
  return loadAllPublish(time, 0);
}


function loadBriefPublish(time, typeId){
  return new Promise((resolve, reject)=>{
    const db = wx.cloud.database();
    const _command = db.command;
    const collection = db.collection("pigEnjoy-publish");
    collection.where({
      topicType: typeId,
      createTime: _command.lte(time)
    }).orderBy("createTime", 'desc').limit(10).field({
      _id:true,
      avatar:true,
      title:true,
      userName:true,
      createTime:true
      }).get().then(res => {
     
      resolve(res.data)
    }).catch(res => {
      reject(res);
    });
  });
}

function loadBriefPublishTechnology(time, typeId){
  return loadBriefPublish(time, typeId+1);
}


function loadPublishInfo(typeId, _id) {
  return new Promise((resolve, reject) => {
    const db = wx.cloud.database();

    const collection = db.collection("pigEnjoy-publish");
    collection.where({
      topicType: typeId,
      _id: _id
    }).field({
      _id: true,
      avatar: true,
      title: true,
      userName: true,
      content: true,
      createTime: true
    }).get().then(res => {
      if (res.data.length == 0){
        reject('none');
      }else{
      resolve(res.data[0]);
      }
    }).catch(res => {
      reject(res);
    });
  });
}

function loadPublishTechnologyInfo(typeId, _id) {
  return loadPublishInfo( typeId + 1, _id);
}
module.exports = {
  publishTopicTechnology,
  publishTopicShareLife,
  loadSelfPublish,
  loadAllPublishShareLife,
  loadBriefPublishTechnology,
  addComment,
  addPraise,
  getComment,
  getPraise,
  getBriefComment,
  loadPublishTechnologyInfo
}