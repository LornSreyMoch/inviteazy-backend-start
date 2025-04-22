// guestInRoutes.ts
import { GuestInsightController } from "../controllers/guestInsightController";
import { Router } from "express";
import { authMiddleware } from '../middlewares/authMiddleware';


export default function guestInRoutes(controller: GuestInsightController): Router {
    const router = Router();

    router.get("/:event_id",authMiddleware, controller.getGuestInsights.bind(controller));

    return router;
}
