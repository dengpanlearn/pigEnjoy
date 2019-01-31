var util = require('./util.js');
function uploadTopicImageFileToZhy(topicType, localFile) {
  const cloudFileType = ['imageTopicShareLife', 'imageTopciTechnology0', 'imageTopciTechnology1',
    'imageTopciTechnology2', 'imageTopciTechnology3'];

  return new Promise((resolve, reject) => {
    
    let MyFile = new wx.BaaS.File()
    let fileParams = { filePath: localFile }
    let metaData = { categoryName: cloudFileType[topicType] }

    MyFile.upload(fileParams, metaData).then(res=>{
      resolve(res.data.file);
    }).catch(err=>{
      reject(err);
    });
  })
}

function publishTopic(topic){
  return new Promise((resolve, reject) =>{
    let promiseArray = [];
    let photoPathList = topic.photoPathList;

    for (let i = 0; i < photoPathList.length; i++) {

      let updatePromise = uploadTopicImageFileToZhy(topic.topicType, photoPathList[i]);
      promiseArray.push(updatePromise);
    }

    Promise.all(promiseArray).then(fileResult=>{
      let MyTableObject = new wx.BaaS.TableObject(61937);
      let newRow = MyTableObject.create();
      newRow.set({
        topicType: topic.topicType,
        title: topic.title,
        content: topic.content,
        address: topic.address,
        imageFiles: fileResult,
        avatarUrl: util.getUserAvatarUrl(),
        userName: util.getUserName(),
        viewTimes:0,
        bPhotoHighFormat:false
      });

      newRow.save().then(res=>{
        resolve({
          _id: res.data._id,
          topicType: res.data.topicType,
          title: res.data.title,
          content: res.data.content,
          address: res.data.address,
          imageFiles: res.data.imageFiles,
          avatarUrl: res.data.avatarUrl,
          userName: res.data.userName,
          created_at: res.data.created_at,
          viewTimes:res.data.viewTimes
          });
      }).catch(err=>{
        reject(err);
      })

    }).catch(err=>{
      reject(err);
    })
  });
}

function publishTopicShareLife(topicShareLife) {

  return publishTopic({
    topicType: 0,
    title: '分享',
    content: topicShareLife.content,
    address: topicShareLife.address,
    photoPathList: topicShareLife.photoPathList,
    bPhotoHighFormat: topicShareLife.bPhotoHighFormat
  });

}


function publishTopicTechnology(technologyTopic) {

  let publishTopicVar = technologyTopic;
  publishTopicVar.topicType += 1;

  return publishTopic(
    publishTopicVar
  );
}


function loadAllPublish(time, topicType) {
  return new Promise((resolve, reject)=>{
    let query = new wx.BaaS.Query();
    let tableObject = new wx.BaaS.TableObject(61937);
    query.compare('created_at', '<', time);
    query.compare('topicType', '=', topicType);

    tableObject.setQuery(query).limit(10).orderBy('-created_at').select(['_id','topicType', 'title',
      'content', 'address', 'imageFiles', 'avatarUrl', 'userName', 'created_at', 'viewTimes']).find().then(res=>{
       // console.log(res.data.objects);
      resolve(res.data.objects);
    }).catch(err=>{
      reject(err);
    });
  });
}

function loadAllPublishShareLife(time) {
  return loadAllPublish(time, 0);
}

function loadAllSelfPublish(time, topicTypes){
  return new Promise((resolve, reject)=>{
    let query = new wx.BaaS.Query();
    let tableObject = new wx.BaaS.TableObject(61937);
    let userId = util.getUserId();
    query.compare('created_at', '<', time);
    query.compare('created_by', '=', userId);
    query.in('topicType', topicTypes);

    tableObject.setQuery(query).limit(5).orderBy('-created_at').select(['_id', 'topicType', 'title',
      'content', 'address', 'imageFiles', 'avatarUrl', 'userName', 'created_at', 'viewTimes']).find().then(res => {
        //  console.log(res.data.objects);
        resolve(res.data.objects);
      }).catch(err => {
        reject(err);
      });
  });
}


function loadBriefPublish(time, topicType){
  return new Promise((resolve, reject) => {
    let query = new wx.BaaS.Query();
    let tableObject = new wx.BaaS.TableObject(61937);
    query.compare('created_at', '<', time);
    query.compare('topicType', '=', topicType);

    tableObject.setQuery(query).limit(10).orderBy('-created_at').select(['_id',  'title',
      'avatarUrl', 'created_at', 'userName']).find().then(res => {
       // console.log(res);
        resolve(res.data.objects);
      }).catch(err => {
        reject(err);
      });
  });
}

function loadBriefPublishTechnology(time, typeId) {
  return loadBriefPublish(time, typeId + 1);
}

function loadBriefTopRankTechnology(time){
  return new Promise((resolve, reject) => {
    let query = new wx.BaaS.Query();
    let tableObject = new wx.BaaS.TableObject(61937);
    query.compare('created_at', '<', time);
    query.in('topicType', [1,2,3]);

    tableObject.setQuery(query).limit(6).orderBy(['-rank', '-created_at']).select(['_id','topicType', 'title',
       'created_at', 'userName', 'imageFiles']).find().then(res => {
       // console.log(res);
        resolve(res.data.objects);
      }).catch(err => {
        reject(err);
      });
  });
}

function loadSelfBriefPublish(time, topicType) {
  return new Promise((resolve, reject) => {
    let query = new wx.BaaS.Query();
    let tableObject = new wx.BaaS.TableObject(61937);
    let userId = util.getUserId();

    query.compare('created_at', '<', time);
    query.compare('topicType', '=', topicType);
    query.compare('created_by', '=', userId);

    tableObject.setQuery(query).limit(10).orderBy('-created_at').select(['_id', 'title',
      'avatarUrl', 'created_at', 'userName']).find().then(res => {
        resolve(res.data.objects);
      }).catch(err => {
        reject(err);
      });
  });
}

function loadSelfBriefPublishTechnology(time, typeId) {
  return loadSelfBriefPublish(time, typeId + 1);
}

function loadPublishInfo(typeId, _id){
 
  return new Promise((resolve, reject)=>{
    let tableObject = new wx.BaaS.TableObject(61937);
    tableObject.select(['_id', 'title',
      'avatarUrl', 'created_at', 'userName', 'content', 'imageFiles','topicType','address'
      ]).get(_id).then(res=>{
    resolve(res.data);
  }).catch(err=>{
    reject(err);
  });
  })
}

function loadPublishTechnologyInfo(typeId, _id) {
  return loadPublishInfo(typeId + 1, _id);
}

function loadPublishShareLifeInfo(_id){
  return loadPublishInfo(0, _id);
}

function addViewTimes(topicId){
  return new Promise((resolve, reject)=>{
    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(topicId);

    topicRow.incrementBy('viewTimes', 1)
    topicRow.update().then(res=>{
      resolve(res);
    }).catch(err=>{
      reject(err);
    });
  });
}

function addComment(comment) {   
  return new Promise((resolve, reject)=>{
    let tableObject = new wx.BaaS.TableObject(61953);
    let newRow = tableObject.create();
    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(comment.publishId);
    newRow.set({

      content: comment.content,
      avatarUrl: util.getUserAvatarUrl(),
      userName: util.getUserName(),
      publishTopic: topicRow
    });
    newRow.save().then(res=>{
   //   console.log(res);
      topicRow.incrementBy('rank', 2);
      topicRow.update().then(rankVal =>{
        resolve({
          _id: res.data._id,
          content: res.data.content,
          avatarUrl: res.data.avatarUrl,
          userName: res.data.userName,
          publishTopic: res.data.publishTopic,
          created_at: res.data.created_at
        });
      }).catch(err=>{
        resolve({
          _id: res.data._id,
          content: res.data.content,
          avatarUrl: res.data.avatarUrl,
          userName: res.data.userName,
          publishTopic: res.data.publishTopic,
          created_at: res.data.created_at
        });
      });

    }).catch(err=>{
      reject(err);
    })

  })
}

function addPraise(publishId)
{
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(61960);
   
    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(publishId);
    let query = new wx.BaaS.Query();

    query.compare('created_by', '=', util.getUserId());
    query.compare('publishTopic', '=', topicRow);
    tableObject.setQuery(query).count().then(num=>{
      if (num > 0){
        reject(num);
      }else{
        let newRow = tableObject.create();
        newRow.set({
          avatarUrl: util.getUserAvatarUrl(),
          userName: util.getUserName(),
          publishTopic: topicRow
        });
        newRow.save().then(res => {
          //console.log(res);
          topicRow.incrementBy('rank', 1);
          topicRow.update().then(rankVal=>{
            resolve({
              _id: res.data._id,
              avatarUrl: res.data.avatarUrl,
              userName: res.data.userName,
              publishTopic: res.data.publishTopic
            });
          }).catch(err=>{
            resolve({
              _id: res.data._id,
              avatarUrl: res.data.avatarUrl,
              userName: res.data.userName,
              publishTopic: res.data.publishTopic
            });
          })

        
        }).catch(err => {
          reject(err);
        })
      }
    }).catch(err=>{
      reject(err);
    })


  })
}

function addCollect(publishId) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(63926);

    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(publishId);
    let query = new wx.BaaS.Query();

    query.compare('created_by', '=', util.getUserId());
    query.compare('publishTopic', '=', topicRow);
    tableObject.setQuery(query).count().then(num => {
      if (num > 0) {
        reject(num);
      } else {
        let newRow = tableObject.create();
        newRow.set({
          avatarUrl: util.getUserAvatarUrl(),
          userName: util.getUserName(),
          publishTopic: topicRow
        });
        newRow.save().then(res => {
          //console.log(res);
          topicRow.incrementBy('rank', 3);
          topicRow.update().then(rankVal => {
            resolve({
              _id: res.data._id,
              avatarUrl: res.data.avatarUrl,
              userName: res.data.userName,
              publishTopic: res.data.publishTopic
            });
          }).catch(err => {
            resolve({
              _id: res.data._id,
              avatarUrl: res.data.avatarUrl,
              userName: res.data.userName,
              publishTopic: res.data.publishTopic
            });
          })


        }).catch(err => {
          reject(err);
        })
      }
    }).catch(err => {
      reject(err);
    })
  })
}

function getBriefComment(_id) {

  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(61953);

    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(_id);
    let query = new wx.BaaS.Query();
    query.compare('publishTopic', '=', topicRow);
    tableObject.setQuery(query).count().then(num=>{
      if (num > 0){
      tableObject.setQuery(query).limit(10).orderBy('-created_at').select(['_id', 'content',
        'avatarUrl', 'created_at', 'userName', 'publishTopic']).find().then(res => {
          // console.log(res);
          resolve({
            count: num,
            created_at: res.data.objects[0].created_at
          });
          
        }).catch(err => {
          reject(err);
        });
      }else{
        reject({
          count: 0,
          created_at: 0
        });
      }
    }).catch(err=>{
      reject(err);
    })
  
  })
}


function getComment(publishId){
  return new Promise((resolve, reject)=>{
    let tableObject = new wx.BaaS.TableObject(61953);

    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(publishId);
    let query = new wx.BaaS.Query();
    query.compare('publishTopic', '=', topicRow);
    tableObject.setQuery(query).count().then(num=>{
      
      tableObject.setQuery(query).limit(5).orderBy('created_at').select(['_id', 'content',
        'avatarUrl', 'created_at', 'userName', 'publishTopic']).find().then(res => {
          // console.log(res);
          resolve({
            count: num,
            comment:res.data.objects
          })
        }).catch(err => {
          reject(err);
        });
    }).catch(err=>{
      reject(err);
    })
 
  })
}

function getMoreNextComment(publishId, skipNum,count){
  return new Promise((resolve, reject)=>{
    let tableObject = new wx.BaaS.TableObject(61953);

    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(publishId);
    let query = new wx.BaaS.Query();
    query.compare('publishTopic', '=', topicRow);
    if (count > 5){
      count = 5;
    }
    tableObject.setQuery(query).limit(count).offset(skipNum).orderBy('created_at').select(['_id', 'content',
      'avatarUrl', 'created_at', 'userName', 'publishTopic']).find().then(res => {
        // console.log(res);
        resolve(
           res.data.objects
        )
      }).catch(err => {
        reject(err);
      });
  })
}

function getPraise(publishId) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(61960);

    let tableTopic = new wx.BaaS.TableObject(61937);
    let topicRow = tableTopic.getWithoutData(publishId);
    let query = new wx.BaaS.Query();
    query.compare('publishTopic', '=', topicRow);
    tableObject.setQuery(query).count().then(num=>{
      tableObject.setQuery(query).limit(10).orderBy('created_at').select(['_id',
        'avatarUrl', 'userName', 'publishTopic']).find().then(res => {
          // console.log(res);
          resolve({
            count:num,
            praise:res.data.objects
          });
        }).catch(err => {
          reject(err);
        });
    }).catch(err=>{
      reject(err);
    })

  })
}

function loadBriefContents(time, groupId, categoryID){
  return new Promise((resolve, reject)=>{
    let MyContentGroup = new wx.BaaS.ContentGroup(groupId);
    let query = new wx.BaaS.Query()
    query.arrayContains('categories', [categoryID]);
    query.compare('created_at', '<', time);

    MyContentGroup.setQuery(query).limit(10).orderBy('-created_at').select(['title', 'description', 'id', 'created_at', 'cover']).find().then(res=>{
  //    console.log(res.data.objects);
      resolve(res.data.objects);
    }).catch(err=>{
      reject(err);
    })

  });
}



function loadBriefTopNews(time){
  return loadBriefContents(time, 1547688310232191, 1547688378319635);
}

function loadBriefPushNews(time) {
  return loadBriefContents(time, 1547688310232191, 1547799942627512);
}

function loadHomeContactNews(time) {
  return loadBriefContents(time, 1548832369449674, 1548832391528266);
}

function loadBriefPublishTopicById(tableId, newsIdArray){
  return new Promise((resolve, reject)=>{
    let tableObject = new wx.BaaS.TableObject(tableId);
    let query = new wx.BaaS.Query()

    query.in('_id', newsIdArray);

    tableObject.setQuery(query).orderBy('-created_at').select(['_id', 'title',
      'avatarUrl', 'created_at', 'userName', 'imageFiles','topicType']).find().then(res => {
      //    console.log(res.data.objects);
      resolve(res.data.objects);
    }).catch(err => {
      reject(err);
    })
  });
}

function loadBriefContentsById(groupId, newsIdArray) {
  return new Promise((resolve, reject) => {
    let MyContentGroup = new wx.BaaS.ContentGroup(groupId);
    let query = new wx.BaaS.Query()
 
   
    query.in('id', newsIdArray);
    MyContentGroup.setQuery(query).orderBy('-created_at').select(['title', 'description', 'id', 'created_at', 'cover']).find().then(res => {
      //    console.log(res.data.objects);
      resolve(res.data.objects);
    }).catch(err => {
      reject(err);
    })

  });
}
function getBriefCollectNews(idArray){
  return loadBriefContentsById(1547688310232191, idArray);
}

function getBriefCollectPublishTopic(idArray) {
  return loadBriefPublishTopicById(61937, idArray);
}

function getContent(groupId, contentId){
  return new Promise((resolve, reject)=>{
   // console.log(contentId);
    let MyContentGroup = new wx.BaaS.ContentGroup(groupId);
    MyContentGroup.select(['title', 'description', 'id', 'created_at', 'content', 'cover']).getContent(contentId).then(res=>{
      resolve(res.data);
    }).catch(err=>{
      reject(err);
    })
  })

}

function getTopNews(contentId) {
  return getContent(1547688310232191, contentId);
}


function addNewsComment(newsComment) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(63074);
    let newRow = tableObject.create();
 
    newRow.set({
      content: newsComment.content,
      avatarUrl: util.getUserAvatarUrl(),
      userName: util.getUserName(),
      newsId: newsComment.newsId
    });
    newRow.save().then(res => {
     // console.log(res);
      resolve({
        _id: res.data._id,
        content: res.data.content,
        avatarUrl: res.data.avatarUrl,
        userName: res.data.userName,
        newsId: res.data.newsId,
        created_at: res.data.created_at
      });
    }).catch(err => {
      reject(err);
    })

  })
}

function addNewsPraise(newsId) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(62956);

    let query = new wx.BaaS.Query();

    query.compare('created_by', '=', util.getUserId());
    query.compare('newsId', '=', newsId);
    tableObject.setQuery(query).count().then(num => {
      if (num > 0) {
        reject(num);
      } else {
        let newRow = tableObject.create();
        newRow.set({
          avatarUrl: util.getUserAvatarUrl(),
          userName: util.getUserName(),
          newsId: newsId
        });
        newRow.save().then(res => {
          //console.log(res);
          resolve({
            _id: res.data._id,
            avatarUrl: res.data.avatarUrl,
            userName: res.data.userName,
            newsId: res.data.newsId
          });
        }).catch(err => {
          reject(err);
        })
      }
    }).catch(err => {
      reject(err);
    })


  })
}

function addNewsCollect(newsId) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(63927);

    let query = new wx.BaaS.Query();

    query.compare('created_by', '=', util.getUserId());
    query.compare('newsId', '=', newsId);
    tableObject.setQuery(query).count().then(num => {
      if (num > 0) {
        reject(num);
      } else {
        let newRow = tableObject.create();
        newRow.set({
          avatarUrl: util.getUserAvatarUrl(),
          userName: util.getUserName(),
          newsId: newsId
        });
        newRow.save().then(res => {
          //console.log(res);
          resolve({
            _id: res.data._id,
            avatarUrl: res.data.avatarUrl,
            userName: res.data.userName,
            newsId: res.data.newsId
          });
        }).catch(err => {
          reject(err);
        })
      }
    }).catch(err => {
      reject(err);
    })


  })
}

function getNewsComment(newsId) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(63074);

  
    let query = new wx.BaaS.Query();
    query.compare('newsId', '=', newsId);
   // console.log(newsId);
    tableObject.setQuery(query).count().then(num=>{
      tableObject.setQuery(query).limit(5).orderBy('created_at').select(['_id', 'content',
        'avatarUrl', 'created_at', 'userName', 'newsId']).find().then(res => {
          // console.log(res);
          resolve({
            count: num,
            comment: res.data.objects
          });
        }).catch(err => {
          reject(err);
        });
    }).catch(err=>{
      reject(err);
    });

  })
}

function getMoreNextNewsComment(newsId, skipNum, count) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(63074);


    let query = new wx.BaaS.Query();
    if (count > 5)
      count = 5;
    query.compare('newsId', '=', newsId);
    // console.log(newsId);

    tableObject.setQuery(query).limit(count).offset(skipNum).orderBy('created_at').select(['_id', 'content',
        'avatarUrl', 'created_at', 'userName', 'newsId']).find().then(res => {
          // console.log(res);
          resolve(res.data.objects);
        }).catch(err => {
          reject(err);
        });


  })
}

function getNewsPraise(newsId) {
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(62956);
    let query = new wx.BaaS.Query();
    query.compare('newsId', '=', newsId);
    tableObject.setQuery(query).count().then(num=>{
      tableObject.setQuery(query).limit(5).orderBy('created_at').select(['_id',
        'avatarUrl', 'userName', 'newsId']).find().then(res => {
          //  console.log(res);
          resolve({
            count: num,
            praise: res.data.objects
          });
        }).catch(err => {
          reject(err);
        });
    }).catch(err=>{
      reject(err);
    });
   
  })
}

function loadSelfTopicCollectInfo(skipCount){
  return new Promise((resolve, reject) => {
    let tableObject = new wx.BaaS.TableObject(63926);
    let query = new wx.BaaS.Query();
   
    query.compare('created_by', '=', util.getUserId());
    query.compare('userName', '=', util.getUserName());

    tableObject.setQuery(query).limit(5).offset(skipCount).orderBy('-created_at').select([ '_id', 'publishTopic']).find().then(res => {
      resolve(res.data.objects);
    }).catch(err => {
      reject(err);
    })
  });
}

function loadSelfNewsCollectInfo(skipCount){
  return new Promise((resolve, reject)=>{
    let tableObject = new wx.BaaS.TableObject(63927);
    let query = new wx.BaaS.Query();
   
    query.compare('created_by', '=', util.getUserId());
    query.compare('userName', '=', util.getUserName());

    tableObject.setQuery(query).limit(5).offset(skipCount).orderBy('-created_at').select(['_id', 'newsId']).find().then(res=>{
      resolve(res.data.objects);
    }).catch(err=>{
      reject(err);
    })
  });
}

module.exports={
  publishTopicShareLife,
  publishTopicTechnology,
  loadAllPublishShareLife,
  loadAllSelfPublish,
  loadBriefPublishTechnology,
  loadPublishTechnologyInfo,
  loadSelfBriefPublishTechnology,
  loadBriefTopRankTechnology,
  loadPublishShareLifeInfo,
  addViewTimes,
  addComment,
  addPraise,
  addCollect,
  getComment,
  
  getMoreNextComment,
  getBriefComment,
  getPraise,
  loadBriefTopNews,
  loadHomeContactNews,
  getTopNews,
  addNewsComment,
  addNewsPraise,
  addNewsCollect,
  getNewsComment,
  getMoreNextNewsComment,
  getNewsPraise,
  loadBriefPushNews,
  loadSelfTopicCollectInfo,
  loadSelfNewsCollectInfo,
  getBriefCollectNews,
  getBriefCollectPublishTopic
}