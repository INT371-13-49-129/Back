const express = require("express");
const router = express.Router();
const { auth } = require("../utils/jwt");
const accountController = require("../controllers/accountController");
const postController = require("../controllers/postController");
const tagController = require("../controllers/tagController");
const commentController = require("../controllers/commentController");
const emotionController = require("../controllers/emotionController");

router.post("/member/createAccount", accountController.createAccountMember);
router.put("/member/confirmEmail", accountController.confirmEmail);
router.post("/member/resendMail", accountController.resendMail);
router.post("/member/loginMember", accountController.loginMember);
router.get("/member/myAccount",auth ,accountController.getAccount);
router.delete("/member/logoutMember",auth ,accountController.logoutMember);

router.post("/member/createPost",auth ,postController.createPost);
router.get("/member/getPost/:post_id", postController.getPost);
router.get("/member/getAllPost", postController.getAllPost);

router.post("/member/createTag", tagController.createTag);
router.get("/member/getAllTag", tagController.getAllTag);

router.post("/member/createComment",auth ,commentController.createComment);

router.put("/member/updateEmotion",auth ,emotionController.updateEmotion);

module.exports = router;
