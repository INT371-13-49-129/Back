const tagService = require("../service/tagService");

exports.createTag = async (req, res) => {
    const { name, tag_type } = req.body;
    try {
      const tag = await tagService.createTag({ name, tag_type });
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

exports.getAllTag = async (req, res) => {
    try {
      const tags = await tagService.getAllTag();
      res.status(200).send({
        status: "success",
        tags
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "error",
        error: error,
      });
    }
};
