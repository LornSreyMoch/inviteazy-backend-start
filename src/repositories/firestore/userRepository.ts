import bcrypt from "bcrypt";
import { IUser, IUserRepository } from "../../interfaces/userInterface";
import { db } from "../../config/firebase/db";  // Firebase DB setup
import { v4 as uuidv4 } from "uuid";

export class FirebaseUserRepository implements IUserRepository {
  
  async findAll(): Promise<IUser[]> {
    try {
      const snapshot = await db.collection("users").get();
      const users: IUser[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          password: data.password, // Add a default value for the password field
          role: data.role,
          phone_number: data.phone_number,
          profile_picture: data.profile_picture,
          address: data.address,
        };
      });
      return users;
    } catch (error) {
      throw new Error("Failed to retrieve users from Firebase");
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const doc = await db.collection("users").doc(id).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        id: doc.id,
        name: data!.name,
        email: data!.email,
        password: data!.password, // Include the password field
        role: data!.role,
        phone_number: data!.phone_number,
        profile_picture: data!.profile_picture,
        address: data!.address,
      };
    } catch (error) {
      throw new Error(`Failed to find user with ID ${id} in Firebase`);
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const snapshot = await db.collection("users").where("email", "==", email).get();
      if (snapshot.empty) {
        return null;
      }
      const data = snapshot.docs[0].data();
      return {
        id: snapshot.docs[0].id,
        name: data.name,
        email: data.email,
        password: data.password, // Include the password field
        role: data.role,
        phone_number: data.phone_number,
        profile_picture: data.profile_picture,
        address: data.address,
      };
    } catch (error) {
      throw new Error(`Failed to find user with email ${email} in Firebase`);
    }
  }

  async create(user: Omit<IUser, "id">): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        phone_number: user.phone_number,
        profile_picture: user.profile_picture,
        address: user.address,
      };
      const docRef = await db.collection("users").add(newUser);
      const doc = await docRef.get();
      const data = doc.data();
      return {
        id: doc.id,
        name: data!.name,
        email: data!.email,
        password: hashedPassword, // Include the hashed password
        role: data!.role,
        phone_number: data!.phone_number,
        profile_picture: data!.profile_picture,
        address: data!.address,
      };
    } catch (error) {
      throw new Error("Failed to create user in Firebase");
    }
  }
}
