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
var publishLoaded = false;

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
  const curTime = wx.cloud.database().serverDate();
  serverUtil.loadAllPublishShareLife(curTime).then(res=>{
    
    for (let i = 0; i < res.length; i++){
      let tmpShareLifePublish = res[i];
      tmpShareLifePublish.commet = [];
      serverUtil.getComment(res[i]._id).then(commet=>{
        tmpShareLifePublish.commet = commet;
        allShareLifePublish.push(tmpShareLifePublish);
        if (i == (res.length -1)){
          publishLoaded = true;
        }
      }).catch(err=>{
        allShareLifePublish.push(tmpShareLifePublish);
        if (i == (res.length - 1)){
          publishLoaded = true;
        }
      })
    }
   
  }).catch(res=>{
    console.log(res);
    publishLoaded = true;
  });

}

function getAllPublishShareLife(){
  return allShareLifePublish;
}

function loadCompeted(){
  return publishLoaded;
}

function addComment(comment){

  var publishId = allShareLifePublish[comment.shareLifeIndex]._id;
  return new Promise((resolve, reject)=>{
   
    serverUtil.addComment({
      publishId: publishId,
      content:comment.content
      }).then(res=>{
     console.log(res);
        allShareLifePublish[comment.shareLifeIndex].commet.push(res);
        resolve(res);
    }).catch(err=>{
      reject(err);
    });
  })

}

module.exports = {
  getUnUpdatePublish,
  setUnUpdatePublish,
  getUnUpdatePublishShareLife,
  setUnUpdatePublishShareLife,
  loadSelfPublish,
  loadCompeted,
  loadAllPublishShareLife,
  getAllPublishShareLife,
  addComment

}