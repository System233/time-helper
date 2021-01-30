import { BMapGeocoderDataDto } from "./geocoder.dto";
import { AreaStrDto } from "./helper.dto";
export declare const BMapGeocoder: (ak: string, lng: number, lat: number) => Promise<BMapGeocoderDataDto>;
export declare const GetAreaInfo: (lng: number, lat: number) => Promise<AreaStrDto>;
export declare const RandomLocation: (lng: number, lat: number, radius?: number) => number[];
//# sourceMappingURL=geocoder.d.ts.map