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
    description: 'Find professional email addresses and mobile phone numbers using the Scalelist API',
    subtitle: '={{$parameter["operation"]}}',
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
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Find Email',
            value: 'findEmail',
            description: 'Find the work email address for a person',
            action: 'Find email',
          },
          {
            name: 'Find Phone',
            value: 'findPhone',
            description: 'Find the mobile phone number for a person',
            action: 'Find phone',
          },
        ],
        default: 'findEmail',
      },

      // ---------- Find Email fields ----------
      {
        displayName: 'First Name',
        name: 'first_name',
        type: 'string',
        default: '',
        placeholder: 'John',
        description: 'First name of the prospect',
        required: true,
        displayOptions: { show: { operation: ['findEmail'] } },
      },
      {
        displayName: 'Last Name',
        name: 'last_name',
        type: 'string',
        default: '',
        placeholder: 'Doe',
        description: 'Last name of the prospect',
        required: true,
        displayOptions: { show: { operation: ['findEmail'] } },
      },
      {
        displayName: 'Company Name',
        name: 'company_name',
        type: 'string',
        default: '',
        placeholder: 'Google',
        description: 'Company name of the prospect',
        displayOptions: { show: { operation: ['findEmail'] } },
      },
      {
        displayName: 'Company Website',
        name: 'company_domain',
        type: 'string',
        default: '',
        placeholder: 'google.com',
        description: 'Company website of the prospect (preferred over Company Name for accuracy)',
        hint: 'Company website of prospect.',
        displayOptions: { show: { operation: ['findEmail'] } },
      },

      // ---------- Find Phone fields ----------
      {
        displayName: 'LinkedIn Profile URL',
        name: 'linkedin_profile_url',
        type: 'string',
        default: '',
        placeholder: 'https://www.linkedin.com/in/johndoe',
        description: 'Full LinkedIn profile URL — most accurate input',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'LinkedIn ID',
        name: 'linkedin_id',
        type: 'string',
        default: '',
        description: 'LinkedIn numeric ID — most accurate',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'Full Name',
        name: 'full_name',
        type: 'string',
        default: '',
        placeholder: 'John Doe',
        description: 'Full name of the prospect',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'First Name',
        name: 'first_name_phone',
        type: 'string',
        default: '',
        placeholder: 'John',
        description: 'First name of the prospect',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'Last Name',
        name: 'last_name_phone',
        type: 'string',
        default: '',
        placeholder: 'Doe',
        description: 'Last name of the prospect',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        placeholder: 'john@google.com',
        description: 'Email address — improves match accuracy',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'Company Name',
        name: 'company_name_phone',
        type: 'string',
        default: '',
        placeholder: 'Google',
        description: 'Company name of the prospect',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'Company Website',
        name: 'company_website_phone',
        type: 'string',
        default: '',
        placeholder: 'google.com',
        description: 'Company website of the prospect',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'Job Title',
        name: 'job_title',
        type: 'string',
        default: '',
        placeholder: 'Marketing Manager',
        description: 'Job title — improves match accuracy',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        placeholder: 'San Francisco',
        description: 'City — improves match accuracy',
        displayOptions: { show: { operation: ['findPhone'] } },
      },
    ],
		usableAsTool: true,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i) as string;

        let url: string;
        const qs: Record<string, string> = {};

        if (operation === 'findEmail') {
          url = '/api/ext/finder/email';
          const firstName = this.getNodeParameter('first_name', i, '') as string;
          const lastName = this.getNodeParameter('last_name', i, '') as string;
          const companyName = this.getNodeParameter('company_name', i, '') as string;
          const companyDomain = this.getNodeParameter('company_domain', i, '') as string;

          qs.first_name = firstName;
          qs.last_name = lastName;
          if (companyName) qs.company_name = companyName;
          if (companyDomain) qs.company_website = companyDomain;
        } else if (operation === 'findPhone') {
          url = '/api/ext/finder/phone';
          const linkedinProfileUrl = this.getNodeParameter('linkedin_profile_url', i, '') as string;
          const linkedinId = this.getNodeParameter('linkedin_id', i, '') as string;
          const fullName = this.getNodeParameter('full_name', i, '') as string;
          const firstName = this.getNodeParameter('first_name_phone', i, '') as string;
          const lastName = this.getNodeParameter('last_name_phone', i, '') as string;
          const email = this.getNodeParameter('email', i, '') as string;
          const companyName = this.getNodeParameter('company_name_phone', i, '') as string;
          const companyWebsite = this.getNodeParameter('company_website_phone', i, '') as string;
          const jobTitle = this.getNodeParameter('job_title', i, '') as string;
          const city = this.getNodeParameter('city', i, '') as string;

          if (linkedinProfileUrl) qs.linkedin_profile_url = linkedinProfileUrl;
          if (linkedinId) qs.linkedin_id = linkedinId;
          if (fullName) qs.full_name = fullName;
          if (firstName) qs.first_name = firstName;
          if (lastName) qs.last_name = lastName;
          if (email) qs.email = email;
          if (companyName) qs.company_name = companyName;
          if (companyWebsite) qs.company_website = companyWebsite;
          if (jobTitle) qs.job_title = jobTitle;
          if (city) qs.city = city;
        } else {
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
        }

        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scalelistApi', {
          baseURL: SCALELIST_API_URL,
          url,
          method: 'GET',
          qs,
        });

        returnData.push({ json: response, pairedItem: { item: i } });
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
