export interface FieldItemDto {
    assembltype: "RadioGroup" | "Temperature" | "CheckboxGroup" | "TextareaField";
    checkValues: {
        text: string;
    }[];
    decription: string;
    value: string;
    required: string;
    propertyname: string;
}
export interface DepartItemDto {
    deptid: number;
    deptName: string;
    parentId: number;
    hasLeaf: boolean;
    childs: FieldItemDto[];
}
export interface LastSubmitData {
    templateid: string;
    username: string;
    customerid: string;
    areaStr: string;
    cardNo: string;
    deptStr: {
        text: string;
        deptid: number;
    };
    stuNo: string;
    phonenum: string;
    userid: string;
    sysDeptResVo: DepartItemDto[];
    cusTemplateRelations: FieldItemDto[];
}
export interface UserInfoDto {
    classDescription: string;
    classId: number;
    collegeId: number;
    customerId: number;
    majorId: number;
    stuNo: string;
    userId: number;
    username: string;
}
export interface AppInfoDto {
    clockPersons: number;
    clockPersonsFlag: boolean;
    clockPersonsType: number;
    createTime: string;
    creator: string;
    customerAppClassifyId: number;
    customerAppTypeRuleList: any[];
    deptName: string;
    effectiveDistance: number;
    effectiveDistanceFlag: boolean;
    id: number;
    modelFlag: boolean;
    modifier: string;
    name: string;
    schoolClockFlag: boolean;
    sortNum: number;
    updateTime: string;
    url: string;
    urlFlag: boolean;
}
export interface UpDataInfoItem {
    propertyname: string;
    value: string;
}
export interface SubmitData {
    areaStr: string;
    customerid: string;
    deptStr: {
        deptid: number;
        text: string;
    };
    deptid: number;
    gpsType: 1;
    phonenum: string;
    reportdate?: number;
    source: "app";
    stuNo: string;
    templateid: string;
    token?: string;
    updatainfo: UpDataInfoItem[];
    userid: string;
    username: string;
}
//# sourceMappingURL=helper.dto.d.ts.map