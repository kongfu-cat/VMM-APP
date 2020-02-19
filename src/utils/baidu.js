import { get, post } from "./request"
import baiduConfig from "../../baidu.config.js"
// 设置APPID/AK/SK
var APP_ID = baiduConfig.APP_ID;
var API_KEY = baiduConfig.API_KEY;
var SECRET_KEY = baiduConfig.SECRET_KEY;
var TOKEN_URL = baiduConfig.TOKEN_URL;
var PLATE_URL = baiduConfig.PLATE_URL;
function getSessionToken () {
    return new Promise((resolve, reject) => {
        get(TOKEN_URL, {
            grant_type: "client_credentials",
            client_id: API_KEY,
            client_secret: SECRET_KEY
        }).then(res => {
            console.log("getSessionToken.res: ", res)
            resolve(JSON.parse(res.data))
        }).catch(function (err) {
            console.log("getSessionToken error: ", err);
            reject(err)
        })
    })
}

export function getLicensePlate (imageBase64) {
    return new Promise((resolve, reject) => {
        getSessionToken().then(res => {
            const token = res.access_token || res.refresh_token
            if (!token) {
                reject("token can't be null")
            }
            post(PLATE_URL, {
                access_token: token,
                image: imageBase64
            }).then(res => {
                console.log("getLicensePlate.res: ", res)
                const data = JSON.parse(res.data)
                if (data.error_msg) {
                    reject(data.error_msg)
                }
                const licensePlate = data.words_result.number
                if (!licensePlate) {
                    reject("licensePlate is null")
                }
                resolve(licensePlate)
            }).catch(function (err) {
                console.log("getLicensePlate error: ", err);
                reject(err)
            })
        }).catch(function (err) {
            reject(err)
        })
    })
}
