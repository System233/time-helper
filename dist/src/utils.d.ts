interface Message {
    text: string;
    desp?: string;
}
export declare function SendMessageWithSC(key: string, msg: Message): Promise<import("axios").AxiosResponse<any>>;
export declare function SendMessageWithQMSG(key: string, msg: string, qq?: string): Promise<import("axios").AxiosResponse<any>>;
export declare function SendMessageWithTempURL(url: string, key: string, title: string, content: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getAppIdFromUrl(url: string): string | string[];
export declare function SendMessage(title: string, content?: string, safe?: boolean): Promise<void>;
export declare function question(msg?: string, timeout?: number): Promise<string>;
export {};
//# sourceMappingURL=utils.d.ts.map