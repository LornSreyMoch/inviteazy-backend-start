import { db } from "../../config/firebase/db";  // Your Firebase setup
import { IInvitee, IInviteeRepository, IInviteeWithoutId } from "../../interfaces/InviteesInterface";
import { v4 as uuidv4 } from "uuid";

export class FirebaseInviteesRepository implements IInviteeRepository {
  
  async findAll(): Promise<IInvitee[]> {
    try {
      const snapshot = await db.collection("invitees").get();
      const invitees: IInvitee[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          event_id: data.event_id,
          user_id: data.user_id,
          status: data.status,
          qr_code: data.qr_code,
          is_checked_in: data.is_checked_in,
          checked_in_at: data.checked_in_at,
          created_at: data.created_at.toDate(), // If stored as Timestamp in Firestore
        } as IInvitee;
      });
      return invitees;
    } catch (error) {
      throw new Error("Failed to retrieve invitees from Firebase");
    }
  }

  async findById(id: string): Promise<IInvitee | null> {
    try {
      const doc = await db.collection("invitees").doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        id: doc.id,
        event_id: data!.event_id,
        user_id: data!.user_id,
        status: data!.status,
        qr_code: data!.qr_code,
        is_checked_in: data!.is_checked_in,
        checked_in_at: data!.checked_in_at,
        created_at: data!.created_at.toDate(),
      } as IInvitee;
    } catch (error) {
      throw new Error(`Failed to find invitee with ID ${id} in Firebase`);
    }
  }

  async findByEventId(event_id: string): Promise<IInvitee[]> {
    try {
      const snapshot = await db.collection("invitees").where("event_id", "==", event_id).get();
      const invitees: IInvitee[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          event_id: data.event_id,
          user_id: data.user_id,
          status: data.status,
          qr_code: data.qr_code,
          is_checked_in: data.is_checked_in,
          checked_in_at: data.checked_in_at,
          created_at: data.created_at.toDate(),
        } as IInvitee;
      });
      return invitees;
    } catch (error) {
      throw new Error(`Failed to find invitees for event ${event_id} in Firebase`);
    }
  }

  async findByUserId(user_id: string): Promise<IInvitee[]> {
    try {
      const snapshot = await db.collection("invitees").where("user_id", "==", user_id).get();
      const invitees: IInvitee[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          event_id: data.event_id,
          user_id: data.user_id,
          status: data.status,
          qr_code: data.qr_code,
          is_checked_in: data.is_checked_in,
          checked_in_at: data.checked_in_at,
          created_at: data.created_at.toDate(),
        } as IInvitee;
      });
      return invitees;
    } catch (error) {
      throw new Error(`Failed to find invitees for user ${user_id} in Firebase`);
    }
  }

  async create(invitee: IInviteeWithoutId): Promise<IInvitee> {
    try {
      const id = uuidv4();
      const created_at = new Date();
      const status = invitee.status || 'pending';
      const qr_code = invitee.qr_code || `https://example.com/qr/${id}`;
      const is_checked_in = invitee.is_checked_in ?? false;
      const checked_in_at = invitee.checked_in_at ?? null;

      const newInvitee = {
        event_id: invitee.event_id,
        user_id: invitee.user_id,
        status,
        qr_code,
        is_checked_in,
        checked_in_at,
        created_at
      };

      await db.collection("invitees").doc(id).set(newInvitee);
      return {
        id,
        ...newInvitee,
      } as IInvitee;
    } catch (error) {
      throw new Error("Failed to create invitee in Firebase");
    }
  }

  async update(id: string, invitee: Partial<IInviteeWithoutId>): Promise<IInvitee | null> {
    try {
      const updated_at = new Date();
      const updatedInvitee = {
        ...invitee,
        updated_at
      };

      await db.collection("invitees").doc(id).update(updatedInvitee);
      const doc = await db.collection("invitees").doc(id).get();
      const data = doc.data();
      if (!data) return null;
      
      return {
        id: doc.id,
        event_id: data!.event_id,
        user_id: data!.user_id,
        status: data!.status,
        qr_code: data!.qr_code,
        is_checked_in: data!.is_checked_in,
        checked_in_at: data!.checked_in_at,
        created_at: data!.created_at.toDate(),
        updated_at,
      } as IInvitee;
    } catch (error) {
      throw new Error(`Failed to update invitee with ID ${id} in Firebase`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.collection("invitees").doc(id).delete();
    } catch (error) {
      throw new Error(`Failed to delete invitee with ID ${id} from Firebase`);
    }
  }

  async updateStatus(id: string, status: string): Promise<IInvitee> {
    try {
      const docRef = db.collection("invitees").doc(id);
      await docRef.update({ status });
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error(`Invitee with ID ${id} not found`);
      }
      const data = doc.data();
      return {
        id: doc.id,
        event_id: data!.event_id,
        user_id: data!.user_id,
        status: data!.status,
        qr_code: data!.qr_code,
        is_checked_in: data!.is_checked_in,
        checked_in_at: data!.checked_in_at,
        created_at: data!.created_at.toDate(),
      } as IInvitee;
    } catch (error) {
      throw new Error(`Failed to update status for invitee with ID ${id} in Firebase`);
    }
  }
}
