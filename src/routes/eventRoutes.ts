import { Router } from "express";
import { EventController } from "../controllers/eventController"
import {validateEvent} from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export default function eventRouter(controller: EventController): Router {
    const router = Router();
    router.post("/create",authMiddleware,validateEvent,controller.createNewEvent.bind(controller))
    router.get("/all", controller.getAllEvents.bind(controller))
    router.get("/:id", controller.getEventById.bind(controller))
    router.put("/:id", controller.updateEvent.bind(controller))
    router.delete("/:id", controller.deleteEvent.bind(controller))

    return router;

}