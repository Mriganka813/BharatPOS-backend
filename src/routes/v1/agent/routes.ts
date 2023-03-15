import express from "express";
import * as cntlr from "./controller";
import { isAuthenticatedAgent } from "src/middleware/auth";
export const AgentRouter = express
  .Router()
  .post("/register", cntlr.registerAgent)
  .post("/login", cntlr.loginAgent)
  .get("/logout", cntlr.logoutAgent)
  .post("/getuser", isAuthenticatedAgent, cntlr.getUsers);
