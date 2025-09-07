export interface ISystemAuthenticationConfig {
  Authentication: Authentication;
  OAuth: Oauth;
  Bipo: Bipo;
}

export interface Authentication {
  EInvoiceApiKey: string;
  AccessTokenExpiration: number;
  RefreshTokenExpiration: number;
  ValidateIssuer: boolean;
  ValidateAudience: boolean;
  ValidateLifetime: boolean;
  ValidateIssuerSigningKey: boolean;
  TokenType: string;
  Audience: string;
  ClientId: string;
  SecretKey: string;
  Issuer: string;
  Issuers: string;
  Audiences: string;
  RequireUniqueEmail: boolean;
  RequireConfirmedEmail: boolean;
  ConfirmedEmailUrl: string;
  ConfirmedEmailUrlSuccess: string;
  ConfirmedEmailUrlFail: string;
  TokenLifespan: number;
  Facebook: Facebook;
  Google: Google;
  Microsoft: Microsoft;
  Twitter: Twitter;
  AzureAd: AzureAd;
}

export interface Facebook {
  AppId: string;
  AppSecret: string;
}

export interface Google {
  AppId: string;
  AppSecret: string;
}

export interface Microsoft {
  AppId: string;
  AppSecret: string;
}

export interface Twitter {
  AppId: string;
  AppSecret: string;
}

export interface AzureAd {
  Instance: string;
  ClientId: string;
  TenantId: string;
  Scopes: string;
}

export interface Oauth {
  Endpoint: string;
  ClientId: string;
  ClientSecret: string;
  GrantType: string;
  Scope: string[];
}

export interface Bipo {
  endpoint: string;
  username: string;
  password: string;
  grantType: string;
  client_id: string;
  client_secret: string;
}
