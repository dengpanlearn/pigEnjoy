
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
          resolve(res.result);
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

function loadAllPublish(time, typeId){
  return new Promise((resolve, reject)=>{
    const db = wx.cloud.database();
    const _command = db.command;
    db.collection("pigEnjoy-publish").limit(10).where({
      topicType: typeId,
      createTime: _command.lte(time)
    }).get().then(res=>{
 
      resolve(res.data);
    }).catch(res=>{
      reject(res);
    });
  });
}

function loadAllPublishShareLife(time){
  return loadAllPublish(time, 0);
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

function addComment(comment){
  return new Promise((resolve, reject)=>{
    wx.cloud.callFunction({
      name: 'addComment',
      data: comment
    }).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    });
  }); 
}

function addPromise(publishId) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'addPraise',
      data: {
        publishId: publishId
      }
    }).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    });
  });
}

module.exports = {
  publishTopicShareLife,
  loadSelfPublish,
  loadAllPublishShareLife,
  addComment,
  addPromise
}