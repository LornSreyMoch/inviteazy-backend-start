import { Pool } from "pg";
import { IInvitee, IInviteeRepository, IInviteeWithoutId } from "../../interfaces/InviteesInterface";
import { queryWithLogging } from "./utils";
import { v4 as uuidv4 } from "uuid";

export class PostgresInviteesRepository implements IInviteeRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async findAll(): Promise<IInvitee[]> {
        const { rows } = await queryWithLogging(this.pool, "SELECT * FROM invitees");
        return rows;
    }

    async findById(id: string): Promise<IInvitee | null> {
        const { rows } = await queryWithLogging(this.pool, "SELECT * FROM invitees WHERE id = $1", [id]);
        return rows[0] || null;
    }

    async findByEventId(event_id: string): Promise<IInvitee[]> {
        const { rows } = await queryWithLogging(this.pool, "SELECT * FROM invitees WHERE event_id = $1", [event_id]);
        return rows;
    }

    async findByUserId(user_id: string): Promise<IInvitee[]> {
        const { rows } = await queryWithLogging(this.pool, "SELECT * FROM invitees WHERE user_id = $1", [user_id]);
        return rows;
    }

    async create(invitee: IInviteeWithoutId): Promise<IInvitee> {
        const id = uuidv4();
        const created_at = new Date();  
        const status = invitee.status || 'pending'; // Default status if not provided
        const qr_code = invitee.qr_code || `https://example.com/qr/${id}`; // Default QR code if not provided
        const is_checked_in = invitee.is_checked_in ?? false; // Default to false if not provided
        const checked_in_at = invitee.checked_in_at ?? null; // Default to null if not provided


        const query = `
            INSERT INTO invitees (id, event_id, user_id, status, qr_code, is_checked_in, checked_in_at, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`;

        const values = [
            id,
            invitee.event_id,
            invitee.user_id,
            status,
            qr_code,
            is_checked_in ?? false,
            checked_in_at ?? null,
            created_at
        ];

        const { rows } = await queryWithLogging(this.pool, query, values);
        return rows[0];
    }

    async update(id: string, invitee: Partial<IInviteeWithoutId>): Promise<IInvitee | null> {
        const updates = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(invitee)) {
            updates.push(`${key} = $${index++}`);
            values.push(value);
        }

        values.push(id);
        const query = `UPDATE invitees SET ${updates.join(', ')} WHERE id = $${index} RETURNING *`;

        const { rows } = await queryWithLogging(this.pool, query, values);
        return rows[0] || null;
    }

    async delete(id: string): Promise<void> {
        await queryWithLogging(this.pool, "DELETE FROM invitees WHERE id = $1", [id]);
    }

    async updateStatus(id: string, status: string): Promise<IInvitee> {
        const query = `
            UPDATE invitees
            SET status = $1
            WHERE id = $2
            RETURNING *;
        `;
        const values = [status, id];
        const { rows } = await this.pool.query(query, values);

        if (rows.length === 0) {
            throw Object.assign(new Error('Invitee not found'), { status: 404 });
        }

        return rows[0];
    }
}
