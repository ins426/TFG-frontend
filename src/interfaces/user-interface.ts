export interface LoginUserInterface {
    email?: string;
    password?: string;
}

export interface JwtResponse {
    authToken: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
}