const rp      = require("request-promise");
const process = require("process");

const url     = process.env.GW_API_URL;
const app_key = process.env.GW_APP_KEY;

let token;

class ApiError extends Error {};

const optionGen = function (endpoint) {
    return {
        uri: url + endpoint,
        headers: {
            "User-Agent": "Request-Promise",
            "x-app-key": app_key,
            "x-auth-token": token
        },
        json: true
    }
};

module.exports = {
    setToken: function (_token) {
        token = _token;
    },
    checkToken: function () {
        return rp(optionGen("/check-token/")).catch(err => new ApiError({ endpoint: 'check-token', message: err.response.body.message || ""}));
    },
    getUser: function (userId) {
        return rp(optionGen(`/user/${userId}/`)).catch(err => new ApiError({ endpoint: 'user', message: err.response.body.message || ""}));
    },
    getList: function (listId) {
        return rp(optionGen(`/list/${listId}/`)).catch(err => new ApiError({ endpoint: 'list', message: err.response.body.message || ""}));
    },
    uploadImage: function (options) {
        var httpOptions = optionGen(`/list/${options.room}/chat-image-upload/`);
        delete httpOptions.json;
        httpOptions.method = 'POST';
        httpOptions.formData = options.formData;
        return rp(httpOptions).catch(err => new ApiError({ endpoint: 'upload-image', message: err.response.body.message || ""}));
    },
    errorParser: function (e) {
        try {
            const response = JSON.parse(e.response.body).message;

            if(typeof response === 'string')
                return response;

            let concatResponse = '';
            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    for (let ikey in response[key]) {
                        if (response[key].hasOwnProperty(ikey)) {
                            concatResponse += response[key][ikey] + ". ";
                        }
                    }

                }
            }

            return concatResponse;

        }
        catch (e) {
            return null;
        }
    }
};