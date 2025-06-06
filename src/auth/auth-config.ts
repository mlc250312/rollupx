/*!
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as validator from '../utils/validator';
import { deepCopy } from '../utils/deep-copy';
import { AuthClientErrorCode, FirebaseAuthError } from '../utils/error';

/**
 * Interface representing base properties of a user-enrolled second factor for a
 * `CreateRequest`.
 */
export interface BaseCreateMultiFactorInfoRequest {

  /**
   * The optional display name for an enrolled second factor.
   */
  displayName?: string;

  /**
   * The type identifier of the second factor. For SMS second factors, this is `phone`.
   */
  factorId: string;
}

/**
 * Interface representing a phone specific user-enrolled second factor for a
 * `CreateRequest`.
 */
export interface CreatePhoneMultiFactorInfoRequest extends BaseCreateMultiFactorInfoRequest {

  /**
   * The phone number associated with a phone second factor.
   */
  phoneNumber: string;
}

/**
 * Type representing the properties of a user-enrolled second factor
 * for a `CreateRequest`.
 */
export type CreateMultiFactorInfoRequest = | CreatePhoneMultiFactorInfoRequest;

/**
 * Interface representing common properties of a user-enrolled second factor
 * for an `UpdateRequest`.
 */
export interface BaseUpdateMultiFactorInfoRequest {

  /**
   * The ID of the enrolled second factor. This ID is unique to the user. When not provided,
   * a new one is provisioned by the Auth server.
   */
  uid?: string;

  /**
   * The optional display name for an enrolled second factor.
   */
  displayName?: string;

  /**
   * The optional date the second factor was enrolled, formatted as a UTC string.
   */
  enrollmentTime?: string;

  /**
   * The type identifier of the second factor. For SMS second factors, this is `phone`.
   */
  factorId: string;
}

/**
 * Interface representing a phone specific user-enrolled second factor
 * for an `UpdateRequest`.
 */
export interface UpdatePhoneMultiFactorInfoRequest extends BaseUpdateMultiFactorInfoRequest {

  /**
   * The phone number associated with a phone second factor.
   */
  phoneNumber: string;
}

/**
 * Type representing the properties of a user-enrolled second factor
 * for an `UpdateRequest`.
 */
export type UpdateMultiFactorInfoRequest = | UpdatePhoneMultiFactorInfoRequest;

/**
 * The multi-factor related user settings for create operations.
 */
export interface MultiFactorCreateSettings {

  /**
   * The created user's list of enrolled second factors.
   */
  enrolledFactors: CreateMultiFactorInfoRequest[];
}

/**
 * The multi-factor related user settings for update operations.
 */
export interface MultiFactorUpdateSettings {

  /**
   * The updated list of enrolled second factors. The provided list overwrites the user's
   * existing list of second factors.
   * When null is passed, all of the user's existing second factors are removed.
   */
  enrolledFactors: UpdateMultiFactorInfoRequest[] | null;
}

/**
 * Interface representing the properties to update on the provided user.
 */
export interface UpdateRequest {

  /**
   * Whether or not the user is disabled: `true` for disabled;
   * `false` for enabled.
   */
  disabled?: boolean;

  /**
   * The user's display name.
   */
  displayName?: string | null;

  /**
   * The user's primary email.
   */
  email?: string;

  /**
   * Whether or not the user's primary email is verified.
   */
  emailVerified?: boolean;

  /**
   * The user's unhashed password.
   */
  password?: string;

  /**
   * The user's primary phone number.
   */
  phoneNumber?: string | null;

  /**
   * The user's photo URL.
   */
  photoURL?: string | null;

  /**
   * The user's updated multi-factor related properties.
   */
  multiFactor?: MultiFactorUpdateSettings;

  /**
   * Links this user to the specified provider.
   *
   * Linking a provider to an existing user account does not invalidate the
   * refresh token of that account. In other words, the existing account
   * would continue to be able to access resources, despite not having used
   * the newly linked provider to log in. If you wish to force the user to
   * authenticate with this new provider, you need to (a) revoke their
   * refresh token (see
   * https://firebase.google.com/docs/auth/admin/manage-sessions#revoke_refresh_tokens),
   * and (b) ensure no other authentication methods are present on this
   * account.
   */
  providerToLink?: UserProvider;

  /**
   * Unlinks this user from the specified providers.
   */
  providersToUnlink?: string[];
}

/**
 * Represents a user identity provider that can be associated with a Firebase user.
 */
export interface UserProvider {

  /**
   * The user identifier for the linked provider.
   */
  uid?: string;

  /**
   * The display name for the linked provider.
   */
  displayName?: string;

  /**
   * The email for the linked provider.
   */
  email?: string;

  /**
   * The phone number for the linked provider.
   */
  phoneNumber?: string;

  /**
   * The photo URL for the linked provider.
   */
  photoURL?: string;

  /**
   * The linked provider ID (for example, "google.com" for the Google provider).
   */
  providerId?: string;
}


/**
 * Interface representing the properties to set on a new user record to be
 * created.
 */
export interface CreateRequest extends UpdateRequest {

  /**
   * The user's `uid`.
   */
  uid?: string;

  /**
   * The user's multi-factor related properties.
   */
  multiFactor?: MultiFactorCreateSettings;
}

/**
 * The response interface for listing provider configs. This is only available
 * when listing all identity providers' configurations via
 * {@link BaseAuth.listProviderConfigs}.
 */
export interface ListProviderConfigResults {

  /**
   * The list of providers for the specified type in the current page.
   */
  providerConfigs: AuthProviderConfig[];

  /**
   * The next page token, if available.
   */
  pageToken?: string;
}

/**
 * The filter interface used for listing provider configurations. This is used
 * when specifying how to list configured identity providers via
 * {@link BaseAuth.listProviderConfigs}.
 */
export interface AuthProviderConfigFilter {

  /**
   * The Auth provider configuration filter. This can be either `saml` or `oidc`.
   * The former is used to look up SAML providers only, while the latter is used
   * for OIDC providers.
   */
  type: 'saml' | 'oidc';

  /**
   * The maximum number of results to return per page. The default and maximum is
   * 100.
   */
  maxResults?: number;

  /**
   * The next page token. When not specified, the lookup starts from the beginning
   * of the list.
   */
  pageToken?: string;
}

/**
 * The request interface for updating a SAML Auth provider. This is used
 * when updating a SAML provider's configuration via
 * {@link BaseAuth.updateProviderConfig}.
 */
export interface SAMLUpdateAuthProviderRequest {

  /**
   * The SAML provider's updated display name. If not provided, the existing
   * configuration's value is not modified.
   */
  displayName?: string;

  /**
   * Whether the SAML provider is enabled or not. If not provided, the existing
   * configuration's setting is not modified.
   */
  enabled?: boolean;

  /**
   * The SAML provider's updated IdP entity ID. If not provided, the existing
   * configuration's value is not modified.
   */
  idpEntityId?: string;

  /**
   * The SAML provider's updated SSO URL. If not provided, the existing
   * configuration's value is not modified.
   */
  ssoURL?: string;

  /**
   * The SAML provider's updated list of X.509 certificated. If not provided, the
   * existing configuration list is not modified.
   */
  x509Certificates?: string[];

  /**
   * The SAML provider's updated RP entity ID. If not provided, the existing
   * configuration's value is not modified.
   */
  rpEntityId?: string;

  /**
   * The SAML provider's callback URL. If not provided, the existing
   * configuration's value is not modified.
   */
  callbackURL?: string;
}

/**
 * The request interface for updating an OIDC Auth provider. This is used
 * when updating an OIDC provider's configuration via
 * {@link BaseAuth.updateProviderConfig}.
 */
export interface OIDCUpdateAuthProviderRequest {

  /**
   * The OIDC provider's updated display name. If not provided, the existing
   * configuration's value is not modified.
   */
  displayName?: string;

  /**
   * Whether the OIDC provider is enabled or not. If not provided, the existing
   * configuration's setting is not modified.
   */
  enabled?: boolean;

  /**
   * The OIDC provider's updated client ID. If not provided, the existing
   * configuration's value is not modified.
   */
  clientId?: string;

  /**
   * The OIDC provider's updated issuer. If not provided, the existing
   * configuration's value is not modified.
   */
  issuer?: string;

  /**
   * The OIDC provider's client secret to enable OIDC code flow.
   * If not provided, the existing configuration's value is not modified.
   */
  clientSecret?: string;

  /**
   * The OIDC provider's response object for OAuth authorization flow.
   */
  responseType?: OAuthResponseType;
}

export type UpdateAuthProviderRequest =
  SAMLUpdateAuthProviderRequest | OIDCUpdateAuthProviderRequest;

/** A maximum of 10 test phone number / code pairs can be configured. */
export const MAXIMUM_TEST_PHONE_NUMBERS = 10;

/** The server side SAML configuration request interface. */
export interface SAMLConfigServerRequest {
  idpConfig?: {
    idpEntityId?: string;
    ssoUrl?: string;
    idpCertificates?: Array<{
      x509Certificate: string;
    }>;
    signRequest?: boolean;
  };
  spConfig?: {
    spEntityId?: string;
    callbackUri?: string;
  };
  displayName?: string;
  enabled?: boolean;
  [key: string]: any;
}

/** The server side SAML configuration response interface. */
export interface SAMLConfigServerResponse {
  // Used when getting config.
  // projects/${projectId}/inboundSamlConfigs/${providerId}
  name?: string;
  idpConfig?: {
    idpEntityId?: string;
    ssoUrl?: string;
    idpCertificates?: Array<{
      x509Certificate: string;
    }>;
    signRequest?: boolean;
  };
  spConfig?: {
    spEntityId?: string;
    callbackUri?: string;
  };
  displayName?: string;
  enabled?: boolean;
}

/** The server side OIDC configuration request interface. */
export interface OIDCConfigServerRequest {
  clientId?: string;
  issuer?: string;
  displayName?: string;
  enabled?: boolean;
  clientSecret?: string;
  responseType?: OAuthResponseType;
  [key: string]: any;
}

/** The server side OIDC configuration response interface. */
export interface OIDCConfigServerResponse {
  // Used when getting config.
  // projects/${projectId}/oauthIdpConfigs/${providerId}
  name?: string;
  clientId?: string;
  issuer?: string;
  displayName?: string;
  enabled?: boolean;
  clientSecret?: string;
  responseType?: OAuthResponseType;
}

/** The server side email configuration request interface. */
export interface EmailSignInConfigServerRequest {
  allowPasswordSignup?: boolean;
  enableEmailLinkSignin?: boolean;
}

/** Identifies the server side second factor type. */
type AuthFactorServerType = 'PHONE_SMS';

/** Client Auth factor type to server auth factor type mapping. */
const AUTH_FACTOR_CLIENT_TO_SERVER_TYPE: {[key: string]: AuthFactorServerType} = {
  phone: 'PHONE_SMS',
};

/** Server Auth factor type to client auth factor type mapping. */
const AUTH_FACTOR_SERVER_TO_CLIENT_TYPE: {[key: string]: AuthFactorType} =
  Object.keys(AUTH_FACTOR_CLIENT_TO_SERVER_TYPE)
    .reduce((res: {[key: string]: AuthFactorType}, key) => {
      res[AUTH_FACTOR_CLIENT_TO_SERVER_TYPE[key]] = key as AuthFactorType;
      return res;
    }, {});

/** Server side multi-factor configuration. */
export interface MultiFactorAuthServerConfig {
  state?: MultiFactorConfigState;
  enabledProviders?: AuthFactorServerType[];
  providerConfigs?: MultiFactorProviderConfig[];
}

/**
 * Identifies a second factor type.
 */
export type AuthFactorType = 'phone';

/**
 * Identifies a multi-factor configuration state.
 */
export type MultiFactorConfigState = 'ENABLED' | 'DISABLED';

/**
 * Interface representing a multi-factor configuration.
 * This can be used to define whether multi-factor authentication is enabled
 * or disabled and the list of second factor challenges that are supported.
 */
export interface MultiFactorConfig {
  /**
   * The multi-factor config state.
   */
  state: MultiFactorConfigState;

  /**
   * The list of identifiers for enabled second factors.
   * Currently only ‘phone’ is supported.
   */
  factorIds?: AuthFactorType[];

  /**
   * A list of multi-factor provider configurations. 
   * MFA providers (except phone) indicate whether they're enabled through this field.   */
  providerConfigs?: MultiFactorProviderConfig[];
}

/**
 * Interface representing a multi-factor auth provider configuration. 
 * This interface is used for second factor auth providers other than SMS. 
 * Currently, only TOTP is supported.
 */export interface MultiFactorProviderConfig {
  /**
   * Indicates whether this multi-factor provider is enabled or disabled.    */
  state: MultiFactorConfigState;
  /**
   * TOTP multi-factor provider config.   */
  totpProviderConfig?: TotpMultiFactorProviderConfig;
}

/**
 * Interface representing configuration settings for TOTP second factor auth. 
 */
export interface TotpMultiFactorProviderConfig {
  /**
    *  The allowed number of adjacent intervals that will be used for verification
    *  to compensate for clock skew.   */
  adjacentIntervals?: number;
}

/**
 * Defines the multi-factor config class used to convert client side MultiFactorConfig
 * to a format that is understood by the Auth server.
 * 
 * @internal
 */
export class MultiFactorAuthConfig implements MultiFactorConfig {

  /**
   * The multi-factor config state.
   */
  public readonly state: MultiFactorConfigState;
  /**
   * The list of identifiers for enabled second factors.
   * Currently only ‘phone’ is supported.
   */
  public readonly factorIds: AuthFactorType[];
  /**
   * A list of multi-factor provider specific config. 
   * New MFA providers (except phone) will indicate enablement/disablement through this field.
   */
  public readonly providerConfigs: MultiFactorProviderConfig[];

  /**
   * Static method to convert a client side request to a MultiFactorAuthServerConfig.
   * Throws an error if validation fails.
   *
   * @param options - The options object to convert to a server request.
   * @returns The resulting server request.
   * @internal
   */
  public static buildServerRequest(options: MultiFactorConfig): MultiFactorAuthServerConfig {
    const request: MultiFactorAuthServerConfig = {};
    MultiFactorAuthConfig.validate(options);
    if (Object.prototype.hasOwnProperty.call(options, 'state')) {
      request.state = options.state;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'factorIds')) {
      (options.factorIds || []).forEach((factorId) => {
        if (typeof request.enabledProviders === 'undefined') {
          request.enabledProviders = [];
        }
        request.enabledProviders.push(AUTH_FACTOR_CLIENT_TO_SERVER_TYPE[factorId]);
      });
      // In case an empty array is passed. Ensure it gets populated so the array is cleared.
      if (options.factorIds && options.factorIds.length === 0) {
        request.enabledProviders = [];
      }
    }
    if (Object.prototype.hasOwnProperty.call(options, 'providerConfigs')) {
      request.providerConfigs = options.providerConfigs;
    }
    return request;
  }

  /**
   * Validates the MultiFactorConfig options object. Throws an error on failure.
   *
   * @param options - The options object to validate.
   */
  public static validate(options: MultiFactorConfig): void {
    const validKeys = {
      state: true,
      factorIds: true,
      providerConfigs: true,
    };
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"MultiFactorConfig" must be a non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid MultiFactorConfig parameter.`,
        );
      }
    }
    // Validate content.
    if (typeof options.state !== 'undefined' &&
        options.state !== 'ENABLED' &&
        options.state !== 'DISABLED') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"MultiFactorConfig.state" must be either "ENABLED" or "DISABLED".',
      );
    }

    if (typeof options.factorIds !== 'undefined') {
      if (!validator.isArray(options.factorIds)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"MultiFactorConfig.factorIds" must be an array of valid "AuthFactorTypes".',
        );
      }

      // Validate content of array.
      options.factorIds.forEach((factorId) => {
        if (typeof AUTH_FACTOR_CLIENT_TO_SERVER_TYPE[factorId] === 'undefined') {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            `"${factorId}" is not a valid "AuthFactorType".`,
          );
        }
      });
    }

    if (typeof options.providerConfigs !== 'undefined') {
      if (!validator.isArray(options.providerConfigs)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"MultiFactorConfig.providerConfigs" must be an array of valid "MultiFactorProviderConfig."',
        );
      }
      //Validate content of array.
      options.providerConfigs.forEach((multiFactorProviderConfig) => {
        if (typeof multiFactorProviderConfig === 'undefined' || !validator.isObject(multiFactorProviderConfig)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            `"${multiFactorProviderConfig}" is not a valid "MultiFactorProviderConfig" type.`
          )
        }
        const validProviderConfigKeys = {
          state: true,
          totpProviderConfig: true,
        };
        for (const key in multiFactorProviderConfig) {
          if (!(key in validProviderConfigKeys)) {
            throw new FirebaseAuthError(
              AuthClientErrorCode.INVALID_CONFIG,
              `"${key}" is not a valid ProviderConfig parameter.`,
            );
          }
        }
        if (typeof multiFactorProviderConfig.state === 'undefined' ||
          (multiFactorProviderConfig.state !== 'ENABLED' &&
            multiFactorProviderConfig.state !== 'DISABLED')) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            '"MultiFactorConfig.providerConfigs.state" must be either "ENABLED" or "DISABLED".',
          )
        }
        // Since TOTP is the only provider config available right now, not defining it will lead into an error
        if (typeof multiFactorProviderConfig.totpProviderConfig === 'undefined') {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            '"MultiFactorConfig.providerConfigs.totpProviderConfig" must be defined.'
          )
        }
        const validTotpProviderConfigKeys = {
          adjacentIntervals: true,
        };
        for (const key in multiFactorProviderConfig.totpProviderConfig) {
          if (!(key in validTotpProviderConfigKeys)) {
            throw new FirebaseAuthError(
              AuthClientErrorCode.INVALID_CONFIG,
              `"${key}" is not a valid TotpProviderConfig parameter.`,
            );
          }
        }
        const adjIntervals = multiFactorProviderConfig.totpProviderConfig.adjacentIntervals
        if (typeof adjIntervals !== 'undefined' &&
          (!Number.isInteger(adjIntervals) || adjIntervals < 0 || adjIntervals > 10)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_ARGUMENT,
            '"MultiFactorConfig.providerConfigs.totpProviderConfig.adjacentIntervals" must' +
            ' be a valid number between 0 and 10 (both inclusive).'
          )
        }
      });
    }
  }

  /**
   * The MultiFactorAuthConfig constructor.
   *
   * @param response - The server side response used to initialize the
   *     MultiFactorAuthConfig object.
   * @constructor
   * @internal
   */
  constructor(response: MultiFactorAuthServerConfig) {
    if (typeof response.state === 'undefined') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid multi-factor configuration response');
    }
    this.state = response.state;
    this.factorIds = [];
    (response.enabledProviders || []).forEach((enabledProvider) => {
      // Ignore unsupported types. It is possible the current admin SDK version is
      // not up to date and newer backend types are supported.
      if (typeof AUTH_FACTOR_SERVER_TO_CLIENT_TYPE[enabledProvider] !== 'undefined') {
        this.factorIds.push(AUTH_FACTOR_SERVER_TO_CLIENT_TYPE[enabledProvider]);
      }
    })
    this.providerConfigs = [];
    (response.providerConfigs || []).forEach((providerConfig) => {
      if (typeof providerConfig !== 'undefined') {
        if (typeof providerConfig.state === 'undefined' ||
          typeof providerConfig.totpProviderConfig === 'undefined' ||
          (typeof providerConfig.totpProviderConfig.adjacentIntervals !== 'undefined' &&
            typeof providerConfig.totpProviderConfig.adjacentIntervals !== 'number')) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INTERNAL_ERROR,
            'INTERNAL ASSERT FAILED: Invalid multi-factor configuration response');
        }
        this.providerConfigs.push(providerConfig);
      }
    })
  }

  /** Converts MultiFactorConfig to JSON object
   * @returns The plain object representation of the multi-factor config instance. */
  public toJSON(): object {
    return {
      state: this.state,
      factorIds: this.factorIds,
      providerConfigs: this.providerConfigs,
    };
  }
}


/**
 * Validates the provided map of test phone number / code pairs.
 * @param testPhoneNumbers - The phone number / code pairs to validate.
 */
export function validateTestPhoneNumbers(
  testPhoneNumbers: {[phoneNumber: string]: string},
): void {
  if (!validator.isObject(testPhoneNumbers)) {
    throw new FirebaseAuthError(
      AuthClientErrorCode.INVALID_ARGUMENT,
      '"testPhoneNumbers" must be a map of phone number / code pairs.',
    );
  }
  if (Object.keys(testPhoneNumbers).length > MAXIMUM_TEST_PHONE_NUMBERS) {
    throw new FirebaseAuthError(AuthClientErrorCode.MAXIMUM_TEST_PHONE_NUMBER_EXCEEDED);
  }
  for (const phoneNumber in testPhoneNumbers) {
    // Validate phone number.
    if (!validator.isPhoneNumber(phoneNumber)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_TESTING_PHONE_NUMBER,
        `"${phoneNumber}" is not a valid E.164 standard compliant phone number.`
      );
    }

    // Validate code.
    if (!validator.isString(testPhoneNumbers[phoneNumber]) ||
        !/^[\d]{6}$/.test(testPhoneNumbers[phoneNumber])) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_TESTING_PHONE_NUMBER,
        `"${testPhoneNumbers[phoneNumber]}" is not a valid 6 digit code string.`
      );
    }
  }
}

/**
 * The email sign in provider configuration.
 */
export interface EmailSignInProviderConfig {
  /**
   * Whether email provider is enabled.
   */
  enabled: boolean;

  /**
   * Whether password is required for email sign-in. When not required,
   * email sign-in can be performed with password or via email link sign-in.
   */
  passwordRequired?: boolean; // In the backend API, default is true if not provided
}


/**
 * Defines the email sign-in config class used to convert client side EmailSignInConfig
 * to a format that is understood by the Auth server.
 *
 * @internal
 */
export class EmailSignInConfig implements EmailSignInProviderConfig {
  public readonly enabled: boolean;
  public readonly passwordRequired?: boolean;

  /**
   * Static method to convert a client side request to a EmailSignInConfigServerRequest.
   * Throws an error if validation fails.
   *
   * @param options - The options object to convert to a server request.
   * @returns The resulting server request.
   * @internal
   */
  public static buildServerRequest(options: EmailSignInProviderConfig): EmailSignInConfigServerRequest {
    const request: EmailSignInConfigServerRequest = {};
    EmailSignInConfig.validate(options);
    if (Object.prototype.hasOwnProperty.call(options, 'enabled')) {
      request.allowPasswordSignup = options.enabled;
    }
    if (Object.prototype.hasOwnProperty.call(options, 'passwordRequired')) {
      request.enableEmailLinkSignin = !options.passwordRequired;
    }
    return request;
  }

  /**
   * Validates the EmailSignInConfig options object. Throws an error on failure.
   *
   * @param options - The options object to validate.
   */
  private static validate(options: EmailSignInProviderConfig): void {
    // TODO: Validate the request.
    const validKeys = {
      enabled: true,
      passwordRequired: true,
    };
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_ARGUMENT,
        '"EmailSignInConfig" must be a non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_ARGUMENT,
          `"${key}" is not a valid EmailSignInConfig parameter.`,
        );
      }
    }
    // Validate content.
    if (typeof options.enabled !== 'undefined' &&
        !validator.isBoolean(options.enabled)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_ARGUMENT,
        '"EmailSignInConfig.enabled" must be a boolean.',
      );
    }
    if (typeof options.passwordRequired !== 'undefined' &&
        !validator.isBoolean(options.passwordRequired)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_ARGUMENT,
        '"EmailSignInConfig.passwordRequired" must be a boolean.',
      );
    }
  }

  /**
   * The EmailSignInConfig constructor.
   *
   * @param response - The server side response used to initialize the
   *     EmailSignInConfig object.
   * @constructor
   */
  constructor(response: {[key: string]: any}) {
    if (typeof response.allowPasswordSignup === 'undefined') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid email sign-in configuration response');
    }
    this.enabled = response.allowPasswordSignup;
    this.passwordRequired = !response.enableEmailLinkSignin;
  }

  /** @returns The plain object representation of the email sign-in config. */
  public toJSON(): object {
    return {
      enabled: this.enabled,
      passwordRequired: this.passwordRequired,
    };
  }
}

/**
 * The base Auth provider configuration interface.
 */
export interface BaseAuthProviderConfig {

  /**
   * The provider ID defined by the developer.
   * For a SAML provider, this is always prefixed by `saml.`.
   * For an OIDC provider, this is always prefixed by `oidc.`.
   */
  providerId: string;

  /**
   * The user-friendly display name to the current configuration. This name is
   * also used as the provider label in the Cloud Console.
   */
  displayName?: string;

  /**
   * Whether the provider configuration is enabled or disabled. A user
   * cannot sign in using a disabled provider.
   */
  enabled: boolean;
}

/**
 * The
 * [SAML](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
 * Auth provider configuration interface. A SAML provider can be created via
 * {@link BaseAuth.createProviderConfig}.
 */
export interface SAMLAuthProviderConfig extends BaseAuthProviderConfig {

  /**
   * The SAML IdP entity identifier.
   */
  idpEntityId: string;

  /**
   * The SAML IdP SSO URL. This must be a valid URL.
   */
  ssoURL: string;

  /**
   * The list of SAML IdP X.509 certificates issued by CA for this provider.
   * Multiple certificates are accepted to prevent outages during
   * IdP key rotation (for example ADFS rotates every 10 days). When the Auth
   * server receives a SAML response, it will match the SAML response with the
   * certificate on record. Otherwise the response is rejected.
   * Developers are expected to manage the certificate updates as keys are
   * rotated.
   */
  x509Certificates: string[];

  /**
   * The SAML relying party (service provider) entity ID.
   * This is defined by the developer but needs to be provided to the SAML IdP.
   */
  rpEntityId: string;

  /**
   * This is fixed and must always be the same as the OAuth redirect URL
   * provisioned by Firebase Auth,
   * `https://project-id.firebaseapp.com/__/auth/handler` unless a custom
   * `authDomain` is used.
   * The callback URL should also be provided to the SAML IdP during
   * configuration.
   */
  callbackURL?: string;
}

/**
 * The interface representing OIDC provider's response object for OAuth
 * authorization flow.
 * One of the following settings is required:
 * <ul>
 * <li>Set <code>code</code> to <code>true</code> for the code flow.</li>
 * <li>Set <code>idToken</code> to <code>true</code> for the ID token flow.</li>
 * </ul>
 */
export interface OAuthResponseType {
  /**
   * Whether ID token is returned from IdP's authorization endpoint.
   */
  idToken?: boolean;

  /**
   * Whether authorization code is returned from IdP's authorization endpoint.
   */
  code?: boolean;
}

/**
 * The [OIDC](https://openid.net/specs/openid-connect-core-1_0-final.html) Auth
 * provider configuration interface. An OIDC provider can be created via
 * {@link BaseAuth.createProviderConfig}.
 */
export interface OIDCAuthProviderConfig extends BaseAuthProviderConfig {

  /**
   * This is the required client ID used to confirm the audience of an OIDC
   * provider's
   * [ID token](https://openid.net/specs/openid-connect-core-1_0-final.html#IDToken).
   */
  clientId: string;

  /**
   * This is the required provider issuer used to match the provider issuer of
   * the ID token and to determine the corresponding OIDC discovery document, eg.
   * [`/.well-known/openid-configuration`](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig).
   * This is needed for the following:
   * <ul>
   * <li>To verify the provided issuer.</li>
   * <li>Determine the authentication/authorization endpoint during the OAuth
   *     `id_token` authentication flow.</li>
   * <li>To retrieve the public signing keys via `jwks_uri` to verify the OIDC
   *     provider's ID token's signature.</li>
   * <li>To determine the claims_supported to construct the user attributes to be
   *     returned in the additional user info response.</li>
   * </ul>
   * ID token validation will be performed as defined in the
   * [spec](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).
   */
  issuer: string;

  /**
   * The OIDC provider's client secret to enable OIDC code flow.
   */
  clientSecret?: string;

  /**
   * The OIDC provider's response object for OAuth authorization flow.
   */
  responseType?: OAuthResponseType;
}

/**
 * The Auth provider configuration type.
 * {@link BaseAuth.createProviderConfig}.
 */
export type AuthProviderConfig = SAMLAuthProviderConfig | OIDCAuthProviderConfig;

/**
 * Defines the SAMLConfig class used to convert a client side configuration to its
 * server side representation.
 *
 * @internal
 */
export class SAMLConfig implements SAMLAuthProviderConfig {
  public readonly enabled: boolean;
  public readonly displayName?: string;
  public readonly providerId: string;
  public readonly idpEntityId: string;
  public readonly ssoURL: string;
  public readonly x509Certificates: string[];
  public readonly rpEntityId: string;
  public readonly callbackURL?: string;
  public readonly enableRequestSigning?: boolean;

  /**
   * Converts a client side request to a SAMLConfigServerRequest which is the format
   * accepted by the backend server.
   * Throws an error if validation fails. If the request is not a SAMLConfig request,
   * returns null.
   *
   * @param options - The options object to convert to a server request.
   * @param ignoreMissingFields - Whether to ignore missing fields.
   * @returns The resulting server request or null if not valid.
   */
  public static buildServerRequest(
    options: Partial<SAMLAuthProviderConfig>,
    ignoreMissingFields = false): SAMLConfigServerRequest | null {
    const makeRequest = validator.isNonNullObject(options) &&
        (options.providerId || ignoreMissingFields);
    if (!makeRequest) {
      return null;
    }
    const request: SAMLConfigServerRequest = {};
    // Validate options.
    SAMLConfig.validate(options, ignoreMissingFields);
    request.enabled = options.enabled;
    request.displayName = options.displayName;
    // IdP config.
    if (options.idpEntityId || options.ssoURL || options.x509Certificates) {
      request.idpConfig = {
        idpEntityId: options.idpEntityId,
        ssoUrl: options.ssoURL,
        signRequest: (options as any).enableRequestSigning,
        idpCertificates: typeof options.x509Certificates === 'undefined' ? undefined : [],
      };
      if (options.x509Certificates) {
        for (const cert of (options.x509Certificates || [])) {
          request.idpConfig!.idpCertificates!.push({ x509Certificate: cert });
        }
      }
    }
    // RP config.
    if (options.callbackURL || options.rpEntityId) {
      request.spConfig = {
        spEntityId: options.rpEntityId,
        callbackUri: options.callbackURL,
      };
    }
    return request;
  }

  /**
   * Returns the provider ID corresponding to the resource name if available.
   *
   * @param resourceName - The server side resource name.
   * @returns The provider ID corresponding to the resource, null otherwise.
   */
  public static getProviderIdFromResourceName(resourceName: string): string | null {
    // name is of form projects/project1/inboundSamlConfigs/providerId1
    const matchProviderRes = resourceName.match(/\/inboundSamlConfigs\/(saml\..*)$/);
    if (!matchProviderRes || matchProviderRes.length < 2) {
      return null;
    }
    return matchProviderRes[1];
  }

  /**
   * @param providerId - The provider ID to check.
   * @returns Whether the provider ID corresponds to a SAML provider.
   */
  public static isProviderId(providerId: any): providerId is string {
    return validator.isNonEmptyString(providerId) && providerId.indexOf('saml.') === 0;
  }

  /**
   * Validates the SAMLConfig options object. Throws an error on failure.
   *
   * @param options - The options object to validate.
   * @param ignoreMissingFields - Whether to ignore missing fields.
   */
  public static validate(options: Partial<SAMLAuthProviderConfig>, ignoreMissingFields = false): void {
    const validKeys = {
      enabled: true,
      displayName: true,
      providerId: true,
      idpEntityId: true,
      ssoURL: true,
      x509Certificates: true,
      rpEntityId: true,
      callbackURL: true,
      enableRequestSigning: true,
    };
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig" must be a valid non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid SAML config parameter.`,
        );
      }
    }
    // Required fields.
    if (validator.isNonEmptyString(options.providerId)) {
      if (options.providerId.indexOf('saml.') !== 0) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_PROVIDER_ID,
          '"SAMLAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "saml.".',
        );
      }
    } else if (!ignoreMissingFields) {
      // providerId is required and not provided correctly.
      throw new FirebaseAuthError(
        !options.providerId ? AuthClientErrorCode.MISSING_PROVIDER_ID : AuthClientErrorCode.INVALID_PROVIDER_ID,
        '"SAMLAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "saml.".',
      );
    }
    if (!(ignoreMissingFields && typeof options.idpEntityId === 'undefined') &&
        !validator.isNonEmptyString(options.idpEntityId)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.idpEntityId" must be a valid non-empty string.',
      );
    }
    if (!(ignoreMissingFields && typeof options.ssoURL === 'undefined') &&
        !validator.isURL(options.ssoURL)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.ssoURL" must be a valid URL string.',
      );
    }
    if (!(ignoreMissingFields && typeof options.rpEntityId === 'undefined') &&
        !validator.isNonEmptyString(options.rpEntityId)) {
      throw new FirebaseAuthError(
        !options.rpEntityId ? AuthClientErrorCode.MISSING_SAML_RELYING_PARTY_CONFIG :
          AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.rpEntityId" must be a valid non-empty string.',
      );
    }
    if (!(ignoreMissingFields && typeof options.callbackURL === 'undefined') &&
        !validator.isURL(options.callbackURL)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.callbackURL" must be a valid URL string.',
      );
    }
    if (!(ignoreMissingFields && typeof options.x509Certificates === 'undefined') &&
        !validator.isArray(options.x509Certificates)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.x509Certificates" must be a valid array of X509 certificate strings.',
      );
    }
    (options.x509Certificates || []).forEach((cert: string) => {
      if (!validator.isNonEmptyString(cert)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"SAMLAuthProviderConfig.x509Certificates" must be a valid array of X509 certificate strings.',
        );
      }
    });
    if (typeof (options as any).enableRequestSigning !== 'undefined' &&
        !validator.isBoolean((options as any).enableRequestSigning)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.enableRequestSigning" must be a boolean.',
      );
    }
    if (typeof options.enabled !== 'undefined' &&
        !validator.isBoolean(options.enabled)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.enabled" must be a boolean.',
      );
    }
    if (typeof options.displayName !== 'undefined' &&
        !validator.isString(options.displayName)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SAMLAuthProviderConfig.displayName" must be a valid string.',
      );
    }
  }

  /**
   * The SAMLConfig constructor.
   *
   * @param response - The server side response used to initialize the SAMLConfig object.
   * @constructor
   */
  constructor(response: SAMLConfigServerResponse) {
    if (!response ||
        !response.idpConfig ||
        !response.idpConfig.idpEntityId ||
        !response.idpConfig.ssoUrl ||
        !response.spConfig ||
        !response.spConfig.spEntityId ||
        !response.name ||
        !(validator.isString(response.name) &&
          SAMLConfig.getProviderIdFromResourceName(response.name))) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid SAML configuration response');
    }

    const providerId = SAMLConfig.getProviderIdFromResourceName(response.name);
    if (!providerId) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid SAML configuration response');
    }
    this.providerId = providerId;

    // RP config.
    this.rpEntityId = response.spConfig.spEntityId;
    this.callbackURL = response.spConfig.callbackUri;
    // IdP config.
    this.idpEntityId = response.idpConfig.idpEntityId;
    this.ssoURL = response.idpConfig.ssoUrl;
    this.enableRequestSigning = !!response.idpConfig.signRequest;
    const x509Certificates: string[] = [];
    for (const cert of (response.idpConfig.idpCertificates || [])) {
      if (cert.x509Certificate) {
        x509Certificates.push(cert.x509Certificate);
      }
    }
    this.x509Certificates = x509Certificates;
    // When enabled is undefined, it takes its default value of false.
    this.enabled = !!response.enabled;
    this.displayName = response.displayName;
  }

  /** @returns The plain object representation of the SAMLConfig. */
  public toJSON(): object {
    return {
      enabled: this.enabled,
      displayName: this.displayName,
      providerId: this.providerId,
      idpEntityId: this.idpEntityId,
      ssoURL: this.ssoURL,
      x509Certificates: deepCopy(this.x509Certificates),
      rpEntityId: this.rpEntityId,
      callbackURL: this.callbackURL,
      enableRequestSigning: this.enableRequestSigning,
    };
  }
}

/**
 * Defines the OIDCConfig class used to convert a client side configuration to its
 * server side representation.
 *
 * @internal
 */
export class OIDCConfig implements OIDCAuthProviderConfig {
  public readonly enabled: boolean;
  public readonly displayName?: string;
  public readonly providerId: string;
  public readonly issuer: string;
  public readonly clientId: string;
  public readonly clientSecret?: string;
  public readonly responseType: OAuthResponseType;

  /**
   * Converts a client side request to a OIDCConfigServerRequest which is the format
   * accepted by the backend server.
   * Throws an error if validation fails. If the request is not a OIDCConfig request,
   * returns null.
   *
   * @param options - The options object to convert to a server request.
   * @param ignoreMissingFields - Whether to ignore missing fields.
   * @returns The resulting server request or null if not valid.
   */
  public static buildServerRequest(
    options: Partial<OIDCAuthProviderConfig>,
    ignoreMissingFields = false): OIDCConfigServerRequest | null {
    const makeRequest = validator.isNonNullObject(options) &&
        (options.providerId || ignoreMissingFields);
    if (!makeRequest) {
      return null;
    }
    const request: OIDCConfigServerRequest = {};
    // Validate options.
    OIDCConfig.validate(options, ignoreMissingFields);
    request.enabled = options.enabled;
    request.displayName = options.displayName;
    request.issuer = options.issuer;
    request.clientId = options.clientId;
    if (typeof options.clientSecret !== 'undefined') {
      request.clientSecret = options.clientSecret;
    }
    if (typeof options.responseType !== 'undefined') {
      request.responseType = options.responseType;
    }
    return request;
  }

  /**
   * Returns the provider ID corresponding to the resource name if available.
   *
   * @param resourceName - The server side resource name
   * @returns The provider ID corresponding to the resource, null otherwise.
   */
  public static getProviderIdFromResourceName(resourceName: string): string | null {
    // name is of form projects/project1/oauthIdpConfigs/providerId1
    const matchProviderRes = resourceName.match(/\/oauthIdpConfigs\/(oidc\..*)$/);
    if (!matchProviderRes || matchProviderRes.length < 2) {
      return null;
    }
    return matchProviderRes[1];
  }

  /**
   * @param providerId - The provider ID to check.
   * @returns Whether the provider ID corresponds to an OIDC provider.
   */
  public static isProviderId(providerId: any): providerId is string {
    return validator.isNonEmptyString(providerId) && providerId.indexOf('oidc.') === 0;
  }

  /**
   * Validates the OIDCConfig options object. Throws an error on failure.
   *
   * @param options - The options object to validate.
   * @param ignoreMissingFields - Whether to ignore missing fields.
   */
  public static validate(options: Partial<OIDCAuthProviderConfig>, ignoreMissingFields = false): void {
    const validKeys = {
      enabled: true,
      displayName: true,
      providerId: true,
      clientId: true,
      issuer: true,
      clientSecret: true,
      responseType: true,
    };
    const validResponseTypes = {
      idToken: true,
      code: true,
    };
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"OIDCAuthProviderConfig" must be a valid non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid OIDC config parameter.`,
        );
      }
    }
    // Required fields.
    if (validator.isNonEmptyString(options.providerId)) {
      if (options.providerId.indexOf('oidc.') !== 0) {
        throw new FirebaseAuthError(
          !options.providerId ? AuthClientErrorCode.MISSING_PROVIDER_ID : AuthClientErrorCode.INVALID_PROVIDER_ID,
          '"OIDCAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "oidc.".',
        );
      }
    } else if (!ignoreMissingFields) {
      throw new FirebaseAuthError(
        !options.providerId ? AuthClientErrorCode.MISSING_PROVIDER_ID : AuthClientErrorCode.INVALID_PROVIDER_ID,
        '"OIDCAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "oidc.".',
      );
    }
    if (!(ignoreMissingFields && typeof options.clientId === 'undefined') &&
        !validator.isNonEmptyString(options.clientId)) {
      throw new FirebaseAuthError(
        !options.clientId ? AuthClientErrorCode.MISSING_OAUTH_CLIENT_ID : AuthClientErrorCode.INVALID_OAUTH_CLIENT_ID,
        '"OIDCAuthProviderConfig.clientId" must be a valid non-empty string.',
      );
    }
    if (!(ignoreMissingFields && typeof options.issuer === 'undefined') &&
        !validator.isURL(options.issuer)) {
      throw new FirebaseAuthError(
        !options.issuer ? AuthClientErrorCode.MISSING_ISSUER : AuthClientErrorCode.INVALID_CONFIG,
        '"OIDCAuthProviderConfig.issuer" must be a valid URL string.',
      );
    }
    if (typeof options.enabled !== 'undefined' &&
        !validator.isBoolean(options.enabled)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"OIDCAuthProviderConfig.enabled" must be a boolean.',
      );
    }
    if (typeof options.displayName !== 'undefined' &&
        !validator.isString(options.displayName)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"OIDCAuthProviderConfig.displayName" must be a valid string.',
      );
    }
    if (typeof options.clientSecret !== 'undefined' &&
        !validator.isNonEmptyString(options.clientSecret)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"OIDCAuthProviderConfig.clientSecret" must be a valid string.',
      );
    }
    if (validator.isNonNullObject(options.responseType) && typeof options.responseType !== 'undefined') {
      Object.keys(options.responseType).forEach((key) => {
        if (!(key in validResponseTypes)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            `"${key}" is not a valid OAuthResponseType parameter.`,
          );
        }
      });

      const idToken = options.responseType.idToken;
      if (typeof idToken !== 'undefined' && !validator.isBoolean(idToken)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_ARGUMENT,
          '"OIDCAuthProviderConfig.responseType.idToken" must be a boolean.',
        );
      }
      const code = options.responseType.code;
      if (typeof code !== 'undefined') {
        if (!validator.isBoolean(code)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_ARGUMENT,
            '"OIDCAuthProviderConfig.responseType.code" must be a boolean.',
          );
        }
        // If code flow is enabled, client secret must be provided.
        if (code && typeof options.clientSecret === 'undefined') {
          throw new FirebaseAuthError(
            AuthClientErrorCode.MISSING_OAUTH_CLIENT_SECRET,
            'The OAuth configuration client secret is required to enable OIDC code flow.',
          );
        }
      }

      const allKeys = Object.keys(options.responseType).length;
      const enabledCount = Object.values(options.responseType).filter(Boolean).length;
      // Only one of OAuth response types can be set to true.
      if (allKeys > 1 && enabledCount !== 1) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_OAUTH_RESPONSETYPE,
          'Only exactly one OAuth responseType should be set to true.',
        );
      }
    }
  }

  /**
   * The OIDCConfig constructor.
   *
   * @param response - The server side response used to initialize the OIDCConfig object.
   * @constructor
   */
  constructor(response: OIDCConfigServerResponse) {
    if (!response ||
        !response.issuer ||
        !response.clientId ||
        !response.name ||
        !(validator.isString(response.name) &&
          OIDCConfig.getProviderIdFromResourceName(response.name))) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid OIDC configuration response');
    }

    const providerId = OIDCConfig.getProviderIdFromResourceName(response.name);
    if (!providerId) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid SAML configuration response');
    }
    this.providerId = providerId;

    this.clientId = response.clientId;
    this.issuer = response.issuer;
    // When enabled is undefined, it takes its default value of false.
    this.enabled = !!response.enabled;
    this.displayName = response.displayName;

    if (typeof response.clientSecret !== 'undefined') {
      this.clientSecret = response.clientSecret;
    }
    if (typeof response.responseType !== 'undefined') {
      this.responseType = response.responseType;
    }
  }

  /** @returns The plain object representation of the OIDCConfig. */
  public toJSON(): OIDCAuthProviderConfig {
    return {
      enabled: this.enabled,
      displayName: this.displayName,
      providerId: this.providerId,
      issuer: this.issuer,
      clientId: this.clientId,
      clientSecret: deepCopy(this.clientSecret),
      responseType: deepCopy(this.responseType),
    };
  }
}

/**
 * The request interface for updating a SMS Region Config.
 * Configures the regions where users are allowed to send verification SMS.
 * This is based on the calling code of the destination phone number.
 */
export type SmsRegionConfig = AllowByDefaultWrap | AllowlistOnlyWrap;

/**
 * Mutual exclusive SMS Region Config of AllowByDefault interface
 */
export interface AllowByDefaultWrap {
  /**
   * Allow every region by default.
   */
  allowByDefault: AllowByDefault;
  /** @alpha */
  allowlistOnly?: never;
}

/**
 * Mutually exclusive SMS Region Config of AllowlistOnly interface
 */
export interface AllowlistOnlyWrap {
  /**
   * Only allowing regions by explicitly adding them to an
   * allowlist.
   */
  allowlistOnly: AllowlistOnly;
  /** @alpha */
  allowByDefault?: never;
}

/**
 * Defines a policy of allowing every region by default and adding disallowed
 * regions to a disallow list.
 */
export interface AllowByDefault {
  /**
   * Two letter unicode region codes to disallow as defined by
   * https://cldr.unicode.org/
   * The full list of these region codes is here:
   * https://github.com/unicode-cldr/cldr-localenames-full/blob/master/main/en/territories.json
   */
  disallowedRegions: string[];
}

/**
 * Defines a policy of only allowing regions by explicitly adding them to an
 * allowlist.
 */
export interface AllowlistOnly {
    /**
   * Two letter unicode region codes to allow as defined by
   * https://cldr.unicode.org/
   * The full list of these region codes is here:
   * https://github.com/unicode-cldr/cldr-localenames-full/blob/master/main/en/territories.json
   */
  allowedRegions: string[];
}

/**
 * Defines the SMSRegionConfig class used for validation.
 *
 * @internal
 */
export class SmsRegionsAuthConfig {
  public static validate(options: SmsRegionConfig): void {
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"SmsRegionConfig" must be a non-null object.',
      );
    }

    const validKeys = {
      allowlistOnly: true,
      allowByDefault: true,
    };

    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid SmsRegionConfig parameter.`,
        );
      }
    }

    // validate mutual exclusiveness of allowByDefault and allowlistOnly
    if (typeof options.allowByDefault !== 'undefined' && typeof options.allowlistOnly !== 'undefined') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        'SmsRegionConfig cannot have both "allowByDefault" and "allowlistOnly" parameters.',
      );
    }
    // validation for allowByDefault type
    if (typeof options.allowByDefault !== 'undefined') {
      const allowByDefaultValidKeys = {
        disallowedRegions: true,
      }
      for (const key in options.allowByDefault) {
        if (!(key in allowByDefaultValidKeys)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            `"${key}" is not a valid SmsRegionConfig.allowByDefault parameter.`,
          );
        }
      }
      // disallowedRegion can be empty.
      if (typeof options.allowByDefault.disallowedRegions !== 'undefined'
        && !validator.isArray(options.allowByDefault.disallowedRegions)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"SmsRegionConfig.allowByDefault.disallowedRegions" must be a valid string array.',
        );
      }
    }

    if (typeof options.allowlistOnly !== 'undefined') {
      const allowListOnlyValidKeys = {
        allowedRegions: true,
      }
      for (const key in options.allowlistOnly) {
        if (!(key in allowListOnlyValidKeys)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            `"${key}" is not a valid SmsRegionConfig.allowlistOnly parameter.`,
          );
        }
      }

      // allowedRegions can be empty
      if (typeof options.allowlistOnly.allowedRegions !== 'undefined'
        && !validator.isArray(options.allowlistOnly.allowedRegions)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"SmsRegionConfig.allowlistOnly.allowedRegions" must be a valid string array.',
        );
      }
    }
  }
}
/**
* Enforcement state of reCAPTCHA protection.
*   - 'OFF': Unenforced.
*   - 'AUDIT': Create assessment but don't enforce the result.
*   - 'ENFORCE': Create assessment and enforce the result.
*/
export type RecaptchaProviderEnforcementState =  'OFF' | 'AUDIT' | 'ENFORCE';

/**
* The actions to take for reCAPTCHA-protected requests.
*   - 'BLOCK': The reCAPTCHA-protected request will be blocked.
*/
export type RecaptchaAction = 'BLOCK';

/**
 * The config for a reCAPTCHA action rule.
 */
export interface RecaptchaManagedRule {
 /**
  * The action will be enforced if the reCAPTCHA score of a request is larger than endScore.
  */
 endScore: number;
  /**
  * The action for reCAPTCHA-protected requests.
  */
 action?: RecaptchaAction;
}

/**
 * The managed rules for toll fraud provider, containing the enforcement status. 
 * The toll fraud provider contains all SMS related user flows.
 */
export interface RecaptchaTollFraudManagedRule {
  /**
  * The action will be enforced if the reCAPTCHA score of a request is larger than startScore.
  */
  startScore: number;
  /**
   * The action for reCAPTCHA-protected requests.
   */
  action?: RecaptchaAction;
}

/**
 * The key's platform type.
 */
export type RecaptchaKeyClientType = 'WEB' | 'IOS' | 'ANDROID';

/**
 * The reCAPTCHA key config.
 */
export interface RecaptchaKey {
  /**
   * The key's client platform type.
   */
  type?: RecaptchaKeyClientType;

  /**
   * The reCAPTCHA site key.
   */
  key: string;
}

/**
 * The request interface for updating a reCAPTCHA Config.
 * By enabling reCAPTCHA Enterprise Integration you are
 * agreeing to reCAPTCHA Enterprise
 * {@link https://cloud.google.com/terms/service-terms | Term of Service}.
 */
export interface RecaptchaConfig {
  /**
  * The enforcement state of the email password provider.
  */
  emailPasswordEnforcementState?: RecaptchaProviderEnforcementState;
  /**
  * The enforcement state of the phone provider.
  */
  phoneEnforcementState?: RecaptchaProviderEnforcementState;
  /**
   *  The reCAPTCHA managed rules.
   */
  managedRules?: RecaptchaManagedRule[];
  /**
   * The reCAPTCHA keys.
   */
  recaptchaKeys?: RecaptchaKey[];
  /**
   * Whether to use account defender for reCAPTCHA assessment.
   * The default value is false.
   */
  useAccountDefender?: boolean;
  /**
   * Whether to use the rCE bot score for reCAPTCHA phone provider. 
   * Can only be true when the phone_enforcement_state is AUDIT or ENFORCE.
   */
  useSmsBotScore?: boolean;
  /**
   * Whether to use the rCE SMS toll fraud protection risk score for reCAPTCHA phone provider. 
   * Can only be true when the phone_enforcement_state is AUDIT or ENFORCE.
   */
  useSmsTollFraudProtection?: boolean;
  /**
   * The managed rules for toll fraud provider, containing the enforcement status. 
   * The toll fraud provider contains all SMS related user flows.
   */
  smsTollFraudManagedRules?: RecaptchaTollFraudManagedRule[];
}

/** 
 * Server side recaptcha configuration.
 */
export interface RecaptchaAuthServerConfig {
  emailPasswordEnforcementState?: RecaptchaProviderEnforcementState;
  phoneEnforcementState?: RecaptchaProviderEnforcementState;
  managedRules?: RecaptchaManagedRule[];
  recaptchaKeys?: RecaptchaKey[];
  useAccountDefender?: boolean;
  useSmsBotScore?: boolean;
  useSmsTollFraudProtection?: boolean;
  tollFraudManagedRules?: RecaptchaTollFraudManagedRule[];
}

/**
 * Defines the recaptcha config class used to convert client side RecaptchaConfig
 * to a format that is understood by the Auth server.
 * 
 * @internal
 */
export class RecaptchaAuthConfig implements RecaptchaConfig {
  public readonly emailPasswordEnforcementState?: RecaptchaProviderEnforcementState;
  public readonly phoneEnforcementState?: RecaptchaProviderEnforcementState;
  public readonly managedRules?: RecaptchaManagedRule[];
  public readonly recaptchaKeys?: RecaptchaKey[];
  public readonly useAccountDefender?: boolean;
  public readonly useSmsBotScore?: boolean;
  public readonly useSmsTollFraudProtection?: boolean;
  public readonly smsTollFraudManagedRules?: RecaptchaTollFraudManagedRule[];

  
  /**
   * The RecaptchaAuthConfig constructor.
   *
   * @param response - The server side response used to initialize the
   *     RecaptchaAuthConfig object.
   * @constructor
   * @internal
   */
  constructor(response: RecaptchaAuthServerConfig) {
    const filteredResponse = Object.fromEntries(
      Object.entries(response).filter(([, value]) => value !== undefined)
    );
  
    // Explicitly map the 'tollFraudManagedRules' to 'smsTollFraudManagedRules'
    if (filteredResponse.tollFraudManagedRules !== undefined) {
      this.smsTollFraudManagedRules = filteredResponse.tollFraudManagedRules;
      delete filteredResponse.tollFraudManagedRules; // Remove it if necessary
    }
  
    // Assign the remaining properties directly
    Object.assign(this, filteredResponse);
  }  
  
  /**
   * Builds a server request object from the client-side RecaptchaConfig.
   * Converts client-side fields to their server-side equivalents.
   *
   * @param options - The client-side RecaptchaConfig object.
   * @returns The server-side RecaptchaAuthServerConfig object.
   */
  public static buildServerRequest(options: RecaptchaConfig): RecaptchaAuthServerConfig {
    RecaptchaAuthConfig.validate(options); // Validate options before building request

    const request: RecaptchaAuthServerConfig = {};

    if (typeof options.emailPasswordEnforcementState !== 'undefined') {
      request.emailPasswordEnforcementState = options.emailPasswordEnforcementState;
    }
    if (typeof options.phoneEnforcementState !== 'undefined') {
      request.phoneEnforcementState = options.phoneEnforcementState;
    }
    if (typeof options.managedRules !== 'undefined') {
      request.managedRules = options.managedRules;
    }
    if (typeof options.recaptchaKeys !== 'undefined') {
      request.recaptchaKeys = options.recaptchaKeys;
    }
    if (typeof options.useAccountDefender !== 'undefined') {
      request.useAccountDefender = options.useAccountDefender;
    }
    if (typeof options.useSmsBotScore !== 'undefined') {
      request.useSmsBotScore = options.useSmsBotScore;
    }
    if (typeof options.useSmsTollFraudProtection !== 'undefined') {
      request.useSmsTollFraudProtection = options.useSmsTollFraudProtection;
    }
    if (typeof options.smsTollFraudManagedRules !== 'undefined') {
      request.tollFraudManagedRules = options.smsTollFraudManagedRules; // Map client-side field to server-side
    }
    return request;
  }

  /**
   * Validates the RecaptchaConfig options object. Throws an error on failure.
   * @param options - The options object to validate.
   */
  public static validate(options: RecaptchaConfig): void {
    const validKeys = {
      emailPasswordEnforcementState: true,
      phoneEnforcementState: true,
      managedRules: true,
      recaptchaKeys: true,
      useAccountDefender: true,
      useSmsBotScore: true,
      useSmsTollFraudProtection: true,
      smsTollFraudManagedRules: true,
    };

    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"RecaptchaConfig" must be a non-null object.',
      );
    }

    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid RecaptchaConfig parameter.`,
        );
      }
    }

    // Validation
    if (typeof options.emailPasswordEnforcementState !== 'undefined') {
      if (!validator.isNonEmptyString(options.emailPasswordEnforcementState)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_ARGUMENT,
          '"RecaptchaConfig.emailPasswordEnforcementState" must be a valid non-empty string.',
        );
      }

      if (options.emailPasswordEnforcementState !== 'OFF' &&
        options.emailPasswordEnforcementState !== 'AUDIT' &&
        options.emailPasswordEnforcementState !== 'ENFORCE') {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.emailPasswordEnforcementState" must be either "OFF", "AUDIT" or "ENFORCE".',
        );
      }
    }

    if (typeof options.phoneEnforcementState !== 'undefined') {
      if (!validator.isNonEmptyString(options.phoneEnforcementState)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_ARGUMENT,
          '"RecaptchaConfig.phoneEnforcementState" must be a valid non-empty string.',
        );
      }

      if (options.phoneEnforcementState !== 'OFF' &&
        options.phoneEnforcementState !== 'AUDIT' &&
        options.phoneEnforcementState !== 'ENFORCE') {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.phoneEnforcementState" must be either "OFF", "AUDIT" or "ENFORCE".',
        );
      }
    }

    if (typeof options.managedRules !== 'undefined') {
      // Validate array
      if (!validator.isArray(options.managedRules)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.managedRules" must be an array of valid "RecaptchaManagedRule".',
        );
      }
      // Validate each rule of the array
      options.managedRules.forEach((managedRule) => {
        RecaptchaAuthConfig.validateManagedRule(managedRule);
      });
    }

    if (typeof options.useAccountDefender !== 'undefined') {
      if (!validator.isBoolean(options.useAccountDefender)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.useAccountDefender" must be a boolean value".',
        );
      }
    }

    if (typeof options.useSmsBotScore !== 'undefined') {
      if (!validator.isBoolean(options.useSmsBotScore)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.useSmsBotScore" must be a boolean value".',
        );
      }
    }

    if (typeof options.useSmsTollFraudProtection !== 'undefined') {
      if (!validator.isBoolean(options.useSmsTollFraudProtection)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.useSmsTollFraudProtection" must be a boolean value".',
        );
      }
    }

    if (typeof options.smsTollFraudManagedRules !== 'undefined') {
      // Validate array
      if (!validator.isArray(options.smsTollFraudManagedRules)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"RecaptchaConfig.smsTollFraudManagedRules" must be an array of valid "RecaptchaTollFraudManagedRule".',
        );
      }
      // Validate each rule of the array
      options.smsTollFraudManagedRules.forEach((tollFraudManagedRule) => {
        RecaptchaAuthConfig.validateTollFraudManagedRule(tollFraudManagedRule);
      });
    }
  }

  /**
   * Validate each element in ManagedRule array
   * @param options - The options object to validate.
   */
  private static validateManagedRule(options: RecaptchaManagedRule): void {
    const validKeys = {
      endScore: true,
      action: true,
    }
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"RecaptchaManagedRule" must be a non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid RecaptchaManagedRule parameter.`,
        );
      }
    }

    // Validate content.
    if (typeof options.action !== 'undefined' &&
        options.action !== 'BLOCK') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"RecaptchaManagedRule.action" must be "BLOCK".',
      );
    }
  }

  /**
   * Validate each element in TollFraudManagedRule array
   * @param options - The options object to validate.
   */
  private static validateTollFraudManagedRule(options: RecaptchaTollFraudManagedRule): void {
    const validKeys = {
      startScore: true,
      action: true,
    }
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"RecaptchaTollFraudManagedRule" must be a non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid RecaptchaTollFraudManagedRule parameter.`,
        );
      }
    }

    // Validate content.
    if (typeof options.action !== 'undefined' &&
        options.action !== 'BLOCK') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"RecaptchaTollFraudManagedRule.action" must be "BLOCK".',
      );
    }
  }
}

/** 
 * A password policy configuration for a project or tenant 
*/
export interface PasswordPolicyConfig {
  /**
   * Enforcement state of the password policy
   */
  enforcementState?: PasswordPolicyEnforcementState;
  /**
   * Require users to have a policy-compliant password to sign in
   */
  forceUpgradeOnSignin?: boolean;
  /**
   * The constraints that make up the password strength policy
   */
  constraints?: CustomStrengthOptionsConfig;
}

/**
 * Configuration for settings related to univeral links (iOS)
 * and app links (Android).
 */
export interface MobileLinksConfig {
  /**
   * Use Firebase Hosting or dynamic link domain as the out-of-band code domain.
   */
  domain?: MobileLinksDomain;
}

/**
 * Open code in app domain to use for app links and universal links.
 */
export type MobileLinksDomain = 'HOSTING_DOMAIN' | 'FIREBASE_DYNAMIC_LINK_DOMAIN';

/**
 * Defines the MobileLinksAuthConfig class used for validation.
 *
 * @internal
 */
export class MobileLinksAuthConfig {
  public static validate(options: MobileLinksConfig): void {
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"MobileLinksConfig" must be a non-null object.',
      );
    }

    const validKeys = {
      domain: true,
    };

    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid "MobileLinksConfig" parameter.`,
        );
      }
    }

    if (typeof options.domain !== 'undefined'
      && options.domain !== 'HOSTING_DOMAIN'
      && options.domain !== 'FIREBASE_DYNAMIC_LINK_DOMAIN') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"MobileLinksConfig.domain" must be either "HOSTING_DOMAIN" or "FIREBASE_DYNAMIC_LINK_DOMAIN".',
      );
    }
  }
}

/**
 * A password policy's enforcement state.
 */
export type PasswordPolicyEnforcementState = 'ENFORCE' | 'OFF';

/**
 * Constraints to be enforced on the password policy
 */
export interface CustomStrengthOptionsConfig {
  /**
   * The password must contain an upper case character
   */
  requireUppercase?: boolean;
  /**
   *  The password must contain a lower case character
   */
  requireLowercase?: boolean;
  /**
   * The password must contain a non-alphanumeric character
   */
  requireNonAlphanumeric?: boolean;
  /**
   * The password must contain a number
   */
  requireNumeric?: boolean;
  /**
   * Minimum password length. Valid values are from 6 to 30
   */
  minLength?: number;
  /**
   * Maximum password length. No default max length
   */
  maxLength?: number;
}

/**
 * Defines the password policy config class used to convert client side PasswordPolicyConfig
 * to a format that is understood by the Auth server.
 * 
 * @internal
 */
export class PasswordPolicyAuthConfig implements PasswordPolicyConfig {

  /**
   * Identifies a password policy configuration state.
   */
  public readonly enforcementState: PasswordPolicyEnforcementState;
  /**
   * Users must have a password compliant with the password policy to sign-in
   */
  public readonly forceUpgradeOnSignin: boolean;
  /**
   * Must be of length 1. Contains the strength attributes for the password policy
   */
  public readonly constraints?: CustomStrengthOptionsConfig;

  /**
   * Static method to convert a client side request to a PasswordPolicyAuthServerConfig.
   * Throws an error if validation fails.
   *
   * @param options - The options object to convert to a server request.
   * @returns The resulting server request.
   * @internal
   */
  public static buildServerRequest(options: PasswordPolicyConfig): PasswordPolicyAuthServerConfig {
    const request: PasswordPolicyAuthServerConfig = {};
    PasswordPolicyAuthConfig.validate(options);
    if (Object.prototype.hasOwnProperty.call(options, 'enforcementState')) {
      request.passwordPolicyEnforcementState = options.enforcementState;
    }
    request.forceUpgradeOnSignin = false;
    if (Object.prototype.hasOwnProperty.call(options, 'forceUpgradeOnSignin')) {
      request.forceUpgradeOnSignin = options.forceUpgradeOnSignin;
    }
    const constraintsRequest: CustomStrengthOptionsAuthServerConfig = {
      containsUppercaseCharacter: false,
      containsLowercaseCharacter: false,
      containsNonAlphanumericCharacter: false,
      containsNumericCharacter: false,
      minPasswordLength: 6,
      maxPasswordLength: 4096,
    };
    request.passwordPolicyVersions = [];
    if (Object.prototype.hasOwnProperty.call(options, 'constraints')) {
      if (options) {
        if (options.constraints?.requireUppercase !== undefined) {
          constraintsRequest.containsUppercaseCharacter = options.constraints.requireUppercase;
        }
        if (options.constraints?.requireLowercase !== undefined) {
          constraintsRequest.containsLowercaseCharacter = options.constraints.requireLowercase;
        }
        if (options.constraints?.requireNonAlphanumeric !== undefined) {
          constraintsRequest.containsNonAlphanumericCharacter = options.constraints.requireNonAlphanumeric;
        }
        if (options.constraints?.requireNumeric !== undefined) {
          constraintsRequest.containsNumericCharacter = options.constraints.requireNumeric;
        }
        if (options.constraints?.minLength !== undefined) {
          constraintsRequest.minPasswordLength = options.constraints.minLength;
        }
        if (options.constraints?.maxLength !== undefined) {
          constraintsRequest.maxPasswordLength = options.constraints.maxLength;
        }
      }
    }
    request.passwordPolicyVersions.push({ customStrengthOptions: constraintsRequest });
    return request;
  }

  /**
   * Validates the PasswordPolicyConfig options object. Throws an error on failure.
   *
   * @param options - The options object to validate.
   * @internal
   */
  public static validate(options: PasswordPolicyConfig): void {
    const validKeys = {
      enforcementState: true,
      forceUpgradeOnSignin: true,
      constraints: true,
    };
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"PasswordPolicyConfig" must be a non-null object.',
      );
    }
    // Check for unsupported top level attributes.
    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid PasswordPolicyConfig parameter.`,
        );
      }
    }
    // Validate content.
    if (typeof options.enforcementState === 'undefined' ||
      !(options.enforcementState === 'ENFORCE' ||
      options.enforcementState === 'OFF')) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"PasswordPolicyConfig.enforcementState" must be either "ENFORCE" or "OFF".',
      );
    }
    
    if (typeof options.forceUpgradeOnSignin !== 'undefined') {
      if (!validator.isBoolean(options.forceUpgradeOnSignin)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.forceUpgradeOnSignin" must be a boolean.',
        );
      }
    }

    if (typeof options.constraints !== 'undefined') {
      if (options.enforcementState === 'ENFORCE' && !validator.isNonNullObject(options.constraints)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints" must be a non-empty object.',
        );
      }

      const validCharKeys = {
        requireUppercase: true,
        requireLowercase: true,
        requireNumeric: true,
        requireNonAlphanumeric: true,
        minLength: true,
        maxLength: true,
      };

      // Check for unsupported  attributes.
      for (const key in options.constraints) {
        if (!(key in validCharKeys)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            `"${key}" is not a valid PasswordPolicyConfig.constraints parameter.`,
          );
        }
      }
      if (typeof options.constraints.requireUppercase !== 'undefined' &&
        !validator.isBoolean(options.constraints.requireUppercase)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints.requireUppercase" must be a boolean.',
        );
      }
      if (typeof options.constraints.requireLowercase !== 'undefined' &&
        !validator.isBoolean(options.constraints.requireLowercase)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints.requireLowercase" must be a boolean.',
        );
      }
      if (typeof options.constraints.requireNonAlphanumeric !== 'undefined' &&
        !validator.isBoolean(options.constraints.requireNonAlphanumeric)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints.requireNonAlphanumeric"' +
            ' must be a boolean.',
        );
      }
      if (typeof options.constraints.requireNumeric !== 'undefined' &&
        !validator.isBoolean(options.constraints.requireNumeric)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints.requireNumeric" must be a boolean.',
        );
      }
      if (typeof options.constraints.minLength === 'undefined') {
        options.constraints.minLength = 6;
      } else if (!validator.isNumber(options.constraints.minLength)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints.minLength" must be a number.',
        );
      } else {
        if (!(options.constraints.minLength >= 6
          && options.constraints.minLength <= 30)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            '"PasswordPolicyConfig.constraints.minLength"' +
            ' must be an integer between 6 and 30, inclusive.',
          );
        }
      }
      if (typeof options.constraints.maxLength === 'undefined') {
        options.constraints.maxLength = 4096;
      } else if (!validator.isNumber(options.constraints.maxLength)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints.maxLength" must be a number.',
        );
      } else {
        if (!(options.constraints.maxLength >= options.constraints.minLength &&
          options.constraints.maxLength <= 4096)) {
          throw new FirebaseAuthError(
            AuthClientErrorCode.INVALID_CONFIG,
            '"PasswordPolicyConfig.constraints.maxLength"' +
            ' must be greater than or equal to minLength and at max 4096.',
          );
        }
      }
    } else {
      if (options.enforcementState === 'ENFORCE') {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          '"PasswordPolicyConfig.constraints" must be defined.',
        );
      }
    }
  }

  /**
   * The PasswordPolicyAuthConfig constructor.
   *
   * @param response - The server side response used to initialize the
   *     PasswordPolicyAuthConfig object.
   * @constructor
   * @internal
   */
  constructor(response: PasswordPolicyAuthServerConfig) {
    if (typeof response.passwordPolicyEnforcementState === 'undefined') {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INTERNAL_ERROR,
        'INTERNAL ASSERT FAILED: Invalid password policy configuration response');
    }
    this.enforcementState = response.passwordPolicyEnforcementState;
    let constraintsResponse: CustomStrengthOptionsConfig = {};
    if (typeof response.passwordPolicyVersions !== 'undefined') {
      (response.passwordPolicyVersions || []).forEach((policyVersion) => {
        constraintsResponse = {
          requireLowercase: policyVersion.customStrengthOptions?.containsLowercaseCharacter,
          requireUppercase: policyVersion.customStrengthOptions?.containsUppercaseCharacter,
          requireNonAlphanumeric: policyVersion.customStrengthOptions?.containsNonAlphanumericCharacter,
          requireNumeric: policyVersion.customStrengthOptions?.containsNumericCharacter,
          minLength: policyVersion.customStrengthOptions?.minPasswordLength,
          maxLength: policyVersion.customStrengthOptions?.maxPasswordLength,
        };
      });
    }
    this.constraints = constraintsResponse;
    this.forceUpgradeOnSignin = response.forceUpgradeOnSignin?true:false;
  }
}

/** 
 * Server side password policy configuration.
 */
export interface PasswordPolicyAuthServerConfig {
  passwordPolicyEnforcementState?: PasswordPolicyEnforcementState;
  passwordPolicyVersions?: PasswordPolicyVersionsAuthServerConfig[];
  forceUpgradeOnSignin?: boolean;
}

/**
 * Server side password policy versions configuration. 
 */
export interface PasswordPolicyVersionsAuthServerConfig {
  customStrengthOptions?: CustomStrengthOptionsAuthServerConfig;
}

/**
 * Server side password policy constraints configuration. 
 */
export interface CustomStrengthOptionsAuthServerConfig {
  containsLowercaseCharacter?: boolean;
  containsUppercaseCharacter?: boolean;
  containsNumericCharacter?: boolean;
  containsNonAlphanumericCharacter?: boolean;
  minPasswordLength?: number;
  maxPasswordLength?: number;
}

/**
 * The email privacy configuration of a project or tenant.
 */
export interface EmailPrivacyConfig {
  /**
   * Whether enhanced email privacy is enabled.
   */
  enableImprovedEmailPrivacy?: boolean;
}

/**
 * Defines the EmailPrivacyAuthConfig class used for validation.
 *
 * @internal
 */
export class EmailPrivacyAuthConfig {
  public static validate(options: EmailPrivacyConfig): void {
    if (!validator.isNonNullObject(options)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"EmailPrivacyConfig" must be a non-null object.',
      );
    }

    const validKeys = {
      enableImprovedEmailPrivacy: true,
    };

    for (const key in options) {
      if (!(key in validKeys)) {
        throw new FirebaseAuthError(
          AuthClientErrorCode.INVALID_CONFIG,
          `"${key}" is not a valid "EmailPrivacyConfig" parameter.`,
        );
      }
    }

    if (typeof options.enableImprovedEmailPrivacy !== 'undefined'
      && !validator.isBoolean(options.enableImprovedEmailPrivacy)) {
      throw new FirebaseAuthError(
        AuthClientErrorCode.INVALID_CONFIG,
        '"EmailPrivacyConfig.enableImprovedEmailPrivacy" must be a valid boolean value.',
      );
    }
  }
}
