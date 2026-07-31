import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { SCALELIST_API_URL } from '../../config';


export class Scalelist implements INodeType {
  description: INodeTypeDescription = {
    version: 1,
    displayName: 'Scalelist',
    name: 'scalelist',
    icon: { light: 'file:../../icons/logo.svg', dark: 'file:../../icons/logo_dark.svg' },
    group: ['input'],
    description: 'Find professional email addresses using the Scalelist API',
    subtitle: '={{$parameter["first_name"] + " " + $parameter["last_name"]}}',
    defaults: {
      name: 'Scalelist',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'scalelistApi',
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
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const firstName = this.getNodeParameter('first_name', i, '') as string;
        const lastName = this.getNodeParameter('last_name', i, '') as string;
        const companyName = this.getNodeParameter('company_name', i, '') as string;
        const companyDomain = this.getNodeParameter('company_domain', i, '') as string;

        const qs: Record<string, string> = {
          first_name: firstName,
          last_name: lastName,
        };
        if (companyName) {
          qs.company_name = companyName;
        }
        if (companyDomain) {
          qs.company_website = companyDomain;
        }

        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scalelistApi', {
          baseURL: SCALELIST_API_URL,
          url: '/api/ext/finder/email',
          method: 'GET',
          qs,
        });
        // Example: simulate sending to your API
        const obj = {
          success: true,
          data: {
            email: response.email,
            status: response.status,
          },
        };

        returnData.push({ json: obj, pairedItem: { item: i } });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
        } else {
          throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
        }
      }
    }

    return [returnData];
  }
}