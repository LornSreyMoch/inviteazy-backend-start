import { NextFunction, Request, Response } from "express";
import { IEventService } from "../interfaces/eventInterface";
import { IInviteeService, IInviteeWithoutId } from "../interfaces/InviteesInterface";
import redisCache from "../services/cacheService"

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}
export class EventController {
    private eventService: IEventService;
    private inviteeService: IInviteeService


    constructor(eventService: IEventService, inviteeService: IInviteeService) {
        this.eventService = eventService;
        this.inviteeService = inviteeService
    }
    async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {

            const cacheKey = `data:${req.method}:${req.originalUrl}`;
            const cacheData = await redisCache.get(cacheKey);
            if (cacheData) {
                res.json({
                    message: "Cache: Get all event by userId",
                    data: JSON.parse(cacheData),
                });
                return;
            }
            const { user_id } = req.params;
            const events = await this.eventService.findAll(user_id);
            await redisCache.set(cacheKey, JSON.stringify(events), 360);


            res.status(200).json({ status: "success", data: events });

            // res.status(200).json({message: "Okay"})
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
            next(error);
        }

    }
    async createNewEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user?.id;
            console.log("don't have user", user)

            const { name, description, datetime, location } = req.body;
            const newEvent = await this.eventService.create({ user_id: user, event_name: name, event_datetime: datetime, event_location: location, event_description: description });
            res.status(201).json({ message: "Created new Event successfully", newEvent });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
            next(error);
        }
    }
    async getEventById(req: Request, res: Response, next: NextFunction) {
        try {

            const cacheKey = `data:${req.method}:${req.originalUrl}`;
            const cacheData = await redisCache.get(cacheKey);
            if (cacheData) {
                res.json({
                    message: "Cache: Get event by Id",
                    data: JSON.parse(cacheData),
                });
                return;
            }
            const id = req.params.id;
            const event = await this.eventService.findById(id);
             await redisCache.set(cacheKey, JSON.stringify(event), 360);
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json({ status: "success", data: event });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
            next(error);
        }

    }
    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const { user, name, description, datetime, location } = req.body;
            const updatedEvent = await this.eventService.update(id, { user_id: user, event_name: name, event_datetime: datetime, event_location: location, event_description: description });
            res.status(200).json({ message: "Updated Event successfully", updatedEvent });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
            next(error);
        }
    }
    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            await this.eventService.delete(id);
            res.status(200).json({ message: "Event deleted successfully" });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
            next(error);
        }
    }

    async getGuestInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const event_id = req.params.event_id;
            const insights = await this.inviteeService.findByEventId(event_id);

            const statusCounts = {
                totalInvited: insights.length,
                confirmed: 0,
                attended: 0,
                pending: 0,
                totalContribution: 0
            };

            for (const invitee of insights) {
                switch (invitee.status) {
                    case "accept":
                        statusCounts.confirmed++;
                        break;
                    case "pending":
                        statusCounts.pending++;
                        break;
                    default:
                        statusCounts.pending++;
                }

                if (invitee.is_checked_in) {
                    statusCounts.attended++;
                }
            }

            res.status(200).json({ data: statusCounts });

        } catch (error) {
            console.error("Error fetching guest insights:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async createInvitee(req: Request, res: Response, next: NextFunction) {
        try {
            const { event_id } = req.params;
            const invitee: IInviteeWithoutId = req.body;
            const newInvitee = await this.inviteeService.create({ ...invitee, event_id });
            res.status(201).json({ message: "New invitee created", data: newInvitee });
        } catch (error) {
            next(error);
        }
    }
}
export default EventController;

