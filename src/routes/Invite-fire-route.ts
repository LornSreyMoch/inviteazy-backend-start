import { Router, Request, Response } from 'express';
import { db } from '../config/firebase/db';
import { v4 as uuidv4 } from 'uuid';

export default function inviteFireRoutes(): Router {
    const app = Router();

    const validStatuses = ['pending', 'accept', 'maybe', 'no', 'busy'];

    // POST /events/:event_id/invite
    app.post('/events/:event_id/invite', async (req: Request, res: Response): Promise<void> => {
        try {
            const { event_id } = req.params;
            const { user_id } = req.body;

            // Validate request body
            if (!user_id) {
                res.status(400).json({ message: 'user_id is required' });
                return;
            }

            // Check if the user already has an invite for this event
            const existingInviteSnapshot = await db
                .collection('Invitation')
                .where('event_id', '==', event_id)
                .where('user_id', '==', user_id)
                .get();

            if (!existingInviteSnapshot.empty) {
                res.status(400).json({ message: 'User has already been invited to this event' });
                return;
            }

            const id = uuidv4();
            const created_at = new Date().toISOString();

            const newInvite = {
                id,
                event_id,
                user_id,
                status: 'accept',
                qr_code: `https://example.com/qr/${id}`,
                is_checked_in: false,
                checked_in_at: null,
                created_at,
            };

            // Save the new invite to Firestore
            await db.collection('Invitation').doc(id).set(newInvite);

            res.status(201).json({
                message: 'New invitee created successfully',
                data: newInvite,
            });
        } catch (error: any) {
            console.error('Error creating invitee:', error);
            res.status(500).json({ message: 'Failed to create invitee', error: error.message });
        }
    });

    // PATCH /invitations/:invite_id/status
    app.patch('/invitations/:inviteeId', async (req: Request, res: Response): Promise<void> => {
        try {
            const { inviteeId } = req.params; // Use inviteeId instead of invite_id
            const { status } = req.body;

            // Validate the status field
            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: `Invalid status. Allowed values are: ${validStatuses.join(', ')}` });
                return;
            }

            // Check if the invite exists
            const inviteRef = db.collection('Invitation').doc(inviteeId); // Use inviteeId here
            const inviteDoc = await inviteRef.get();

            if (!inviteDoc.exists) {
                res.status(404).json({ message: 'Invite not found' });
                return;
            }

            // Update the status
            await inviteRef.update({ status });

            res.status(200).json({
                message: 'Invite status updated successfully',
                data: { id: inviteeId, status },
            });
        } catch (error: any) {
            console.error('Error updating invite status:', error);
            res.status(500).json({ message: 'Failed to update invite status', error: error.message });
        }
    });
    // GET /invitations
    app.get('/invitations', async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Fetching all invitees from Firestore');
            const inviteesRef = db.collection('Invitation');
            const snapshot = await inviteesRef.get();

            // Transform Firestore documents into an array
            const invitations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            res.status(200).json({
                message: 'Fetched all invitees successfully',
                data: invitations,
            });
        } catch (error: any) {
            console.error('Error fetching invitees:', error);
            res.status(500).json({ message: 'Failed to fetch invitees', error: error.message });
        }
    });

    // Post event
    app.post('/events/create', async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, datetime, description, location } = req.body;

            // Validate request body
            if (!name || !datetime || !description || !location) {
                res.status(400).json({ message: 'All fields (name, datetime, description, location) are required' });
                return;
            }

            const id = uuidv4();
            const created_at = new Date().toISOString();
            const newEvent = {
                id,
                event_name: name,
                event_datetime: datetime,
                event_description: description,
                event_location: location,
                created_at,
            };

            // Save the new event to Firestore
            await db.collection('Event').doc(id).set(newEvent);
            res.status(201).json({
                message: 'New event created successfully',
                data: newEvent,
            });
        } catch (error: any) {
            console.error('Error creating event:', error);
            res.status(500).json({ message: 'Failed to create event', error: error.message });
        }
    });

    // Post user
    app.post('/users', async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, role, phone_number, profile_picture, address } = req.body;

            // Validate required fields
            if (!name || !email || !password || !role) {
                res.status(400).json({ message: 'Fields (name, email, password, role) are required' });
                return;
            }

            const id = uuidv4();
            const created_at = new Date().toISOString();
            const newUser = {
                id,
                name,
                email,
                password,
                role,
                phone_number: phone_number || null,
                profile_picture: profile_picture || null,
                address: address || null,
                created_at,
                updated_at: created_at,
            };

            // Save the new user to Firestore
            await db.collection('Users').doc(id).set(newUser);
            res.status(201).json({
                message: 'New user created successfully',
                data: newUser,
            });
        } catch (error: any) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Failed to create user', error: error.message });
        }
    });

    return app;
}