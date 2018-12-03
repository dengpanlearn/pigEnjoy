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

var allSelfOriginalPublish = [];
var allSelfQuestionPublish = [];
var publishLoaded = false;

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

function loadCompeted(){
  return publishLoaded;
}

module.exports = {
  getUnUpdatePublish,
  setUnUpdatePublish,
  loadSelfPublish,
  loadCompeted
}