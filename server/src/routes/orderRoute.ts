import { Router } from "express";

import { validateRequest } from "../middlewares/validateRequest";
import { protect } from "../middlewares/authMiddleware";
import {
  confirmSessionIdValidator,
  orderCreateValidator,
} from "../validators/orderValidator";
import {
  confirmSessionId,
  createOrderAndCheckOutSession,
} from "../controllers/order.controller";

const router = Router();

router.post(
  "/create-order",
  protect,
  orderCreateValidator,
  validateRequest,
  createOrderAndCheckOutSession,
);
router.get(
  "/confirm-order/:session_id",
  protect,
  confirmSessionIdValidator,
  validateRequest,
  confirmSessionId,
);

export default router;
