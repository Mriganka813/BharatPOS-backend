const express = require("express");
const {
  createAdmin,
  loginAdmin,
  logout,
  getAllUserDetails,
  getSingleUserDetail,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");
const { authorizeRoles, isAuthenticatedAdmin } = require("../middleware/auth");

const router = express.Router();

router.route("/admin/register").post(createAdmin);

router.route("/admin/login").post(loginAdmin);

router.route("/admin/logout").get(logout);

router
  .route("/admin/users/all")
  .get(isAuthenticatedAdmin, authorizeRoles("admin"), getAllUserDetails);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedAdmin, authorizeRoles("admin"), getSingleUserDetail)
  .put(isAuthenticatedAdmin, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedAdmin, authorizeRoles("admin"), deleteUser);

module.exports = router;
