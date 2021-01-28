/// <reference types="node" />
import { KeyObject } from "crypto";
import { AxiosInstance, AxiosRequestConfig } from "axios";
export interface AuthData {
    username: string;
    password?: string;
    token?: string;
}
export interface AuthOption extends AuthData {
    type: 'sms' | 'token' | 'password';
}
export declare class Session {
    privateKey: KeyObject;
    publicKey: KeyObject;
    session: string;
    key: string;
    http: AxiosInstance;
    static create(session?: string): Promise<Session>;
    getHeaders(): {
        'Content-Type': string;
        'User-Agent': string;
    };
    private constructor();
    decryptRSA(data: string): string;
    decryptDES(data: string): string;
    encryptDES(data: string): string;
    get deviceId(): string;
    generateIMEI(): string;
    private init;
    request(config: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any>>;
    get(url: string, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any>>;
    post(url: string, data?: any, config?: AxiosRequestConfig): Promise<import("axios").AxiosResponse<any>>;
    sendSMS(option: AuthData): Promise<boolean>;
    authSMS(sms: string, option: AuthData): Promise<string>;
    authenticateWithSMS(option: AuthData): Promise<string>;
    authenticateWithPWD(option: AuthData): Promise<string>;
    authenticateWithToken(option: AuthData): string;
    authenticate(option: AuthOption): Promise<string>;
}
export default Session;
//# sourceMappingURL=session.d.ts.map