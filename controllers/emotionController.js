const emotionService = require("../service/emotionService");

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
      res.status(400).send({
        status: "error",
        error: error,
      });
    }
};