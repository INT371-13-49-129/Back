const express = require("express");
const router = express.Router();
const { auth, checkLogin } = require("../utils/jwt");
const accountController = require("../controllers/accountController");
const postController = require("../controllers/postController");
const tagController = require("../controllers/tagController");
const commentController = require("../controllers/commentController");
const emotionController = require("../controllers/emotionController");
const messageController = require("../controllers/messageController");
const fileController = require("../controllers/fileController");
const topicController = require("../controllers/topicController");
const moodController = require("../controllers/moodController");
const moodDiaryController = require("../controllers/moodDiaryController");
const diaryController = require("../controllers/diaryController");

router.post("/member/createAccount", accountController.createAccountMember);
router.put("/member/confirmEmail", accountController.confirmEmail);
router.post("/member/resendMail", accountController.resendMail);
router.post("/member/loginMember", accountController.loginMember);
router.get("/member/myAccount",auth ,accountController.getAccount);
router.delete("/member/logoutMember",auth ,accountController.logoutMember);
router.get("/member/getAllAccount",auth ,accountController.getAllAccount);
router.get("/member/account/:account_id" ,accountController.getAccountByAccountId);
router.put("/member/updateAccountProfile",auth , accountController.updateAccountProfile);
router.put("/member/requestPsychologist",auth , accountController.requestPsychologist);

router.put("/member/approveRequestPsychologist", accountController.approveRequestPsychologist);

router.post("/member/createPost",auth ,postController.createPost);
router.post("/member/createPostArticle",auth ,postController.createPostArticle);
router.get("/member/getPost/:post_id",checkLogin , postController.getPost);
router.get("/member/getAllPost",checkLogin, postController.getAllPost);
router.get("/member/getAllPostAccountPage/:account_id",checkLogin , postController.getAllPostAccountPagination);
router.get("/member/getAllPostPage", checkLogin, postController.getAllPostPagination);
router.get("/member/getAllMyPostPage",auth , postController.getAllMyPostPagination);
router.get("/member/getAllMyPost",auth , postController.getAllMyPost);
router.get("/member/getAllRepost/:refer_post_id",checkLogin, postController.getAllRepost);
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
router.get("/member/getMessageConnectPage/:account_id_2",auth ,messageController.getMessageConnectPagination);
router.get("/member/getAllMessageConnect",auth ,messageController.getAllMessageConnect);

router.post("/member/createMessage",auth ,messageController.createMessage);
router.put("/member/readMessage",auth ,messageController.readMessage);

router.post("/member/uploadFile",auth ,fileController.uploadFile);
router.get("/member/getFile/:file_id" ,fileController.getFile);

router.post("/member/createTopic", topicController.createTopic);
router.get("/member/getAllTopic", topicController.getAllTopic);

router.post("/member/createMood", moodController.createMood);
router.get("/member/getAllMood", moodController.getAllMood);

router.post("/member/createMoodDiary",auth , moodDiaryController.createMoodDiary);
router.get("/member/getAllMoodDiary",auth , moodDiaryController.getAllMoodDiary);
router.get("/member/getMoodDiaryDate/:date",auth , moodDiaryController.getMoodDiaryDate);
router.get("/member/getMoodDiaryMonth/:date",auth , moodDiaryController.getMoodDiaryMonth);
router.get("/member/getMoodDiaryYear/:year",auth , moodDiaryController.getMoodDiaryYear);
router.put("/member/updateMoodDiary",auth , moodDiaryController.updateMoodDiary);

router.post("/member/createDiary",auth , diaryController.createDiary);
router.get("/member/getAllDiary",auth , diaryController.getAllDiary);
router.get("/member/getDiary/:diary_id",auth , diaryController.getDiary);
router.get("/member/getDiaryDate/:date",auth , diaryController.getDiaryDate);
router.get("/member/getDiaryMonth/:date",auth , diaryController.getDiaryMonth);
router.get("/member/getDiaryYear/:year",auth , diaryController.getDiaryYear);
router.put("/member/updateDiary",auth , diaryController.updateDiary);
router.delete("/member/deleteDiary/:diary_id",auth , diaryController.deleteDiary);

module.exports = router;
