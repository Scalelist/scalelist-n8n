import { IAuthenticateGeneric, Icon, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class ScalelistApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
