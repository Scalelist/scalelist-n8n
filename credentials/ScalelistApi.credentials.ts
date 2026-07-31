import {
  IAuthenticateGeneric,
  Icon,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties
} from 'n8n-workflow';
import { SCALELIST_API_URL } from '../config'
export class ScalelistApi implements ICredentialType {
  name = 'scalelistApi';
  displayName = 'Scalelist API Key API';
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
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}'
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
