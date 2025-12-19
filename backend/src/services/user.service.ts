import bcrypt from "bcrypt";
import { db } from "../database";
import { users, organizations, members } from "../database/schemas";
import { eq } from "drizzle-orm";
import { createError } from "../middlewares/error.middleware";

export interface CreateUserData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class UserService {
  async createUser(userData: CreateUserData) {
    const { fullName, email, phone, password } = userData;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw createError("User with this email already exists", 400);
    }

    const passwordHash = await this.hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        fullName,
        email,
        phone,
        passwordHash,
        // systemRole defaults to 'user' in schema
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        systemRole: users.systemRole,
        createdAt: users.createdAt,
      });

    return newUser;
  }

  async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  }

  async findUserById(id: string) {
    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        systemRole: users.systemRole,
        createdAt: users.createdAt,
        role: members.role,
        organizationId: members.organizationId,
        organizationName: organizations.name,
        organizationSlug: organizations.slug,
      })
      .from(users)
      .leftJoin(members, eq(users.id, members.userId))
      .leftJoin(organizations, eq(members.organizationId, organizations.id))
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async authenticateUser(loginData: LoginData) {
    const { email, password } = loginData;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw createError("Invalid email or password", 401);
    }

    const isValidPassword = await this.validatePassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw createError("Invalid email or password", 401);
    }

    const fullUser = await this.findUserById(user.id);
    if (!fullUser) throw createError("User not found", 404);

    return fullUser;
  }
}

export const userService = new UserService();
