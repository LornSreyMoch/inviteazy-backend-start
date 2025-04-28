import { Pool } from "mysql2/promise";
import { IInvitee, IInviteeRepository, IInviteeWithoutId } from "../../interfaces/InviteesInterface";
import { v4 as uuidv4 } from "uuid";
import { queryWithLogging } from "./utils"; 


export class MariaDBInviteesRepository implements IInviteeRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async findAll(): Promise<IInvitee[]> {
        const [rows] = await queryWithLogging(this.pool,"SELECT * FROM invitees");
        return rows as IInvitee[];
    }

    async findById(id: string): Promise<IInvitee | null> {
        const [rows] = await queryWithLogging(this.pool,"SELECT * FROM invitees WHERE id = ?", [id]);
        const result = rows as IInvitee[];
        return result[0] || null;
    }

    async findByEventId(event_id: string): Promise<IInvitee[]> {
        const [rows] = await queryWithLogging(this.pool,"SELECT * FROM invitees WHERE event_id = ?", [event_id]);
        return rows as IInvitee[];
    }

    async findByUserId(user_id: string): Promise<IInvitee[]> {
        const [rows] = await queryWithLogging(this.pool,"SELECT * FROM invitees WHERE user_id = ?", [user_id]);
        return rows as IInvitee[];
    }

    async create(invitee: IInviteeWithoutId): Promise<IInvitee> {
        const id = uuidv4();
        const created_at = new Date();
        const status = invitee.status || 'pending';
        const qr_code = invitee.qr_code || `https://example.com/qr/${id}`;
        const is_checked_in = invitee.is_checked_in ?? false;
        const checked_in_at = invitee.checked_in_at ?? null;

        const query = `
            INSERT INTO invitees (id, event_id, user_id, status, qr_code, is_checked_in, checked_in_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id,
            invitee.event_id,
            invitee.user_id,
            status,
            qr_code,
            is_checked_in,
            checked_in_at,
            created_at
        ];

        await queryWithLogging(this.pool,query, values);

        return {
            id,
            ...invitee,
            status,
            qr_code,
            is_checked_in,
            checked_in_at,
            created_at
        };
    }

    async update(id: string, invitee: Partial<IInviteeWithoutId>): Promise<IInvitee | null> {
        const updates = [];
        const values = [];

        for (const [key, value] of Object.entries(invitee)) {
            updates.push(`${key} = ?`);
            values.push(value);
        }

        values.push(id);

        const query = `UPDATE invitees SET ${updates.join(', ')} WHERE id = ?`;
        await queryWithLogging(this.pool,query, values);

        return this.findById(id); 
    }

    async delete(id: string): Promise<void> {
        await queryWithLogging(this.pool,"DELETE FROM invitees WHERE id = ?", [id]);
    }

    async updateStatus(id: string, status: string): Promise<IInvitee> {
        const query = `
            UPDATE invitees
            SET status = ?
            WHERE id = ?
        `;
        await queryWithLogging(this.pool,query, [status, id]);

        const updated = await this.findById(id);
        if (!updated) {
            throw Object.assign(new Error('Invitee not found'), { status: 404 });
        }

        return updated;
    }
}
