const accountService = require("../service/accountService");
const jsonWebTokenService = require("../service/jsonWebTokenService");
const bcrypt = require('bcryptjs');
const { token,verify,confirmEmailToken } = require("../utils/jwt");
const { sendMail } = require("../utils/nodemailer");
const salt = bcrypt.genSaltSync(10);
const FormData = require("form-data");
const axios = require("axios");
const config = require("../config/config");


exports.createAccountMember = async (req, res) => {
    const { email, username, password, gender, date_of_birth  } = req.body;
    const hash = bcrypt.hashSync(password, salt);
    try {
      let checkUsername = await accountService.getAccountByUsername(username)
      if (checkUsername) return res.status(400).send({ status: "error", error: "Username Already exists" })
      let checkEmail = await accountService.getAccountByEmail(email)
      if (checkEmail) return res.status(400).send({ status: "error", error: "Email Already exists" })
      const account = await accountService.createAccount({ 
          email,
          username,
          gender,
          date_of_birth:new Date(date_of_birth),
          password:hash,
         });
      const jwt = confirmEmailToken({account_id:account.account_id,email:account.email})
      await sendMail({ username:account.username,email:account.email,jwt })
      await jsonWebTokenService.createJsonWebToken({token_type:"ConfirmEmail", token:jwt, account_id:account.account_id})
      res.status(200).send({
        status: "success"
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "error",
        error: error,
      });
    }
};

exports.confirmEmail = async (req,res)=>{
  const { confirm_email_token } = req.body
  try {
    const decoded = await verify(res,confirm_email_token)
    if(!decoded) return;
    const { account_id,email } = decoded
    const  account = await accountService.getAccountByAccountId(account_id)
    if (!account) return res.status(400).send({ status: "error", error: "Does not exist" });
    const jwt = await jsonWebTokenService.getJsonWebTokenByTokenAndTokenTypeAndAccountId({ token:confirm_email_token, token_type:"ConfirmEmail", account_id:account.account_id })
    if(!jwt) return res.status(401).send({ status: "error", error: "Invalid token" });
    if (account.status !== 'Waiting') return res.status(400).send({ status: "error", error: "Account Status is incorrect!" });
    if(account.email == email){
      await accountService.updateAccount(account_id,{ status:"Confirmed" })
      await jsonWebTokenService.updateJsonWebToken(jwt.json_web_token_id,{ is_delete:true })
      res.status(200).send({
          status: "success",
      });
    }else{
      return res.status(400).json({error:"Confirm Email Token is incorrect!"})
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      error: error,
    });
  } 
}

exports.resendMail = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await accountService.getAccountByEmail(email)
    if (user.status !== 'Waiting') return res.status(400).send({ status: "error", error: "Account Status is incorrect!" })
    await jsonWebTokenService.updateJsonWebTokenByTokenTypeAndAccountId({ token_type:"ConfirmEmail", account_id:user.account_id },{ is_delete:true })
    const jwt = confirmEmailToken({account_id:user.account_id,email:user.email})
    await sendMail({ username:user.username,email:user.email,jwt })
    await jsonWebTokenService.createJsonWebToken({token_type:"ConfirmEmail", token:jwt, account_id:user.account_id})
    res.status(200).send({
      status: "success"
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      error: error,
    });
  }
};

exports.loginMember= async (req,res)=>{
    const {email,password} = req.body
    try {
      const user = await accountService.getAccountByEmail(email)
      if(user && bcrypt.compareSync(password, user.password)){
        if (user.status == 'Waiting') return res.status(400).send({ status: "error", error: "Waiting for email confirmation." })
        const jwt = token({account_id:user.account_id})
        return res.status(200).send(
          {jwt,account:{
            account_id:user.account_id,
            username:user.username,
            email:user.email,
            gender:user.gender,
            image_url:user.image_url,
            date_of_birth:user.date_of_birth
      }})
      }else{
        return res.status(400).json({error:"Email or password is incorrect!"})
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "error",
        error: error,
      });
    } 
}

exports.getAccount = async (req,res)=>{
  const { account_id } = req.jwt
  try {
    const user = await accountService.getAccountByAccountId( account_id )
      return res.status(200).send({
          account:{
              account_id:user.account_id,
              username:user.username,
              email:user.email,
              gender:user.gender,
              image_url:user.image_url,
              date_of_birth:user.date_of_birth
          }
      })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      error: error,
    });
  } 
}

exports.logoutMember= async (req,res)=>{
  const token = req.token
  const { account_id } = req.jwt
  try {
    await jsonWebTokenService.createJsonWebToken({token_type:"Logout", token, account_id })
    res.status(200).send({
      status: "success"
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      error: error,
    });
  } 
}