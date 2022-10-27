const diaryService = require("../service/diaryService");
const { statusCode, errorResponse } = require("../utils/errorResponse");

exports.createDiary = async (req, res) => {
  const { account_id } = req.jwt;
  const { title, text, date } = req.body;
  try {
    const diary = await diaryService.createDiary({
      title,
      text,
      date,
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

exports.getAllDiary = async (req, res) => {
  const { account_id } = req.jwt;
  try {
    const diary = await diaryService.getAllDiary(account_id);
    res.status(200).send({
      status: "success",
      diary,
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

exports.getDiary = async (req, res) => {
  const { account_id } = req.jwt;
  const { diary_id } = req.params;
  try {
    const diary = await diaryService.getDiaryByDiaryId(diary_id);
    if (!diary)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(6001),
        errorMessage: `Diary Id(${diary_id}) Does not exist`,
      });
    if (diary.account_id != account_id)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to get Diary Id(${diary_id})`,
      });
    res.status(200).send({
      status: "success",
      diary,
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

exports.getDiaryDate = async (req, res) => {
  const { account_id } = req.jwt;
  const { date } = req.params;
  try {
    const diary = await diaryService.getDiaryDate(account_id, date);
    res.status(200).send({
      status: "success",
      diary,
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

exports.getDiaryMonth = async (req, res) => {
  const { account_id } = req.jwt;
  const { date } = req.params;
  try {
    const ym = date.split("-");
    const diary = await diaryService.getDiaryMonth(account_id, {
      year: ym[0],
      month: ym[1],
    });
    res.status(200).send({
      status: "success",
      diary,
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

exports.getDiaryYear = async (req, res) => {
  const { account_id } = req.jwt;
  const { year } = req.params;
  try {
    const diary = await diaryService.getDiaryYear(account_id, year);
    res.status(200).send({
      status: "success",
      diary,
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

exports.updateDiary = async (req, res) => {
  const { account_id } = req.jwt;
  const { diary_id, title, text } = req.body;
  try {
    const diary = await diaryService.getDiaryByDiaryId(diary_id);
    if (!diary)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(6001),
        errorMessage: `Diary Id(${diary_id}) Does not exist`,
      });
    if (diary.account_id != account_id)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to edit Diary Id(${diary_id})`,
      });
    await diaryService.updateDiary(diary_id, { title, text });
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

exports.deleteDiary = async (req, res) => {
  const { account_id } = req.jwt;
  const { diary_id } = req.params;
  try {
    const diary = await diaryService.getDiaryByDiaryId(diary_id);
    if (!diary)
      return errorResponse(res, {
        statusResponse: 404,
        statusCode: statusCode(6001),
        errorMessage: `Diary Id(${diary_id}) Does not exist`,
      });
    if (diary.account_id != account_id)
      return errorResponse(res, {
        statusResponse: 401,
        statusCode: statusCode(2007),
        errorMessage: `Account Id(${account_id}) don't have permission to delete Diary Id(${diary_id})`,
      });
    await diaryService.updateDiary(diary_id, { is_delete: true });
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
