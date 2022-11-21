const ratingService = require("../service/ratingService.js");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createRating = async (req, res) => {
  const { account_id } = req.jwt;
  const { rating_account_id, rating_score, review } = req.body
  try {
    if (rating_score < 1 || rating_score > 5) {
      return errorResponse(res, {
        statusResponse: 400,
        statusCode: statusCode(9001),
        errorMessage: "Rating score should be between 1 and 5",
      });
    }
    const rating = await ratingService.getRatingByAccountIdAndAccountIdReviewer(
      {
        account_id: rating_account_id,
        account_id_reviewer: account_id,
      }
    );
    if (rating) {
      await ratingService.updateRating(rating.rating_id, {
        rating_score,
        review,
      });
    }
    if (!rating) {
      await ratingService.createRating({
        account_id: rating_account_id,
        account_id_reviewer: account_id,
        rating_score,
        review,
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

exports.getRatingByAccountId = async (req, res) =>{
  const { account_id } = req.params;
  try {
    const rating = await ratingService.getRatingByAccountId(account_id);
    res.status(200).send({
      status: "success",
      rating
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
}