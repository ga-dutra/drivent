import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayments, postPayment } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayments)
  .post("/process", postPayment);

export { paymentsRouter };
