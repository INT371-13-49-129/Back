const moodDiaryService = require("../service/moodDiaryService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createMoodDiary = async (req, res) => {
  const { account_id } = req.jwt;
  const { date, mood_id } = req.body;
  try {
    const mood_diary = await moodDiaryService.createMoodDiary({
      date,
      mood_id,
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

exports.getAllMoodDiary = async (req, res) => {
  const { account_id } = req.jwt;
  try {
    const mood_diary = await moodDiaryService.getAllMoodDiary(account_id);
    res.status(200).send({
      status: "success",
      mood_diary,
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

exports.getMoodDiaryDate = async (req, res) => {
  const { account_id } = req.jwt;
  const { date } = req.params;
  try {
    const mood_diary = await moodDiaryService.getMoodDiaryDate(
      account_id,
      date
    );
    res.status(200).send({
      status: "success",
      mood_diary,
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

exports.getMoodDiaryMonth = async (req, res) => {
  const { account_id } = req.jwt;
  const { date } = req.params;
  try {
    const ym = date.split("-");
    const mood_diary = await moodDiaryService.getMoodDiaryMonth(account_id, {
      year: ym[0],
      month: ym[1],
    });
    res.status(200).send({
      status: "success",
      mood_diary,
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

exports.getMoodDiaryYear = async (req, res) => {
  const { account_id } = req.jwt;
  const { year } = req.params;
  try {
    const mood_diary = await moodDiaryService.getMoodDiaryYear(
      account_id,
      year
    );
    res.status(200).send({
      status: "success",
      mood_diary,
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

exports.updateMoodDiaryByMoodDiaryId = async (req, res) => {
  const { account_id } = req.jwt;
  const { mood_diary_id, mood_id } = req.body;
  try {
    const mood_diary = await moodDiaryService.getMoodDiaryByMoodDiaryId(
      mood_diary_id
    );
    if (!mood_diary)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(7001),
        errorMessage: `Mood Diary Id(${mood_diary_id}) Does not exist`,
      });
    if (mood_diary.account_id != account_id)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to edit Mood Diary Id(${mood_diary_id})`,
      });
    await moodDiaryService.updateMoodDiary(mood_diary_id, { mood_id });
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

exports.updateMoodDiary = async (req, res) => {
  const { account_id } = req.jwt;
  const { date, mood_id } = req.body;
  try {
    const mood_diary = await moodDiaryService.getMoodDiaryDate(
      account_id,
      date
    );
    if (!mood_diary) {
      await moodDiaryService.createMoodDiary({
        date,
        mood_id,
        account_id,
      });
    } else {
      await moodDiaryService.updateMoodDiary(mood_diary.mood_diary_id, { mood_id });
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
