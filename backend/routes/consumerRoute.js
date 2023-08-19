const express = require("express");
const {
  getAllUserDetails,
  getSingleUserDetail,
  registerConsumer,
  loginConsumer,
  consumerLogout,
  getContactNumber,
  getSellersAndSearch,
  getSellers,
  getProductsOfUser,
  getSellersByName,
  getProductNamesandSearch,
  addClickProduct,
  addClickSeller,
  getTopClickedProducts,
  getTopClickedSellers,
  addToCart,
  removeItem,
  showCart,
  placeOrder,
  recentOrders,
  viewShop,
  addAddress,
  deleteAccountPage,
  rating,
  policyPage,
  searchProductsBySeller, // New import
} = require("../controllers/consumerController");
const { isAuthenticatedConsumer } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerConsumer);
router.route("/login").post(loginConsumer);
router.route("/logout").get(consumerLogout);
router.route("/detail/:id").get(isAuthenticatedConsumer, getConsumerDetails);
router.route("/upd/:id").put(isAuthenticatedConsumer, updateConsumerDetails);
router.route("/sellers/all").get(isAuthenticatedConsumer, getAllUserDetails);
router.route("/seller/:id").get(isAuthenticatedConsumer, getSingleUserDetail);
router.route("/product/:id").get(isAuthenticatedConsumer, getInventoryDetails);
router.route("/products/all").get(isAuthenticatedConsumer, getAllInventorieswithSearch);
router.route("/sellercontact/:id").get(isAuthenticatedConsumer, getContactNumber);
router.route("/getSellersAndSearch").get(isAuthenticatedConsumer, getSellersAndSearch);
router.route("/sellers").get(isAuthenticatedConsumer, getSellers);
router.route("/sellerProduct/:id").get(isAuthenticatedConsumer, getProductsOfUser);
router.route("/sellers/search").get(isAuthenticatedConsumer, getSellersByName);
router.route("/productname/search").get(isAuthenticatedConsumer, getProductNamesandSearch);
router.route("/product/click/:id").get(isAuthenticatedConsumer, addClickProduct);
router.route("/seller/click/:id").get(isAuthenticatedConsumer, addClickSeller);
router.route("/products/popular").get(isAuthenticatedConsumer, getTopClickedProducts);
router.route("/popular/seller").get(isAuthenticatedConsumer, getTopClickedSellers);
router.route("/cart/add/product/:productId").post(isAuthenticatedConsumer, addToCart);
router.route("/cart/delete/:productId").get(isAuthenticatedConsumer, removeItem);
router.route("/showcart").get(isAuthenticatedConsumer, showCart);
router.route("/search/location").post(searchLocation);
router.route("/search/location/viewall/:location").get(viewAll);
router.route("/search/product/:location").post(searchProduct);
router.route("/category/:productCategory/location/:location").get(filterProduct);
router.route("/view/viewshop/:shopId").get(viewShop);
router.route("/order/placeorder").post(isAuthenticatedConsumer, placeOrder);
router.route("/orders/history").get(isAuthenticatedConsumer, recentOrders);
router.route("/add/address").post(isAuthenticatedConsumer, addAddress);
router.route("/delete").get(deleteAccountPage);
router.route("/rate/:productId").post(isAuthenticatedConsumer, rating);
router.route("/policy").get(policyPage);

// New route for searching products by a specific seller with pagination
router.route("/search/seller/:sellerId")
  .get(isAuthenticatedConsumer, searchProductsBySeller);

module.exports = router;

