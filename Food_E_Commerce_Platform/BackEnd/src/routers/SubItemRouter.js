const express = require("express");
const SubItemController = require("../controllers/SubItemController");

const router = express.Router();

router.get("/search", SubItemController.searchSubItems);
router.get("/:categoryId", SubItemController.getSubItemsByCategory);
router.patch("/increment/:id", SubItemController.incrementSubItemViewCount);


module.exports = router;
