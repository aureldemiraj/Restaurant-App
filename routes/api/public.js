const MenuModel = require("../../models/MenuModel");
const router = require("express").Router();

router.post("/product/search", (req, res) => {
  const ids = req.body;
  MenuModel.find()
    .where("_id")
    .in(ids)
    .exec((err, records) => {
      console.log(records);

      return res.json(records);
    });
});

module.exports = router;
