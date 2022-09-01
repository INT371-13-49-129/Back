const accountService = require("../service/accountService");
const jsonWebTokenService = require("../service/jsonWebTokenService");
const bcrypt = require("bcryptjs");
const { token, verify, confirmEmailToken } = require("../utils/jwt");
const { sendMail } = require("../utils/nodemailer");
const { statusCode, errorResponse } = require("../utils/errorResponse");
const salt = bcrypt.genSaltSync(10);
const FormData = require("form-data");
const axios = require("axios");
const config = require("../config/config");

exports.createAccountMember = async (req, res) => {
  const { email, username, password, gender, date_of_birth } = req.body;
  const hash = bcrypt.hashSync(password, salt);
  try {
    let checkUsername = await accountService.getAccountByUsername(username);
    if (checkUsername)
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2001),
        errorMessage: `Account Username(${username}) Already exists`,
      });
    let checkEmail = await accountService.getAccountByEmail(email);
    if (checkEmail)
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2002),
        errorMessage: `Account Email(${email}) Already exists`,
      });
    const account = await accountService.createAccount({
      email,
      username,
      gender,
      date_of_birth: new Date(date_of_birth),
      password: hash,
    });
    const jwt = confirmEmailToken({
      account_id: account.account_id,
      email: account.email,
    });
    await sendMail({ username: account.username, email: account.email, jwt });
    await jsonWebTokenService.createJsonWebToken({
      token_type: "ConfirmEmail",
      token: jwt,
      account_id: account.account_id,
    });
    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.confirmEmail = async (req, res) => {
  const { confirm_email_token } = req.body;
  try {
    const decoded = await verify(res, confirm_email_token);
    if (!decoded) return;
    const { account_id, email } = decoded;
    const account = await accountService.getAccountByAccountId(account_id);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id}) Does not exist`,
      });
    const jwt =
      await jsonWebTokenService.getJsonWebTokenByTokenAndTokenTypeAndAccountId({
        token: confirm_email_token,
        token_type: "ConfirmEmail",
        account_id: account.account_id,
      });
    if (!jwt)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(1001),
        errorMessage: `Invalid token`,
      });
    if (account.status !== "Waiting")
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2004),
        errorMessage: `Account Status is incorrect`,
      });
    if (account.email == email) {
      await accountService.updateAccount(account_id, { status: "Confirmed" });
      await jsonWebTokenService.updateJsonWebToken(jwt.json_web_token_id, {
        is_delete: true,
      });
      res.status(200).send({
        status: "success",
      });
    } else {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(1002),
        errorMessage: `Confirm Email Token is incorrect`,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.resendMail = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await accountService.getAccountByEmail(email);
    if (user.status !== "Waiting")
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2004),
        errorMessage: `Account Status is incorrect`,
      });
    await jsonWebTokenService.updateJsonWebTokenByTokenTypeAndAccountId(
      { token_type: "ConfirmEmail", account_id: user.account_id },
      { is_delete: true }
    );
    const jwt = confirmEmailToken({
      account_id: user.account_id,
      email: user.email,
    });
    await sendMail({ username: user.username, email: user.email, jwt });
    await jsonWebTokenService.createJsonWebToken({
      token_type: "ConfirmEmail",
      token: jwt,
      account_id: user.account_id,
    });
    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.loginMember = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await accountService.getAccountByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      if (user.status == "Waiting")
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2006),
        errorMessage: `Waiting for email confirmation`,
      });
      const jwt = token({ account_id: user.account_id });
      return res.status(200).send({
        jwt,
        account: {
          account_id: user.account_id,
          username: user.username,
          email: user.email,
          gender: user.gender,
          image_url: user.image_url,
          date_of_birth: user.date_of_birth,
        },
      });
    } else {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2005),
        errorMessage: `Email or password is incorrect`,
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.getAccount = async (req, res) => {
  const { account_id } = req.jwt;
  try {
    const user = await accountService.getAccountByAccountId(account_id);
    return res.status(200).send({
      account: {
        account_id: user.account_id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        image_url: user.image_url,
        date_of_birth: user.date_of_birth,
      },
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.logoutMember = async (req, res) => {
  const token = req.token;
  const { account_id } = req.jwt;
  try {
    await jsonWebTokenService.createJsonWebToken({
      token_type: "Logout",
      token,
      account_id,
    });
    res.status(200).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};
