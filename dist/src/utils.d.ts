interface Message {
    text: string;
    desp?: string;
}
export declare function SendMessageWithKey(key: string, msg: Message): Promise<import("axios").AxiosResponse<any>>;
export declare function getAppIdFromUrl(url: string): string | string[];
export declare function SendMessage(text: string, desp?: string): Promise<any>;
export declare function question(msg?: string, timeout?: number): Promise<string>;
export {};
//# sourceMappingURL=utils.d.ts.map