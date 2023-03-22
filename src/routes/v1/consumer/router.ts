import express from "express";
import * as admin_cntlr from "../admin/controller";
import * as cntlr from "./controller";
import {
  getAllInventoriesAndSearch,
  getInventoryDetails,
  getAllInventorieswithSearch,
} from "../controllers/inventoryController";
import { isAuthenticatedConsumer } from "../middleware/auth";

const router = express.Router();

router.route("/register").post(cntlr.registerConsumer);

router.route("/login").post(cntlr.loginConsumer);

router.route("/logout").get(cntlr.consumerLogout);

router
  .route("/detail/:id")
  .get(isAuthenticatedConsumer, cntlr.getConsumerDetails);

router
  .route("/upd/:id")
  .put(isAuthenticatedConsumer, cntlr.updateConsumerDetails);

router
  .route("/sellers/all")
  .get(isAuthenticatedConsumer, admin_cntlr.getAllUserDetails);

router
  .route("/seller/:id")
  .get(isAuthenticatedConsumer, admin_cntlr.getSingleUserDetail);

router.route("/product/:id").get(isAuthenticatedConsumer, getInventoryDetails);

router
  .route("/products/all")
  .get(isAuthenticatedConsumer, getAllInventorieswithSearch);

router
  .route("/sellercontact/:id")
  .get(isAuthenticatedConsumer, cntlr.getContactNumber);

router
  .route("/getSellersAndSearch")
  .get(isAuthenticatedConsumer, cntlr.getSellersAndSearch);

router.route("/sellers").get(isAuthenticatedConsumer, cntlr.getSellers);

router
  .route("/sellerProduct/:id")
  .get(isAuthenticatedConsumer, cntlr.getProductsOfUser);

router
  .route("/sellers/search")
  .get(isAuthenticatedConsumer, cntlr.getSellersByName);

router
  .route("/productname/search")
  .get(isAuthenticatedConsumer, cntlr.getProductNamesandSearch);

router
  .route("/product/click/:id")
  .get(isAuthenticatedConsumer, cntlr.addClickProduct);

router
  .route("/seller/click/:id")
  .get(isAuthenticatedConsumer, cntlr.addClickSeller);

router
  .route("/products/popular")
  .get(isAuthenticatedConsumer, cntlr.getTopClickedProducts);

router
  .route("/popular/seller")
  .get(isAuthenticatedConsumer, cntlr.getTopClickedSellers);

router
  .route("/popular/seller")
  .get(isAuthenticatedConsumer, cntlr.getTopClickedSellers);

module.exports = router;
