"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalelistApi = void 0;
const config_1 = require("../config");
class ScalelistApi {
    constructor() {
        this.name = 'ScalelistApi';
        this.displayName = 'Scalelist API Key API';
        this.documentationUrl = 'https://app.scalelist.com/app/api-key';
        this.icon = { light: 'file:../icons/logo.svg', dark: 'file:../icons/logo_dark.svg' };
        this.properties = [
            {
                displayName: 'Scalelist API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                typeOptions: { password: true }
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                qs: {
                    'x_api_key': '={{$credentials.apiKey}}'
                }
            },
        };
        this.test = {
            request: {
                baseURL: config_1.SCALELIST_API_URL,
                url: '/api/ext/me',
                method: 'GET',
            },
        };
    }
}
exports.ScalelistApi = ScalelistApi;
//# sourceMappingURL=ScalelistApi.credentials.js.map