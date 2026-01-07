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
declare class UserService {
    createUser(userData: CreateUserData): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        systemRole: "admin" | "user";
        createdAt: Date;
    }>;
    findUserByEmail(email: string): Promise<{
        id: string;
        imageUrl: string | null;
        fullName: string;
        email: string;
        phone: string | null;
        passwordHash: string;
        systemRole: "admin" | "user";
        createdAt: Date;
    }>;
    findUserById(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        systemRole: "admin" | "user";
        createdAt: Date;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff" | null;
        organizationId: string | null;
        organizationName: string | null;
        organizationSlug: string | null;
    }>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    authenticateUser(loginData: LoginData): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        systemRole: "admin" | "user";
        createdAt: Date;
        role: "owner" | "manager" | "surveyor" | "agent" | "staff" | null;
        organizationId: string | null;
        organizationName: string | null;
        organizationSlug: string | null;
    }>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map