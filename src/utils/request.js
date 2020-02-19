const axios = require('axios');

export function post (url, data, headers) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'post',
            data: data || {},
            headers: headers || {}
        };
        cordova.plugin.http.sendRequest(url, options, function (response) {
            // prints 200
            console.log(response.status);
            resolve(response)

        }, function (response) {
            // prints 403
            console.log(response.status);
            //prints Permission denied
            console.log(response.error);
            reject(response)
        })
    })
}

export function get (url, data, headers) {
    return new Promise((resolve, reject) => {
        // console.log(cordova.plugin)
        cordova.plugin.http.get(url, data || {}, headers || {}, function (response) {
            // console.log(response.status);
            resolve(response)
        }, function (response) {
            // console.error(response.error);
            reject(response)
        });
    })
}