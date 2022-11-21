const followService = require("../service/followService.js");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createFollow = async (req, res) => {
  const { account_id } = req.jwt;
  const { follow_account_id } = req.body;
  try {
    const follow = await followService.getFollowByAccountIdAndAccountIdFollower(
      { account_id: follow_account_id, account_id_follower: account_id }
    );
    if (follow && follow.is_delete) {
      await followService.updateFollow(follow.follow_id, { is_delete: false });
    }
    if (!follow) {
      await followService.createFollow({
        account_id: follow_account_id,
        account_id_follower: account_id,
      });
    }
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

exports.deleteFollow = async (req, res) => {
  const { account_id } = req.jwt;
  const { follow_account_id } = req.params;
  try {
    const follow = await followService.getFollowByAccountIdAndAccountIdFollower(
      {
        account_id: follow_account_id,
        account_id_follower: account_id,
        is_delete: false,
      }
    );
    if (!follow)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(8001),
        errorMessage: `Follow Account Id(${follow_account_id}) Does not exist`,
      });
    await followService.updateFollow(follow.follow_id, { is_delete: true });
    return res.status(200).send({ status: "success" });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};

exports.getFollowByAccountId = async (req, res) => {
  const { account_id } = req.params;
  try {
    const account_follower = await followService.getFollowByAccountId(
      account_id
    );
    const follows = await followService.getFollowByAccountIdFollower(
      account_id
    );
    return res
      .status(200)
      .send({ status: "success", account_follower, follows });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};
