import { Router, Request, Response } from 'express';
import { db } from '../config/firebase/db';

export default function inviteFireRoutes(): Router {
    const app = Router();

    app.get('/', async (req: Request, res: Response) => {
        try {
            console.log('Fetching all invitees from Firestore');
            const inviteesRef = db.collection('Invitation');
            const snapshot = await inviteesRef.get();
            const Invitation: { id: string; data: FirebaseFirestore.DocumentData }[] = [];

            snapshot.forEach(doc => {
                Invitation.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            res.status(200).json(Invitation);
        } catch (error) {
            console.error('Error fetching invitees:', error);
            res.status(500).json({ message: 'Failed to fetch invitees', error });
        }
    });

    return app;
}