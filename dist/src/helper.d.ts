import { AxiosInstance } from "axios";
import { AppInfoDto, LastSubmitData, SubmitData, UserInfoDto } from "./helper.dto";
export declare class API {
    private token;
    http: AxiosInstance;
    host: string;
    constructor(token: string);
    private doDKData;
    private getDKData;
    getApps(): Promise<AppInfoDto[]>;
    getUserInfo(): Promise<UserInfoDto>;
    getLastData(id: string): Promise<LastSubmitData>;
    submitData(data: SubmitData): Promise<any>;
}
export declare class Helper extends API {
    handleData(data: LastSubmitData): LastSubmitData;
    run(): Promise<LastSubmitData>;
}
export default Helper;
//# sourceMappingURL=helper.d.ts.map