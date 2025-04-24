import { NextFunction, Request, Response } from "express";
import {IInviteeWithoutId, IInviteeService } from "../interfaces/InviteesInterface";
import redisCache from "../services/cacheService"

export class InviteesController {
    constructor(private inviteesService: IInviteeService) {}

    async getAllInvitees(req: Request, res: Response, next: NextFunction) {
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
            const result = await this.inviteesService.findAll();
            await redisCache.set(cacheKey, JSON.stringify(result), 360);
            
            res.json({ message: "Get all invitees", data: result });
        } catch (error) {
            next(error);
        }
    }

    async getInviteeById(req: Request, res: Response, next: NextFunction) {
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
            const { id } = req.params;
            const result = await this.inviteesService.findById(id);
            await redisCache.set(cacheKey, JSON.stringify(result), 360);

            res.json({ message: "Get invitee by Id", data: result });
        } catch (error) {
            next(error);
        }
    }

  

    async updateInvitee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const invitee: Partial<IInviteeWithoutId> = req.body;
            const updatedInvitee = await this.inviteesService.update(id, invitee);
            res.json({ message: "Invitee updated successfully", data: updatedInvitee });
        } catch (error) {
            next(error);
        }
    }

    async deleteInvitee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.inviteesService.delete(id);
            res.status(200).json({ message: "Invitee deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    async updateInviteeStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { inviteeId } = req.params;
            const { status } = req.body;

            const updatedInvitee = await this.inviteesService.updateStatus(inviteeId, status);
            res.status(200).json({ message: 'Invitee status updated', data: updatedInvitee });
        } catch (error) {
            next(error);
        }
    }
}
