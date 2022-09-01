const emotionService = require("../service/emotionService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.updateEmotion = async (req, res) => {
    const { account_id } = req.jwt
    const { post_id, comment_id, is_emotion } = req.body;
    try {
      if(post_id){
          const emotion = await emotionService.getEmotion({ account_id, post_id, is_delete: false })
          if(emotion){
            await emotionService.updateEmotionByEmotionId(emotion.emotion_id,{ is_emotion })
          } else {
            await emotionService.createEmotion({ account_id, post_id, is_emotion})
          }
      }
      if(comment_id){
        const emotion = await emotionService.getEmotion({ account_id, comment_id, is_delete: false })
        if(emotion){
          await emotionService.updateEmotionByEmotionId(emotion.emotion_id,{ is_emotion })
        } else {
          await emotionService.createEmotion({ account_id, comment_id, is_emotion})
        }
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