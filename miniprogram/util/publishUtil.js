// 用于保存当前为编辑完，就退出的发表
// 当前用户所发表的所有内容

var serverUtil = require('serverUtil.js')
var unUpdatePublish ={
  curTypeIdx:0,
  title: '',
  content: '',
  toLoadedPhotos:[],
  address:'添加地点',
  bPhotoHighFormat: false
};

var unUpdatePublishShareLife={
  content: '',
  toLoadedPhotos: [],
  address: '添加地点',
  bPhotoHighFormat: false
}


var allSelfOriginalPublish = [];
var allSelfQuestionPublish = [];
var publishShareLifeLoaded = false;

var allShareLifePublish = [];

function getUnUpdatePublishShareLife(){
  return unUpdatePublishShareLife
}

function setUnUpdatePublishShareLife(usrUnUpdatePublishShareLife) {
  unUpdatePublishShareLife = usrUnUpdatePublishShareLife;
}

function getUnUpdatePublish(){
  return unUpdatePublish;
}

function setUnUpdatePublish(usrUnUpdatePublish){
  unUpdatePublish = usrUnUpdatePublish;
}

function loadSelfPublish(){
  serverUtil.loadSelfPublish().then(res=>{
    if (res.length > 0){
      for (let i = 0; i < res.length; i++){
        if (res[i].topicType){
          allSelfQuestionPublish.push(res[i]);
        }else{
          allSelfOriginalPublish.push(res[i]);
        }
      }
    }
    console.log(allSelfOriginalPublish);
    publishLoaded = true;
  }
  ).catch(res=>{
    publishLoaded = true;
  })

}

function loadAllPublishShareLife(){
  const curTime = new Date().getTime();

  serverUtil.loadAllPublishShareLife(curTime).then(res=>{
    if (res.length == 0){
      publishShareLifeLoaded = true;
      return ;
    }
    allShareLifePublish = res;
    for (let i = 0; i < res.length; i++){
   
      serverUtil.getComment(res[i]._id).then(comment=>{
        allShareLifePublish[i].comment = comment;
      
        if (i == (res.length -1)){
          publishShareLifeLoaded = true;
        }
      }).catch(err=>{
        allShareLifePublish[i].comment=[];
        if (i == (res.length - 1)){
          publishShareLifeLoaded = true;
        }
      })
    }
   
  }).catch(res=>{
    console.log(res);
    publishShareLifeLoaded = true;
  });

}

function getAllPublishShareLife(){
  return allShareLifePublish;
}

function loadShareLifeCompeted(){
  return publishShareLifeLoaded;
}

function addComment(comment){
  return new Promise((resolve, reject)=>{
    var publishId = allShareLifePublish[comment.shareLifeIndex]._id;
    serverUtil.addComment({
      publishId: publishId,
      content:comment.content
      }).then(res=>{
    // console.log(res);
        allShareLifePublish[comment.shareLifeIndex].comment.push(res);
        resolve(res);
    }).catch(err=>{
  
      reject(err);
    });
  })

}

function publishShareLife(topicShareLife){
  publishShareLifeLoaded = false;
  return new Promise((resolve, reject)=>{
    serverUtil.publishTopicShareLife(topicShareLife).then(res=>{
      loadAllPublishShareLife();
      resolve(res);
    }).catch(res=>{
      reject(res);
    });
  });
}

module.exports = {
  publishShareLife,
  getUnUpdatePublish,
  setUnUpdatePublish,
  getUnUpdatePublishShareLife,
  setUnUpdatePublishShareLife,
  loadSelfPublish,
  loadShareLifeCompeted,
  loadAllPublishShareLife,
  getAllPublishShareLife,
  addComment

}