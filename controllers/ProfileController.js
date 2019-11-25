let userModel = require('../models/user');
let postModel = require('../models/post');
let messageModel = require('../models/message')
let nodemailer = require('nodemailer');


async function getProfile(req, res) {
    await userModel.getUserById(req.params.userId)
    .then(([rows, field]) => {
        postModel.getPostsByUserId(rows[0].id)
        .then(([postrows, field]) => {
            res.render('userProfile', {profileCSS: true, postCSS: true, user: rows[0], posts: postrows });
        }).catch(error => console.log("get user posts error: " + error));
    })
    .catch(error => console.log("get profile error: " + error));
};

async function likeUser(req, res) {
    await userModel.likeUser(req.params.userId).then(() => {}).catch(error => console.log("like user error: " + error));
    await userModel.getUserById(req.params.userId)
    .then(([rows, field]) => {
        postModel.getPostsByUserId(req.params.userId)
        .then(([postrows, field]) => {
            res.render('userProfile', {profileCSS: true, postCSS: true, user: rows[0], posts: postrows });
        }).catch(error => console.log("get user posts error: " + error));
    })
    .catch(error => console.log("get profile error: " + error));
};

async function sendMessageView(req,res){
  let currentUserId = req.params.userId;
  let userInfo;
  await userModel.getUserById(currentUserId)
  .then(([rows, field]) => {
    userInfo = rows;
  })
  .catch((error) => console.log("error: " + error));

  res.render('sendMessage',{userInfo: userInfo, sendMessageCSS: true});
}

async function sendMessage(req,res){
    let currentUserId = req.session.user.id;
    let subject = req.body.subject;
    let message = req.body.message; 
    let sendToUser = req.params.userId;
    


    let toUserInfo;
    await userModel.getUserById(sendToUser)
    .then(([rows, field]) => {
      toUserInfo = rows;
    })
    .catch((error) => console.log("error: " + error));

    await messageModel.addTopic(subject, message, currentUserId, sendToUser);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'knowledgebaseemailsender@gmail.com',
          pass: 'P@$$w0rd123'
        }
      });
      
    let mailOptions = {
        from: 'knowledgebaseemailsender@gmail.com',
        to: `${toUserInfo[0].email}`,
        subject: 'You got a new meesage',
        text: subject + "\n" + message
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    res.redirect(`/messages/list/${currentUserId}`);
}

module.exports = {
    getProfile : getProfile,
    likeUser : likeUser,
    sendMessageView : sendMessageView,
    sendMessage : sendMessage
};