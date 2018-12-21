// 用于保存当前为编辑完，就退出的发表
// 当前用户所发表的所有内容

var serverUtil = require('serverUtil.js')
var unUpdatePublish =[
  {
    curTypeIdx: 0,
    title: '',
    content: '',
    toLoadedPhotos: [],
    address: '添加地点',
    bPhotoHighFormat: false
  },
  {
    curTypeIdx: 1,
    title: '',
    content: '',
    toLoadedPhotos: [],
    address: '添加地点',
    bPhotoHighFormat: false
  }
];

var unUpdatePublishShareLife={
  content: '',
  toLoadedPhotos: [],
  address: '添加地点',
  bPhotoHighFormat: false
}


var allSelfOriginalPublish = [];
var allSelfQuestionPublish = [];
var publishShareLifeLoaded = 0;

var allShareLifePublish = [];

function getUnUpdatePublishShareLife(){
  return unUpdatePublishShareLife
}

function setUnUpdatePublishShareLife(usrUnUpdatePublishShareLife) {
  unUpdatePublishShareLife = usrUnUpdatePublishShareLife;
}

function getUnUpdatePublish(typeIdx){
  return unUpdatePublish[typeIdx];
}

function setUnUpdatePublish(typeIdx, usrUnUpdatePublish){
  unUpdatePublish[typeIdx] = usrUnUpdatePublish;
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
          publishShareLifeLoaded |= 1;
        }
      }).catch(err=>{
        allShareLifePublish[i].comment=[];
        if (i == (res.length - 1)){
          publishShareLifeLoaded |= 1;
        }
      })

      serverUtil.getPraise(res[i]._id).then(praise => {
        //console.log(praise);
        allShareLifePublish[i].praise = praise;

        if (i == (res.length - 1)) {
          publishShareLifeLoaded |= 2;
        }
      }).catch(err => {
        allShareLifePublish[i].praise = [];
        if (i == (res.length - 1)) {
          publishShareLifeLoaded |= 2;
        }
      })
    }
   
  }).catch(res=>{
    console.log(res);
    publishShareLifeLoaded = 3;
  });

}

function getAllPublishShareLife(){
  return allShareLifePublish;
}

function loadShareLifeCompeted(){
  return publishShareLifeLoaded==3;
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

function addPraise(idx) {
  return new Promise((resolve, reject) => {
    var publishId = allShareLifePublish[idx]._id;
    serverUtil.addPraise(publishId).then(res => {
      // console.log(res);
      allShareLifePublish[idx].praise.push(res);
      resolve(res);
    }).catch(err => {

      reject(err);
    });
  })

}

function publishShareLife(topicShareLife){
  publishShareLifeLoaded = 0;
  return new Promise((resolve, reject)=>{
    serverUtil.publishTopicShareLife(topicShareLife).then(res=>{
      loadAllPublishShareLife();
      resolve(res);
    }).catch(res=>{
      reject(res);
    });
  });
}


function publishTechnology(topicTechnology) {

  return new Promise((resolve, reject) => {
    serverUtil.publishTopicTechnology(topicTechnology).then(res => {
    //  loadAllPublishShareLife();
      resolve(res);
    }).catch(res => {
      reject(res);
    });
  });
}

module.exports = {
  publishShareLife,
  publishTechnology,
  getUnUpdatePublish,
  setUnUpdatePublish,
  getUnUpdatePublishShareLife,
  setUnUpdatePublishShareLife,
  loadSelfPublish,
  loadShareLifeCompeted,
  loadAllPublishShareLife,
  getAllPublishShareLife,
  addComment,
  addPraise,
}