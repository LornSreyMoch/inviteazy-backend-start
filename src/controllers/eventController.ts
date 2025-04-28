import { NextFunction, Request, Response } from "express";
import { IEventService } from "../interfaces/eventInterface";
import { IInviteeService, IInviteeWithoutId } from "../interfaces/InviteesInterface";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export class EventController {
    private eventService: IEventService;
    private inviteeService: IInviteeService;

    constructor(eventService: IEventService, inviteeService: IInviteeService) {
        this.eventService = eventService;
        this.inviteeService = inviteeService;
    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const events = await this.eventService.findAll(user_id);
            res.status(200).json({ status: "success", data: events });
        } catch (error) {
            console.error("Error fetching events:", error);
            next(error);
        }
    }

    async createNewEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user?.id;
            if (!user) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            const { name, description, datetime, location } = req.body;
            const newEvent = await this.eventService.create({
                user_id: user,
                event_name: name,
                event_datetime: datetime,
                event_location: location,
                event_description: description,
            });
            res.status(201).json({ message: "Created new Event successfully", data: newEvent });
        } catch (error) {
            console.error("Error creating event:", error);
            next(error);
        }
    }

    async getEventById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const event = await this.eventService.findById(id);
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json({ status: "success", data: event });
        } catch (error) {
            console.error("Error fetching event by ID:", error);
            next(error);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { user, name, description, datetime, location } = req.body;
            const updatedEvent = await this.eventService.update(id, {
                user_id: user,
                event_name: name,
                event_datetime: datetime,
                event_location: location,
                event_description: description,
            });
            res.status(200).json({ message: "Updated Event successfully", data: updatedEvent });
        } catch (error) {
            console.error("Error updating event:", error);
            next(error);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.eventService.delete(id);
            res.status(200).json({ message: "Event deleted successfully" });
        } catch (error) {
            console.error("Error deleting event:", error);
            next(error);
        }
    }

    async getGuestInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { event_id } = req.params;
            const insights = await this.inviteeService.findByEventId(event_id);

            const statusCounts = {
                totalInvited: insights.length,
                confirmed: 0,
                attended: 0,
                pending: 0,
                totalContribution: 0,
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
            next(error);
        }
    }

    async createInvitee(req: Request, res: Response, next: NextFunction) {
        try {
            const { event_id } = req.params;
            const invitee: IInviteeWithoutId = req.body;
            const newInvitee = await this.inviteeService.create({ ...invitee, event_id });
            res.status(201).json({ message: "New invitee created", data: newInvitee });
        } catch (error) {
            console.error("Error creating invitee:", error);
            next(error);
        }
    }
}

export default EventController;