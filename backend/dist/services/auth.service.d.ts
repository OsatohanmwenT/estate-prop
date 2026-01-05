declare class AuthService {
    private authConfig;
    generateToken(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
        refreshExpiresAt: Date;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
        refreshExpiresAt: Date;
    }>;
    revokeRefreshToken(userId: string): Promise<void>;
    private calculateExpiry;
    getUserSessions(userId: string): Promise<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        createdAt: Date;
    }[]>;
    private storeRefreshToken;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map