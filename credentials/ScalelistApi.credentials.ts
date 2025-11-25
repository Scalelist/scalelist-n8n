import {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties
} from 'n8n-workflow';
import { SCALELIST_API_URL } from '../config'
export class ScalelistApi implements ICredentialType {
  name = 'ScalelistApi';
  displayName = 'Scalelist API Key API';
  // Uses the link to this tutorial as an example
  // Replace with your own docs links when building your own nodes
  documentationUrl = 'https://app.scalelist.com/app/api-key';

  icon: Icon = { light: 'file:../icons/logo.svg', dark: 'file:../icons/logo_dark.svg' };

  properties: INodeProperties[] = [
    {
      displayName: 'Scalelist API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      typeOptions: { password: true }
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      qs: {
        'x_api_key': '={{$credentials.apiKey}}'
      }
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: SCALELIST_API_URL,
      url: '/api/ext/me',
      method: 'GET',
    },
  };
}
