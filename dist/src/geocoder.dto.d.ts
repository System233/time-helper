export interface BMapPoint {
    x: string;
    y: string;
}
export interface BMapSurroundDto {
    addr: string;
    cp: string;
    direction: string;
    distance: string;
    name: string;
    poiType: string;
    point: BMapPoint;
    tag: string;
    tel: string;
    uid: string;
    zip: string;
}
export interface BMapRegionDto {
    direction_desc: string;
    name: string;
    tag: string;
    uid: string;
    distance: string;
}
export interface BMapGeocoderDataDto {
    address: string;
    address_detail: {
        adcode: number;
        city: string;
        city_code: number;
        country: string;
        country_code: number;
        direction: string;
        distance: string;
        district: string;
        province: string;
        street: string;
        street_number: string;
        town: string;
        town_code: string;
    };
    business: string;
    poi_desc: string;
    poi_region: BMapRegionDto[];
    point: BMapPoint;
    surround_poi: BMapSurroundDto[];
}
export interface BMapGeocoderDto {
    content: BMapGeocoderDataDto;
}
//# sourceMappingURL=geocoder.dto.d.ts.map