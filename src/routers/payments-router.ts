import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayments } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayments);

export { paymentsRouter };
