"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
const schemas_1 = require("../database/schemas");
const drizzle_orm_1 = require("drizzle-orm");
const error_middleware_1 = require("../middlewares/error.middleware");
class UserService {
    async createUser(userData) {
        const { fullName, email, phone, password } = userData;
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw (0, error_middleware_1.createError)("User with this email already exists", 400);
        }
        const passwordHash = await this.hashPassword(password);
        const [newUser] = await database_1.db
            .insert(schemas_1.users)
            .values({
            fullName,
            email,
            phone,
            passwordHash,
        })
            .returning({
            id: schemas_1.users.id,
            fullName: schemas_1.users.fullName,
            email: schemas_1.users.email,
            phone: schemas_1.users.phone,
            systemRole: schemas_1.users.systemRole,
            createdAt: schemas_1.users.createdAt,
        });
        return newUser;
    }
    async findUserByEmail(email) {
        const [user] = await database_1.db
            .select()
            .from(schemas_1.users)
            .where((0, drizzle_orm_1.eq)(schemas_1.users.email, email))
            .limit(1);
        return user || null;
    }
    async findUserById(id) {
        const [user] = await database_1.db
            .select({
            id: schemas_1.users.id,
            fullName: schemas_1.users.fullName,
            email: schemas_1.users.email,
            phone: schemas_1.users.phone,
            systemRole: schemas_1.users.systemRole,
            createdAt: schemas_1.users.createdAt,
            role: schemas_1.members.role,
            organizationId: schemas_1.members.organizationId,
            organizationName: schemas_1.organizations.name,
            organizationSlug: schemas_1.organizations.slug,
        })
            .from(schemas_1.users)
            .leftJoin(schemas_1.members, (0, drizzle_orm_1.eq)(schemas_1.users.id, schemas_1.members.userId))
            .leftJoin(schemas_1.organizations, (0, drizzle_orm_1.eq)(schemas_1.members.organizationId, schemas_1.organizations.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.users.id, id))
            .limit(1);
        return user || null;
    }
    async validatePassword(plainPassword, hashedPassword) {
        return bcrypt_1.default.compare(plainPassword, hashedPassword);
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt_1.default.hash(password, saltRounds);
    }
    async authenticateUser(loginData) {
        const { email, password } = loginData;
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw (0, error_middleware_1.createError)("Invalid email or password", 401);
        }
        const isValidPassword = await this.validatePassword(password, user.passwordHash);
        if (!isValidPassword) {
            throw (0, error_middleware_1.createError)("Invalid email or password", 401);
        }
        const fullUser = await this.findUserById(user.id);
        if (!fullUser)
            throw (0, error_middleware_1.createError)("User not found", 404);
        return fullUser;
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map