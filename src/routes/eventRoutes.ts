import { Router } from "express";
import { EventController } from "../controllers/eventController"
import {validateEvent, validateInvitee} from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

export default function eventRouter(controller: EventController): Router {
    const router = Router();
    router.post("/create",authMiddleware,validateEvent,controller.createNewEvent.bind(controller))
    router.get("/all/:user_id", controller.getAllEvents.bind(controller))
    router.get("/events/:id", controller.getEventById.bind(controller))
    router.post('/:event_id/invite', authMiddleware, controller.createInvitee.bind(controller), validateInvitee);
    router.put("/:id", controller.updateEvent.bind(controller))
    router.delete("/:id", controller.deleteEvent.bind(controller))
    router.get("/:event_id",authMiddleware, controller.getGuestInsights.bind(controller));


    return router;

}