const express = require("express");

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  getAllInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryDetails,
  getAllInventoriesAndSearch,
  getInventoryForUser,
  findInventoryByBarcode,
  bulkUpload
} = require("../controllers/inventoryController");
const { isAuthenticatedUser, isSubscribed } = require("../middleware/auth");

const router = express.Router();


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '../uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + ext);
//   }
// });

// // Set up the multer middleware
// const upload = multer({ storage: storage });

router
  .route("/inventory/barcode/:code")
  .get(isAuthenticatedUser, findInventoryByBarcode);

router
  .route("/inventories")
  .get(isAuthenticatedUser, getAllInventoriesAndSearch);

router.route("/inventories/all").get(isAuthenticatedUser, getAllInventories);

router.route("/inventory/new").post(isAuthenticatedUser ,createInventory);

// router.route("/inventory/bulk").post(upload.single('excelFile'),bulkUpload)
// /inventory/me/?page=1&limit=20
router.route("/inventory/me").get(isAuthenticatedUser, getInventoryForUser);

router.route("/update/inventory/:id").put(isAuthenticatedUser, updateInventory);

router.route("/del/inventory/:id").delete(isAuthenticatedUser, deleteInventory);

router.route("/inventory/:id").get(isAuthenticatedUser, getInventoryDetails);

module.exports = router;
