import axios from "axios";
import config from "./config";
import { BMapGeocoderDataDto, BMapGeocoderDto } from "./geocoder.dto";
import { AreaStrDto } from "./helper.dto";

export const BMapGeocoder=async (ak:string, lng:number, lat:number): Promise<BMapGeocoderDataDto>=>{
    const J = (lng, lat) => ({ lng: lng, lat: lat });
    const bmap = {
        MO: 6370996.81,
        TF: [1.289059486e7, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
        du: [86, 60, 45, 30, 15, 0],
        SO: [
            [
                1.410526172116255e-8,
                8.98305509648872e-6,
                -1.9939833816331,
                200.9824383106796,
                -187.2403703815547,
                91.6087516669843,
                -23.38765649603339,
                2.57121317296198,
                -0.03801003308653,
                1.73379812e7,
            ],
            [
                -7.435856389565537e-9,
                8.983055097726239e-6,
                -0.78625201886289,
                96.32687599759846,
                -1.85204757529826,
                -59.36935905485877,
                47.40033549296737,
                -16.50741931063887,
                2.28786674699375,
                1.026014486e7,
            ],
            [
                -3.030883460898826e-8,
                8.98305509983578e-6,
                0.30071316287616,
                59.74293618442277,
                7.357984074871,
                -25.38371002664745,
                13.45380521110908,
                -3.29883767235584,
                0.32710905363475,
                6856817.37,
            ],
            [
                -1.981981304930552e-8,
                8.983055099779535e-6,
                0.03278182852591,
                40.31678527705744,
                0.65659298677277,
                -4.44255534477492,
                0.85341911805263,
                0.12923347998204,
                -0.04625736007561,
                4482777.06,
            ],
            [
                3.09191371068437e-9,
                8.983055096812155e-6,
                6.995724062e-5,
                23.10934304144901,
                -2.3663490511e-4,
                -0.6321817810242,
                -0.00663494467273,
                0.03430082397953,
                -0.00466043876332,
                2555164.4,
            ],
            [
                2.890871144776878e-9,
                8.983055095805407e-6,
                -3.068298e-8,
                7.47137025468032,
                -3.53937994e-6,
                -0.02145144861037,
                -1.234426596e-5,
                1.0322952773e-4,
                -3.23890364e-6,
                826088.5,
            ],
        ],
        QF: [
            [
                -0.0015702102444,
                111320.7020616939,
                1704480524535203,
                -10338987376042340,
                26112667856603880,
                -35149669176653700,
                26595700718403920,
                -10725012454188240,
                1800819912950474,
                82.5,
            ],
            [
                8.277824516172526e-4,
                111320.7020463578,
                6.477955746671607e8,
                -4.082003173641316e9,
                1.077490566351142e10,
                -1.517187553151559e10,
                1.205306533862167e10,
                -5.124939663577472e9,
                9.133119359512032e8,
                67.5,
            ],
            [
                0.00337398766765,
                111320.7020202162,
                4481351.045890365,
                -2.339375119931662e7,
                7.968221547186455e7,
                -1.159649932797253e8,
                9.723671115602145e7,
                -4.366194633752821e7,
                8477230.501135234,
                52.5,
            ],
            [
                0.00220636496208,
                111320.7020209128,
                51751.86112841131,
                3796837.749470245,
                992013.7397791013,
                -1221952.21711287,
                1340652.697009075,
                -620943.6990984312,
                144416.9293806241,
                37.5,
            ],
            [
                -3.441963504368392e-4,
                111320.7020576856,
                278.2353980772752,
                2485758.690035394,
                6070.750963243378,
                54821.18345352118,
                9540.606633304236,
                -2710.55326746645,
                1405.483844121726,
                22.5,
            ],
            [
                -3.218135878613132e-4,
                111320.7020701615,
                0.00369383431289,
                823725.6402795718,
                0.46104986909093,
                2351.343141331292,
                1.58060784298199,
                8.77738589078284,
                0.37238884252424,
                7.45,
            ],
        ],
        encode: function (a) {
            if (
                a === null ||
                a === undefined ||
                180 < a.lng ||
                -180 > a.lng ||
                90 < a.lat ||
                -90 > a.lat
            )
                return J(0, 0);
            let c;
            a.lng = this.dD(a.lng, -180, 180);
            a.lat = this.jD(a.lat, -85, 85);
            const b = J(a.lng, a.lat);
            for (let e = 0; e < this.du.length; e++)
                if (b.lat >= this.du[e]) {
                    c = this.QF[e];
                    break;
                }
            if (!c)
                for (let e = 0; e < this.du.length; e++)
                    if (b.lat <= -this.du[e]) {
                        c = this.QF[e];
                        break;
                    }
            a = this.MJ(a, c);
            return (a = J(a.lng, a.lat));
        },
        MJ: function (a, b) {
            if (a && b) {
                let c = b[0] + b[1] * Math.abs(a.lng),
                    e = Math.abs(a.lat) / b[9];
                e =
                    b[2] +
                    b[3] * e +
                    b[4] * e * e +
                    b[5] * e * e * e +
                    b[6] * e * e * e * e +
                    b[7] * e * e * e * e * e +
                    b[8] * e * e * e * e * e * e,
                c = c * (0 > a.lng ? -1 : 1),
                e = e * (0 > a.lat ? -1 : 1);
                return J(c, e);
            }
        },
        jD: function (a, b, c) {
            b != null && (a = Math.max(a, b));
            c != null && (a = Math.min(a, c));
            return a;
        },
        dD: function (a, b, c) {
            for (; a > c;) a -= c - b;
            for (; a < b;) a += c - b;
            return a;
        },
    };
    const point = bmap.encode({ lng, lat });
    const resp = await axios.get<BMapGeocoderDto>("https://api.map.baidu.com/", {
        params: {
            qt: "rgc",
            dis_poi: 100,
            poi_num: 10,
            latest_admin: 1,
            extensions_town: false,
            ie: "utf-8",
            oue: 1,
            fromproduct: "jsapi",
            res: "api",
            ak: ak,
            x: point.lng,
            y: point.lat,
        },
    });
    return resp.data.content;
}
export const GetAreaInfo=async(lng:number,lat:number):Promise<AreaStrDto>=>{
    const data=await BMapGeocoder(config.BMAP_AK,lng,lat);
    const detail=data.address_detail;
    return {
        streetNumber: detail.street_number,
        street: detail.street,
        district: detail.district,
        city: detail.city,
        province: detail.province,
        town: detail.town,                        //未知：猜测为镇，测试为空
        pois: data.poi_region[0]?.name||'',   //位置名称
        lat: lat,                 //纬度
        lng: lng,                //经度
        code: data.surround_poi[0]?.zip||'',                  //未知：猜测邮编，测试为空
        address: data.address, //区县+街道+街道号+名称
        text: [detail.province,detail.city].join('-'), //省+城市名
      }
}
export const RandomLocation=(lng:number,lat:number,radius?:number):number[]=>{
    const [dis,rad]=[
        1-Math.sqrt(Math.random()),
        Math.random()*Math.PI*2
    ];
    radius=radius||0;
    return [
        lng+(radius/100000*(Math.cos(rad)*dis)),
        lat+(radius/100000*(Math.sin(rad)*dis)),
    ].map(x=>x.toFixed(6)).map(parseFloat);
}
