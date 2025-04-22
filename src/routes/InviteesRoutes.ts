import { Router } from 'express';
import { InviteesController } from '../controllers/InviteesController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateInvitee } from '../middlewares/validationMiddleware';
import {
    validateIdInURLParam,
} from '../middlewares/validationMiddleware';

export default function inviteesRoutes(controller: InviteesController): Router {
    const router = Router();

    router.get('/invitations', authMiddleware, controller.getAllInvitees.bind(controller));
    router.get('/:id', authMiddleware, validateIdInURLParam, controller.getInviteeById.bind(controller));
    router.post('/:event_id/invite', authMiddleware, controller.createInvitee.bind(controller), validateInvitee);
    router.put('/:id', authMiddleware, validateIdInURLParam, controller.updateInvitee.bind(controller));
    router.delete('/:id', authMiddleware, validateIdInURLParam, controller.deleteInvitee.bind(controller));
    router.patch('/invitations/:inviteeId',authMiddleware, controller.updateInviteeStatus.bind(controller));

    return router;
}
