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
  },
  {
    curTypeIdx: 2,
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

var briefPublishTechnologyLoaded = [0, 0, 0];
var briefPublishTechnology =[];


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
  return new Promise((resolve, reject)=>{
    const curTime = new Date().getTime();
    allShareLifePublish = [];
    serverUtil.loadAllPublishShareLife(curTime).then(res=>{
      if (res.length == 0) {
       
        reject(allShareLifePublish);
      }else{
        allShareLifePublish = res;
        let waitCompleteds = 0;
        for (let i = 0; i < res.length; i++) {

          serverUtil.getComment(res[i]._id).then(comment => {
            allShareLifePublish[i].comment = comment;
            waitCompleteds++;
      
          }).catch(err => {
            allShareLifePublish[i].comment = [];
            waitCompleteds++;
          })


          serverUtil.getPraise(res[i]._id).then(praise => {
           // console.log(praise);
            allShareLifePublish[i].praise = praise;
            waitCompleteds++;
          
          }).catch(err => {
            allShareLifePublish[i].praise = [];
            waitCompleteds++;
          })

        }

        let timeNum = setInterval(result => {
          if (waitCompleteds == 2*res.length) {
            clearInterval(timeNum);
            resolve(allShareLifePublish);
          }
        }, 500, 0);


      }
    }).catch(err=>{
      reject(err);
    });
  });
  /*
  const curTime = new Date().getTime();

  serverUtil.loadAllPublishShareLife(curTime).then(res=>{
    if (res.length == 0){
      publishShareLifeLoaded = 3;
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
*/
}

function getAllPublishShareLife(){
  return allShareLifePublish;
}

function getBriefPublishTechnoloy(technologyId){
  return briefPublishTechnology[technologyId];
}

function loadShareLifeCompeted(){
  return publishShareLifeLoaded==3;
}

function loadBriefPublishTechnology(technologyTypeId){
  return new Promise((resolve, reject)=>{
    const curTime = new Date().getTime();
    serverUtil.loadBriefPublishTechnology(curTime, technologyTypeId).then(res=>{
      if (res.length == 0) {
        briefPublishTechnology[technologyTypeId] = [];
        resolve(briefPublishTechnology[technologyTypeId]);
      }else{
        briefPublishTechnology[technologyTypeId] = res;
        let waitCompleteds = 0;
        for (let i = 0; i < res.length; i++) {
          serverUtil.getBriefComment(res[i]._id).then(briefComment => {
            briefPublishTechnology[technologyTypeId][i].briefComment = briefComment;
            waitCompleteds++;
          }).catch(err => {
            briefPublishTechnology[technologyTypeId][i].briefComment = {
              count: 0,
              createTime: briefPublishTechnology[technologyTypeId][i].createTime
            };

            waitCompleteds++;
          });

        }

        let timeNum = setInterval(result => {
          if (waitCompleteds == res.length) {
            clearInterval(timeNum);
            resolve(briefPublishTechnology[technologyTypeId]);
          }
        }, 500, 0);
      }
    }).catch(err=>{
      briefPublishTechnology[technologyTypeId] = [];
      reject(err);
    })
  })
  /*
  const curTime = new Date().getTime();
  briefPublishTechnologyLoaded[technologyTypeId] = 0;
  serverUtil.loadBriefPublishTechnology(curTime, technologyTypeId).then(res=>{
 
    if (res.length == 0){
      briefPublishTechnology[technologyTypeId] = [];
      briefPublishTechnologyLoaded[technologyTypeId] = 1;
      return;
    }
    briefPublishTechnology[technologyTypeId] = res;
    let waitCompleteds = 0;
    for (let i = 0; i < res.length; i++){

      serverUtil.getBriefComment(res[i]._id).then(briefComment=>{
        briefPublishTechnology[technologyTypeId][i].briefComment = briefComment;
        if (i == (res.length-1)){
          briefPublishTechnologyLoaded[technologyTypeId] = 1;
        }
        waitCompleteds++;
      }).catch(err=>{
        briefPublishTechnology[technologyTypeId][i].briefComment = {
          count: 0,
          createTime: briefPublishTechnology[technologyTypeId][i].createTime
        };

        waitCompleteds++;
       
        if (i == (res.length - 1)) {
          briefPublishTechnologyLoaded[technologyTypeId] = 1;
        }
      });
     
    }

    let timeNum = setInterval(result => {
      if (waitCompleteds == res.length) {
        clearInterval(timeNum);
   
      }
    }, 500, 0);
  }).catch(err=>{
    briefPublishTechnology[technologyTypeId] = [];
    briefPublishTechnologyLoaded[technologyTypeId] = 1;
  });*/

}


function loadBriefPublishTechnologyCompeted(technologyTypeId) {
  return briefPublishTechnologyLoaded[technologyTypeId];
}

function addComment(comment){
  return new Promise((resolve, reject)=>{
   
    serverUtil.addComment(comment).then(res=>{
    // console.log(res);
       // allShareLifePublish[comment.shareLifeIndex].comment.push(res);
        resolve(res);
    }).catch(err=>{
  
      reject(err);
    });
  })

}

function addPraise(publishId) {
  return new Promise((resolve, reject) => {
    
    serverUtil.addPraise(publishId).then(res => {
     //  console.log(res);
      //allShareLifePublish[idx].praise.push(res);
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
   //   loadAllPublishShareLife();
      resolve(res);
    }).catch(res=>{
      reject(res);
    });
  });
}


function publishTechnology(topicTechnology) {
  briefPublishTechnologyLoaded[topicTechnology.topicType]= 0;
  return new Promise((resolve, reject) => {
    serverUtil.publishTopicTechnology(topicTechnology).then(res => {
    //  loadAllPublishShareLife();
      resolve(res);
    }).catch(res => {
      reject(res);
    });
  });
}

function loadTechnologyInfo(technologyTypeId, _id)
{
  return new Promise((resolve, reject)=>{
    serverUtil.loadPublishTechnologyInfo(technologyTypeId, _id).then(res=>{
      let technologyInfo = res;
      technologyInfo.comment = [];
      technologyInfo.praise = [];
      technologyInfo.loaded = 0;
      serverUtil.getComment(_id).then(comment=>{
        technologyInfo.comment = comment;
        technologyInfo.loaded |= 1;
      }).catch(err=>{
        technologyInfo.loaded |= 1;
      })

      serverUtil.getPraise(_id).then(praise=>{
        technologyInfo.praise = praise;
        technologyInfo.loaded |= 2;
      }).catch(err=>{
        technologyInfo.loaded |= 2;
      })

      let timeNum = setInterval(result=>{
        if (technologyInfo.loaded == 3){
          clearInterval(timeNum);
          resolve(technologyInfo);
        }
      }, 500, 0);

    }).catch(err=>{
      reject(err);
    });

  })
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
  loadBriefPublishTechnology,
  loadBriefPublishTechnologyCompeted,
  getAllPublishShareLife,
  getBriefPublishTechnoloy,
  addComment,
  addPraise,
  loadTechnologyInfo,
}