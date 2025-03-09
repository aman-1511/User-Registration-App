const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  getGenderOptions,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");


router.use((req, res, next) => {
  console.log(`User route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

router.use(protect);


router.get("/", getAllUsers);


router.get("/gender-options", getGenderOptions);

router.post("/", createUser);


router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
