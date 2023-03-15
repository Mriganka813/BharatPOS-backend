import { Router } from "express";
import { AdminRouter } from "./v1/admin/routes";
import { AgentRouter } from "./v1/agent/routes";

export const V1Router = Router()
  .use("/admin", AdminRouter)
  .use("/agent", AgentRouter);
// app.use("/api/v1", product);
// app.use("/api/v1", user);
// app.use("/api/v1", admin);
// app.use("/api/v1", party);
// app.use("/api/v1", income);
// app.use("/api/v1", sales);
// app.use("/api/v1", purchase);
// app.use("/api/v1", expense);
// app.use("/api/v1", report);
// app.use("/api/v1/agent", agent);
// app.use("/api/v1/consumer", consumer);
// app.use("/api/v1/payment", payment);
