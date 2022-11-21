const accountService = require("../service/accountService");
const accountTopicService = require("../service/accountTopicService");
const logEditService = require("../service/logEditService");
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
    let user = await accountService.getAccountByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      if (user.status == "Waiting")
        return errorResponse(res, {
          statusResponse: 400,
          statusCode: statusCode(2006),
          errorMessage: `Waiting for email confirmation`,
        });
      const jwt = token({ account_id: user.account_id });
      user = await accountService.getAccountByAccountId(user.account_id);
      return res.status(200).send({
        jwt,
        account: {
          account_id: user.account_id,
          username: user.username,
          email: user.email,
          gender: user.gender,
          bio: user.bio,
          image_url: user.image_url,
          cover_image_url: user.cover_image_url,
          date_of_birth: user.date_of_birth,
          is_listener: user.is_listener,
          account_topics: user.account_topics,
          createdAt: user.createdAt,
          countPost: user.posts.filter((post) => post.post_type == "Post").length,
          countPostArticle: user.posts.filter((post) => post.post_type == "Article").length,
          name: user.name,
          role: user.role,
          account_follower: user.account_follower,
          follows: user.follows,
          account_reviewer: user.account_reviewer,
          avgRatings: user.account_reviewer.length > 0 ? user.account_reviewer.reduce((a, b) => a + b.rating_score, 0) / user.account_reviewer.length : 0,
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
        bio: user.bio,
        image_url: user.image_url,
        cover_image_url: user.cover_image_url,
        date_of_birth: user.date_of_birth,
        is_listener: user.is_listener,
        account_topics: user.account_topics,
        createdAt: user.createdAt,
        countPost: user.posts.filter((post) => post.post_type == "Post").length,
        countPostArticle: user.posts.filter((post) => post.post_type == "Article").length,
        name: user.name,
        role: user.role,
        account_follower: user.account_follower,
        follows: user.follows,
        account_reviewer: user.account_reviewer,
        avgRatings: user.account_reviewer.length > 0 ? user.account_reviewer.reduce((a, b) => a + b.rating_score, 0) / user.account_reviewer.length : 0,
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

exports.getAccountByAccountId = async (req, res) => {
  const { account_id } = req.params;
  try {
    const user = await accountService.getAccountByAccountId(account_id);
    return res.status(200).send({
      account: {
        account_id: user.account_id,
        username: user.username,
        gender: user.gender,
        bio: user.bio,
        image_url: user.image_url,
        cover_image_url: user.cover_image_url,
        is_listener: user.is_listener,
        account_topics: user.account_topics,
        createdAt: user.createdAt,
        countPost: user.posts.filter((post) => post.post_type == "Post").length,
        countPostArticle: user.posts.filter((post) => post.post_type == "Article").length,
        name: user.name,
        role: user.role,
        account_follower: user.account_follower,
        follows: user.follows,
        account_reviewer: user.account_reviewer,
        avgRatings: user.account_reviewer.length > 0 ? user.account_reviewer.reduce((a, b) => a + b.rating_score, 0) / user.account_reviewer.length : 0,
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

exports.getAllAccount = async (req, res) => {
  try {
    const accounts = await accountService.getAllAccount();
    return res.status(200).send({ accounts });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.updateAccountProfile = async (req, res) => {
  const { account_id } = req.jwt;
  const {
    username,
    name,
    gender,
    bio,
    date_of_birth,
    image_url,
    cover_image_url,
    is_listener,
    account_topics,
  } = req.body;
  try {
    const account = await accountService.getAccountByAccountId(account_id);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id}) Does not exist`,
      });
    let checkUsername = await accountService.getAccountByUsername(username);
    if (checkUsername && checkUsername.account_id != account_id) {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(2001),
        errorMessage: `Account Username(${username}) Already exists`,
      });
    }
    const account_update = {
      username,
      name,
      gender,
      bio,
      date_of_birth,
      image_url,
      cover_image_url,
      is_listener,
    };
    await accountService.updateAccount(account_id, account_update);
    for (let i = 0; i < account.account_topics.length; i++) {
      const { account_topic_id } = account.account_topics[i];
      if (
        !account_topics
          .map((at) => at.account_topic_id)
          .includes(account_topic_id)
      ) {
        await accountTopicService.updateAccountTopic(account_topic_id, {
          is_delete: true,
        });
      }
    }
    for (let i = 0; i < account_topics.length; i++) {
      const topic = account_topics[i];
      if (topic.account_topic_id) continue;
      await accountTopicService.createAccountTopic({
        topic_id: topic.topic_id,
        account_id,
      });
    }
    const log_data = {
      username: account.username,
      gender: account.gender,
      bio: account.bio,
      image_url: account.image_url,
      cover_image_url: account.cover_image_url,
      date_of_birth: account.date_of_birth,
      is_listener: account.is_listener,
      account_topics: account.account_topics,
      countPost: account.posts.filter((post) => post.post_type == "Post").length,
      countPostArticle: account.posts.filter((post) => post.post_type == "Article").length,
      name: account.name,
      role: account.role,
      account_follower: account.account_follower,
      follows: account.follows,
      account_reviewer: account.account_reviewer,
      avgRatings: account.account_reviewer.length > 0 ? account.account_reviewer.reduce((a, b) => a + b.rating_score, 0) / account.account_reviewer.length : 0,
    };
    await logEditService.createLogEdit({ account_id, log_data });
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

exports.requestPsychologist = async (req, res) => {
  const { account_id } = req.jwt;
  const { file_approve, name } = req.body;
  try {
    const account = await accountService.getAccountByAccountId(account_id);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id}) Does not exist`,
      });
    const account_update = {
      file_approve,
      name,
      approve: "Waiting",
    };
    await accountService.updateAccount(account_id, account_update);
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

exports.approveRequestPsychologist = async (req, res) => {
  const { account_id } = req.body;
  try {
    const account = await accountService.getAccountByAccountId(account_id);
    if (!account)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(2003),
        errorMessage: `Account Id(${account_id}) Does not exist`,
      });
    const account_update = {
      approve: "Approve",
      role: "Psychologist",
    };
    await accountService.updateAccount(account_id, account_update);
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
