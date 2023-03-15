import express from "express";
import * as cntlr from "./controller";
import { authorizeRoles, isAuthenticatedAdmin } from "src/middleware/auth";

export const AdminRouter = express
  .Router()
  .post("/admin/register", cntlr.createAdmin)
  .post("/admin/login", cntlr.loginAdmin)
  .get("/admin/logout", cntlr.logout)
  .post("/admin/users/all", isAuthenticatedAdmin, cntlr.getAllUserDetailsAdmin)
  .get(
    "/admin/user/:id",
    isAuthenticatedAdmin,
    authorizeRoles("admin"),
    cntlr.getSingleUserDetail
  )
  .put(
    "/admin/user/:id",
    isAuthenticatedAdmin,
    authorizeRoles("admin"),
    cntlr.updateUserRole
  )
  .post("/admin/del/user", isAuthenticatedAdmin, cntlr.deleteUser)
  .post("/admin/report", isAuthenticatedAdmin, cntlr.getReportofUserAdmin);
