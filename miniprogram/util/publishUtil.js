// 用于保存当前为编辑完，就退出的发表

var unUpdatePublish ={
  curTypeIdx:0,
  title: '',
  content: '',
  toLoadedPhotos:[],
  address:'添加地点',
  bPhotoHighFormat: false
};


function getUnUpdatePublish(){
  return unUpdatePublish;
}

function setUnUpdatePublish(usrUnUpdatePublish){
  unUpdatePublish = usrUnUpdatePublish;
}

module.exports = {
  getUnUpdatePublish,
  setUnUpdatePublish
}