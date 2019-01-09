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
  },
  {
    curTypeIdx: 3,
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

var briefSelfPublishTechnology =[];
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

function setUnUpdatePublishQuestion(userUnUnpdateQuestion) {
  unUpdatePublish[3] = {
    curTypeIdx: 3,
    title: userUnUnpdateQuestion.title,
    content: JSON.stringify(userUnUnpdateQuestion.content),
    address: userUnUnpdateQuestion.address,
    toLoadedPhotos: userUnUnpdateQuestion.toLoadedPhotos,
    bPhotoHighFormat: true,
  };
}

function getUnUpdatePublishQuestion() {
  let technology = unUpdatePublish[3];
  return {
    title: technology.title,
    content: (technology.content=='')?undefined:JSON.parse(technology.content),
    address: technology.address,
    photoPathList: technology.toLoadedPhotos,
    bPhotoHighFormat: true,
  }
}


function loadSelfOriginalPublish(){
  return new Promise((resolve, reject)=>{
    allSelfOriginalPublish = [];
    serverUtil.loadAllSelfPublish([0, 1, 2]).then(res => {
      if (res.length == 0) {

        reject(allSelfOriginalPublish);
      } else {
        allSelfOriginalPublish = res;

        let waitCompleteds = 0;
        for (let i = 0; i < res.length; i++) {

          serverUtil.getComment(res[i]._id).then(comment => {
            allSelfOriginalPublish[i].comment = comment;
            waitCompleteds++;

          }).catch(err => {
            allSelfOriginalPublish[i].comment = [];
            waitCompleteds++;
          });

          serverUtil.getPraise(res[i]._id).then(praise => {
            // console.log(praise);
            allSelfOriginalPublish[i].praise = praise;
            waitCompleteds++;

          }).catch(err => {
            allSelfOriginalPublish[i].praise = [];
            waitCompleteds++;
          })
        }
        let timeNum = setInterval(result => {
          if (waitCompleteds == 2 * res.length) {
            clearInterval(timeNum);
            resolve(allSelfOriginalPublish);
          }
        }, 500, 0);
      }
    
    }).catch(res => {
      reject(err);
    })
  })
}


function loadSelfQuestionPublish() {
  return new Promise((resolve, reject) => {
    allSelfQuestionPublish = [];
    serverUtil.loadAllSelfPublish([3]).then(res => {
      if (res.length == 0) {

        reject(allSelfQuestionPublish);
      } else {
        allSelfQuestionPublish = res;

        let waitCompleteds = 0;
        for (let i = 0; i < res.length; i++) {

          serverUtil.getComment(res[i]._id).then(comment => {
            allSelfQuestionPublish[i].comment = comment;
            waitCompleteds++;

          }).catch(err => {
            allSelfQuestionPublish[i].comment = [];
            waitCompleteds++;
          });

          serverUtil.getPraise(res[i]._id).then(praise => {
            // console.log(praise);
            allSelfQuestionPublish[i].praise = praise;
            waitCompleteds++;

          }).catch(err => {
            allSelfQuestionPublish[i].praise = [];
            waitCompleteds++;
          })
        }
        let timeNum = setInterval(result => {
          if (waitCompleteds == 2 * res.length) {
            clearInterval(timeNum);
            resolve(allSelfQuestionPublish);
          }
        }, 500, 0);
      }

    }).catch(err => {
      reject(err);
    })
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
              created_at: briefPublishTechnology[technologyTypeId][i].created_at
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

function loadBriefPublishTechnologyQuestion(){
  return loadBriefPublishTechnology(3);
}

function loadBriefPublishTechnologyCompeted(technologyTypeId) {
  return briefPublishTechnologyLoaded[technologyTypeId];
}

function loadSelfBriefPublishTechnology(technologyTypeId) {
  return new Promise((resolve, reject) => {
    const curTime = new Date().getTime();
    serverUtil.loadSelfBriefPublishTechnology(curTime, technologyTypeId).then(res => {
      if (res.length == 0) {
        briefSelfPublishTechnology[technologyTypeId] = [];
        resolve(briefSelfPublishTechnology[technologyTypeId]);
      } else {
        briefSelfPublishTechnology[technologyTypeId] = res;
        let waitCompleteds = 0;
        for (let i = 0; i < res.length; i++) {
          serverUtil.getBriefComment(res[i]._id).then(briefComment => {
            briefSelfPublishTechnology[technologyTypeId][i].briefComment = briefComment;
            waitCompleteds++;
          }).catch(err => {
            briefSelfPublishTechnology[technologyTypeId][i].briefComment = {
              count: 0,
              created_at: briefSelfPublishTechnology[technologyTypeId][i].created_at
            };

            waitCompleteds++;
          });

        }

        let timeNum = setInterval(result => {
          if (waitCompleteds == res.length) {
            clearInterval(timeNum);
            resolve(briefSelfPublishTechnology[technologyTypeId]);
          }
        }, 500, 0);
      }
    }).catch(err => {
      briefSelfPublishTechnology[technologyTypeId] = [];
      reject(err);
    })
  })
}

function loadSelfBriefPublishTechnologyQuestion() {
  return loadSelfBriefPublishTechnology(3);
}

function addComment(comment){
 
  return new Promise((resolve, reject)=>{
   
    serverUtil.addComment(comment).then(res=>{
        resolve(res);
    }).catch(err=>{
  
      reject(err);
    });
  })

}

function addPraise(publishId) {
 
  return new Promise((resolve, reject) => {
    
    serverUtil.addPraise(publishId).then(res => {

      resolve(res);
    }).catch(err => {

      reject(err);
    });
  })

}

function publishShareLife(topicShareLife){
  return new Promise((resolve, reject)=>{
    serverUtil.publishTopicShareLife(topicShareLife).then(res=>{
      resolve(res);
    }).catch(res=>{
      reject(res);
    });
  });
}

function publishTechnology(topicTechnology) {
  return new Promise((resolve, reject) => {
    serverUtil.publishTopicTechnology(topicTechnology).then(res => {
      resolve(res);
    }).catch(res => {
      reject(res);
    });
  });
}

function publishQuestion(question){
  return new Promise((resolve, reject) => {
   let technologyQuestion={
     topicType: 3,
     title: question.title,
     content: JSON.stringify(question.content),
     address: question.curAddress,
     photoPathList: question.toLoadedPhotoDir,
     bPhotoHighFormat: true
   };
    serverUtil.publishTopicTechnology(technologyQuestion).then(res => {
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

function loadTechnologyQuestionInfo(questionId){
  return new Promise((resolve, reject)=>{
    loadTechnologyInfo(3, questionId).then(res=>{
      let technologyQuestion = res;
      technologyQuestion.content = JSON.parse(res.content);
      resolve(technologyQuestion);
    }).catch(err=>{
      reject(err)
    });
  })
}

module.exports = {
  publishShareLife,
  publishTechnology,
  publishQuestion,
  getUnUpdatePublish,
  setUnUpdatePublish,
  getUnUpdatePublishShareLife,
  setUnUpdatePublishShareLife,
  setUnUpdatePublishQuestion,
  getUnUpdatePublishQuestion,
  loadShareLifeCompeted,
  loadAllPublishShareLife,
  loadSelfOriginalPublish,
  loadSelfQuestionPublish,
  loadBriefPublishTechnology,
  loadBriefPublishTechnologyCompeted,
  loadBriefPublishTechnologyQuestion,
  loadSelfBriefPublishTechnologyQuestion,
  getAllPublishShareLife,
  getBriefPublishTechnoloy,
  addComment,
  addPraise,
  loadTechnologyInfo,
  loadTechnologyQuestionInfo,
}