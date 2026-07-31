# n8n-nodes-scalelist

This is an [n8n](https://n8n.io/) community node that lets you find professional email addresses using the [Scalelist](https://scalelist.com/) API directly inside your n8n workflows.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Usage example](#usage-example)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In self-hosted n8n:

1. Go to **Settings → Community Nodes**.
2. Click **Install**.
3. Enter `n8n-nodes-scalelist` and confirm.

## Credentials

You need a Scalelist API key to use this node.

1. Sign in at [app.scalelist.com](https://app.scalelist.com/).
2. Open the API key page: [app.scalelist.com/app/api-key](https://app.scalelist.com/app/api-key).
3. Click **Generate API Key** (or copy an existing one).
4. In n8n, create a new credential of type **Scalelist API Key API** and paste the key into the **Scalelist API Key** field.
5. Save. The credential test hits `GET /api/ext/me` to verify the key.

The API key is sent as the `X-API-Key` HTTP header on every request.

## Operations

### Email Finder

Finds a professional email address for a prospect based on their name and company.

**Parameters:**

| Field            | Required | Description                                                    |
|------------------|----------|----------------------------------------------------------------|
| First Name       | Yes      | Prospect's first name (e.g. `John`)                            |
| Last Name        | Yes      | Prospect's last name (e.g. `Doe`)                              |
| Company Name     | No       | Prospect's company name (e.g. `Google`)                        |
| Company Website  | No       | Prospect's company domain (e.g. `google.com`)                  |

At least one of **Company Name** or **Company Website** should be provided for best results.

## Usage example

**Input:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "company_name": "Google",
  "company_domain": "google.com"
}
```

**Output:**

```json
{
  "success": true,
  "data": {
    "email": "john.doe@google.com",
    "status": "valid"
  }
}
```

The `status` field indicates the deliverability confidence returned by the Scalelist API (for example `valid`, `catch_all`, or `invalid`).

## Compatibility

- n8n: 0.111.0 or later

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Scalelist](https://scalelist.com/)
- [Scalelist API key](https://app.scalelist.com/app/api-key)
- [Scalelist help center](https://intercom.help/scalelist/en/collections/12728118-general)
