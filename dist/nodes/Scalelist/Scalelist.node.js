"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scalelist = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const config_1 = require("../../config");
class Scalelist {
    constructor() {
        this.description = {
            version: 1,
            displayName: 'Scalelist',
            name: 'scalelist',
            icon: { light: 'file:../../icons/logo.svg', dark: 'file:../../icons/logo_dark.svg' },
            group: ['input'],
            description: 'Scalelist',
            defaults: {
                name: 'Scalelist',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'ScalelistApi',
                    required: true
                }
            ],
            properties: [
                {
                    displayName: 'First Name',
                    name: 'first_name',
                    type: 'string',
                    default: '',
                    placeholder: 'John',
                    description: 'First Name of prospect',
                    required: true
                },
                {
                    displayName: 'Last Name',
                    name: 'last_name',
                    type: 'string',
                    default: '',
                    placeholder: 'Doe',
                    description: 'Last Name of prospect',
                    required: true
                },
                {
                    displayName: 'Company Name',
                    name: 'company_name',
                    type: 'string',
                    default: '',
                    placeholder: 'Google',
                    description: 'Company Name of prospect',
                },
                {
                    displayName: 'Company Website',
                    name: 'company_domain',
                    type: 'string',
                    default: '',
                    placeholder: 'google.com',
                    description: 'Company Website of prospect',
                    hint: 'Company Website of prospect.',
                },
            ],
            usableAsTool: true,
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const firstName = this.getNodeParameter('first_name', i, '');
                const lastName = this.getNodeParameter('last_name', i, '');
                const companyName = this.getNodeParameter('company_name', i, '');
                const companyDomain = this.getNodeParameter('company_domain', i, '');
                const apiKey = (await this.getCredentials('ScalelistApi')).apiKey;
                const url = new URL(config_1.SCALELIST_API_URL, '/api/ext/finder/email');
                url.searchParams.append('x_api_key', apiKey);
                url.searchParams.append('first_name', firstName);
                url.searchParams.append('last_name', lastName);
                if (companyName) {
                    url.searchParams.append('company_name', companyName);
                }
                if (companyDomain) {
                    url.searchParams.append('company_website', companyDomain);
                }
                const response = await this.helpers.httpRequest({
                    url: url.toString(),
                    method: 'GET',
                });
                const obj = {
                    success: true,
                    data: {
                        email: response.email,
                        status: response.status,
                    },
                };
                returnData.push({ json: obj });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex: i });
                }
            }
        }
        return [returnData];
    }
}
exports.Scalelist = Scalelist;
//# sourceMappingURL=Scalelist.node.js.map