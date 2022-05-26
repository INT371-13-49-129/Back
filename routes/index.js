const express = require("express");
const router = express.Router();
const { auth } = require("../utils/jwt");
const accountController = require("../controllers/accountController");

router.post("/member/createAccount", accountController.createAccountMember);
router.put("/member/confirmEmail", accountController.confirmEmail);
router.post("/member/resendMail", accountController.resendMail);
router.post("/member/loginMember", accountController.loginMember);
router.get("/member/myAccount",auth ,accountController.getAccount);
router.delete("/member/logoutMember",auth ,accountController.logoutMember);

module.exports = router;
