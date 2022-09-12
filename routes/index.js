const express = require("express");
const router = express.Router();
const { auth } = require("../utils/jwt");
const accountController = require("../controllers/accountController");
const postController = require("../controllers/postController");
const tagController = require("../controllers/tagController");
const commentController = require("../controllers/commentController");
const emotionController = require("../controllers/emotionController");
const messageController = require("../controllers/messageController");
const fileController = require("../controllers/fileController");
const topicController = require("../controllers/topicController");

router.post("/member/createAccount", accountController.createAccountMember);
router.put("/member/confirmEmail", accountController.confirmEmail);
router.post("/member/resendMail", accountController.resendMail);
router.post("/member/loginMember", accountController.loginMember);
router.get("/member/myAccount",auth ,accountController.getAccount);
router.delete("/member/logoutMember",auth ,accountController.logoutMember);
router.get("/member/getAllAccount",auth ,accountController.getAllAccount);
router.get("/member/account/:account_id" ,accountController.getAccountByAccountId);
router.put("/member/updateAccountProfile",auth , accountController.updateAccountProfile);

router.post("/member/createPost",auth ,postController.createPost);
router.get("/member/getPost/:post_id", postController.getPost);
router.get("/member/getAllPost", postController.getAllPost);
router.get("/member/getAllMyPost",auth , postController.getAllMyPost);
router.put("/member/updatePost",auth , postController.updatePost);
router.delete("/member/deletePost/:post_id",auth , postController.deletePost);

router.post("/member/createTag", tagController.createTag);
router.get("/member/getAllTag", tagController.getAllTag);

router.post("/member/createComment",auth ,commentController.createComment);
router.put("/member/updateComment",auth ,commentController.updateComment);
router.delete("/member/deleteComment/:comment_id",auth , commentController.deleteComment);

router.put("/member/updateEmotion",auth ,emotionController.updateEmotion);

router.post("/member/createMessageConnect",auth ,messageController.createMessageConnect);
router.get("/member/getMessageConnect/:account_id_2",auth ,messageController.getMessageConnect);
router.get("/member/getAllMessageConnect",auth ,messageController.getAllMessageConnect);

router.post("/member/createMessage",auth ,messageController.createMessage);
router.put("/member/readMessage",auth ,messageController.readMessage);

router.post("/member/uploadFile",auth ,fileController.uploadFile);
router.get("/member/getFile/:file_id" ,fileController.getFile);

router.post("/member/createTopic", topicController.createTopic);
router.get("/member/getAllTopic", topicController.getAllTopic);

module.exports = router;
