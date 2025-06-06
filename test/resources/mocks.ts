/*!
 * @license
 * Copyright 2017 Google Inc.
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

'use strict';

// Use untyped import syntax for Node built-ins.
import path = require('path');
import events = require('events');
import stream = require('stream');
import http2 = require('http2');

import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as sinon from 'sinon';

import { AppOptions } from '../../src/firebase-namespace-api';
import { FirebaseApp } from '../../src/app/firebase-app';
import { Credential, GoogleOAuthAccessToken, cert } from '../../src/app/index';
import { ApplicationDefaultCredential } from '../../src/app/credential-internal';

const ALGORITHM = 'RS256' as const;
const ONE_HOUR_IN_SECONDS = 60 * 60;
const TEN_MINUTES_IN_SECONDS = 10 * 60;

export const uid = 'someUid';
export const projectId = 'project_id';
export const projectNumber = '12345678';
export const appId = '12345678:app:ID';
export const developerClaims = {
  one: 'uno',
  two: 'dos',
};

export const appName = 'mock-app-name';

export const serviceName = 'mock-service-name';

export const databaseURL = 'https://databaseName.firebaseio.com';

export const databaseAuthVariableOverride = { 'some#string': 'some#val' };

export const storageBucket = 'bucketName.appspot.com';

export const credential = cert(path.resolve(__dirname, './mock.key.json'));

export const appOptions: AppOptions = {
  credential,
  databaseURL,
  storageBucket,
};

export const appOptionsWithOverride: AppOptions = {
  credential,
  databaseAuthVariableOverride,
  databaseURL,
  storageBucket,
  projectId,
};

export const appOptionsNoAuth: AppOptions = {
  databaseURL,
};

export const appOptionsNoDatabaseUrl: AppOptions = {
  credential,
};

export const appOptionsAuthDB: AppOptions = {
  credential,
  databaseURL,
};

export class MockCredential implements Credential {
  public getAccessToken(): Promise<GoogleOAuthAccessToken> {
    return Promise.resolve({
      access_token: 'mock-token',
      expires_in: 3600,
    });
  }
}

export class MockComputeEngineCredential extends ApplicationDefaultCredential {
  public getAccessToken(): Promise<GoogleOAuthAccessToken> {
    return Promise.resolve({
      access_token: 'mock-token',
      expires_in: 3600,
    });
  }
  
  public getIDToken(): Promise<string> {
    return Promise.resolve('mockIdToken');
  }

  public isComputeEngineCredential(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export function app(altName?: string): FirebaseApp {
  return new FirebaseApp(appOptions, altName || appName);
}

export function mockCredentialApp(): FirebaseApp {
  return new FirebaseApp({
    credential: new MockCredential(),
    databaseURL,
  }, appName);
}

export function appWithOptions(options: AppOptions): FirebaseApp {
  return new FirebaseApp(options, appName);
}

export function appReturningNullAccessToken(): FirebaseApp {
  const nullFn: () => Promise<GoogleOAuthAccessToken> | null = () => null;
  return new FirebaseApp({
    credential: {
      getAccessToken: nullFn,
    } as any,
    databaseURL,
    projectId,
  }, appName);
}

export function appReturningMalformedAccessToken(): FirebaseApp {
  return new FirebaseApp({
    credential: {
      getAccessToken: () => 5,
    } as any,
    databaseURL,
    projectId,
  }, appName);
}

export function appRejectedWhileFetchingAccessToken(): FirebaseApp {
  return new FirebaseApp({
    credential: {
      getAccessToken: () => Promise.reject(new Error('Promise intentionally rejected.')),
    } as any,
    databaseURL,
    projectId,
  }, appName);
}

export const refreshToken = {
  clientId: 'mock-client-id',
  clientSecret: 'mock-client-secret',
  refreshToken: 'mock-refresh-token',
  type: 'refreshToken',
};

// Randomly generated JSON Web Key Sets that do not correspond to anything related to Firebase.
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const jwksResponse = require('./mock.jwks.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const certificateObject = require('./mock.key.json');

// Randomly generated key pairs that don't correspond to anything related to Firebase or GCP
export const keyPairs = [
  /* eslint-disable max-len */
  // The private key for this key pair is identical to the one used in ./mock.key.json
  {
    public: '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwJENcRev+eXZKvhhWLiV3Lz2MvO+naQRHo59g3vaNQnbgyduN/L4krlrJ5c6\nFiikXdtJNb/QrsAHSyJWCu8j3T9CruiwbidGAk2W0RuViTVspjHUTsIHExx9euWM0UomGvYk\noqXahdhPL/zViVSJt+Rt8bHLsMvpb8RquTIb9iKY3SMV2tCofNmyCSgVbghq/y7lKORtV/IR\nguWs6R22fbkb0r2MCYoNAbZ9dqnbRIFNZBC7itYtUoTEresRWcyFMh0zfAIJycWOJlVLDLqk\nY2SmIx8u7fuysCg1wcoSZoStuDq02nZEMw1dx8HGzE0hynpHlloRLByuIuOAfMCCYwIDAQAB\n-----END RSA PUBLIC KEY-----\n',
    private: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAwJENcRev+eXZKvhhWLiV3Lz2MvO+naQRHo59g3vaNQnbgyduN/L4krlr\nJ5c6FiikXdtJNb/QrsAHSyJWCu8j3T9CruiwbidGAk2W0RuViTVspjHUTsIHExx9euWM0Uom\nGvYkoqXahdhPL/zViVSJt+Rt8bHLsMvpb8RquTIb9iKY3SMV2tCofNmyCSgVbghq/y7lKORt\nV/IRguWs6R22fbkb0r2MCYoNAbZ9dqnbRIFNZBC7itYtUoTEresRWcyFMh0zfAIJycWOJlVL\nDLqkY2SmIx8u7fuysCg1wcoSZoStuDq02nZEMw1dx8HGzE0hynpHlloRLByuIuOAfMCCYwID\nAQABAoIBADFtihu7TspAO0wSUTpqttzgC/nsIsNn95T2UjVLtyjiDNxPZLUrwq42tdCFur0x\nVW9Z+CK5x6DzXWvltlw8IeKKeF1ZEOBVaFzy+YFXKTz835SROcO1fgdjyrme7lRSShGlmKW/\nGKY+baUNquoDLw5qreXaE0SgMp0jt5ktyYuVxvhLDeV4omw2u6waoGkifsGm8lYivg5l3VR7\nw2IVOvYZTt4BuSYVwOM+qjwaS1vtL7gv0SUjrj85Ja6zERRdFiITDhZw6nsvacr9/+/aut9E\naL/koSSb62g5fntQMEwoT4hRnjPnAedmorM9Rhddh2TB3ZKTBbMN1tUk3fJxOuECgYEA+z6l\neSaAcZ3qvwpntcXSpwwJ0SSmzLTH2RJNf+Ld3eBHiSvLTG53dWB7lJtF4R1KcIwf+KGcOFJv\nsnepzcZBylRvT8RrAAkV0s9OiVm1lXZyaepbLg4GGFJBPi8A6VIAj7zYknToRApdW0s1x/XX\nChewfJDckqsevTMovdbg8YkCgYEAxDYX+3mfvv/opo6HNNY3SfVunM+4vVJL+n8gWZ2w9kz3\nQ9Ub9YbRmI7iQaiVkO5xNuoG1n9bM+3Mnm84aQ1YeNT01YqeyQsipP5Wi+um0PzYTaBw9RO+\n8Gh6992OwlJiRtFk5WjalNWOxY4MU0ImnJwIfKQlUODvLmcixm68NYsCgYEAuAqI3jkk55Vd\nKvotREsX5wP7gPePM+7NYiZ1HNQL4Ab1f/bTojZdTV8Sx6YCR0fUiqMqnE+OBvfkGGBtw22S\nLesx6sWf99Ov58+x4Q0U5dpxL0Lb7d2Z+2Dtp+Z4jXFjNeeI4ae/qG/LOR/b0pE0J5F415ap\n7Mpq5v89vepUtrkCgYAjMXytu4v+q1Ikhc4UmRPDrUUQ1WVSd+9u19yKlnFGTFnRjej86hiw\nH3jPxBhHra0a53EgiilmsBGSnWpl1WH4EmJz5vBCKUAmjgQiBrueIqv9iHiaTNdjsanUyaWw\njyxXfXl2eI80QPXh02+8g1H/pzESgjK7Rg1AqnkfVH9nrwKBgQDJVxKBPTw9pigYMVt9iHrR\niCl9zQVjRMbWiPOc0J56+/5FZYm/AOGl9rfhQ9vGxXZYZiOP5FsNkwt05Y1UoAAH4B4VQwbL\nqod71qOcI0ywgZiIR87CYw40gzRfjWnN+YEEW1qfyoNLilEwJB8iB/T+ZePHGmJ4MmQ/cTn9\nxpdLXA==\n-----END RSA PRIVATE KEY-----\n',
  },
  {
    public: '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAzhI/CMRtNO45R0DD4NBXFRDYAjlB/UVGGdMJKbCIrD3Uq7r/ivedqRYUIccO\nqpeYeu9IH9iotkKq8TM0eCJAUr9WT0o5YzpGvaB8ut87xLh8SqK42VmYAvemUjI257LtDbms\nhoqzqt9Yq0sgC05b7L3r2xDTxnefeMUHYBwaerCr8PTBCu7NjK3eIWHGPouEwT46WoUpnoNm\nxdI16CoSMqtuxteG8c14qJbGR9AZujkRDntWOuL1m5KaUIc7XcAaXBt4FiPwoDoQmmCmydVC\njln3YwSrvL60iAQM6pzCxNRrJRWPYd2u7fgjir/W88w5KHOvdbUyemZWnd6SBExHuQIDAQAB\n-----END RSA PUBLIC KEY-----\n',
    private: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAzhI/CMRtNO45R0DD4NBXFRDYAjlB/UVGGdMJKbCIrD3Uq7r/ivedqRYU\nIccOqpeYeu9IH9iotkKq8TM0eCJAUr9WT0o5YzpGvaB8ut87xLh8SqK42VmYAvemUjI257Lt\nDbmshoqzqt9Yq0sgC05b7L3r2xDTxnefeMUHYBwaerCr8PTBCu7NjK3eIWHGPouEwT46WoUp\nnoNmxdI16CoSMqtuxteG8c14qJbGR9AZujkRDntWOuL1m5KaUIc7XcAaXBt4FiPwoDoQmmCm\nydVCjln3YwSrvL60iAQM6pzCxNRrJRWPYd2u7fgjir/W88w5KHOvdbUyemZWnd6SBExHuQID\nAQABAoIBAQDJ9iv9BbYaGBfe82SGIuoV5Uou87ru5EPN73yddTydwoN6Q21L316PZuoYKKUB\nIE36viSrwYWoCzLJ7etQihEMiCWo1A/mZikKlA1qgHptVHnMFCqiKiLHVbuV90zETCH0P7MM\nsUdhAkA+sQQY0JVbMs/DBXzomDic/k06LpDtCBNdjL7UIT5KyFbBqit+cV6H91Ujqg8MmzrU\ntOSw+63oSqZJkT6WPuA/NJNXqtFF+0aOKNX1ttrrTzSDhyp6AxOO7Wm++dpYBtcfnOc3EG65\nul9PfKsJwVZFVO+AAZwdLCeKjtCtWeJc/yXvSj2NTsjs3FKJkRAmmiMp5tH+vbE5AoGBAOhn\nKTXGI+ofA3iggByt2InCU+YIXsw1EbbhH4LGB8yyUA2SIjZybwUMKCkoMxmEumFP/FWgOL2w\nLlClqf9vZg9dBy8bDINJHm+9roYRO0/EhHA6IDSC+0X5BPZOexrBI07HJI7w7Y0WHFU8jK53\n55ps2YGT20n7haRMbbPMrq/3AoGBAOL+pY8bgCnKmeG2inun4FuD+0/aXAySXi70/BAABeHH\npogEfc0jv5SgygTiuC/2T84Jmsg0Y6M2l86srMrMA07xtyMbfRq7zih+K+EDoQ9HAwhDqxX5\nM7E8fPXscDzH2Y361QiGAQpjUcMix3hDV8oK537rYOmCYku18ZsVkjnPAoGAbE1u4fVlVTyA\ntJ0vNq45Q/GAgamS690rVStSMPIyPk02iyx3ryHi5NpGeO+X6KN269SHhiu1ZYiN/N1G/Jeg\nWzaCG4yiZygS/AXMKAQtvL2a7mXYDkCf8nrauiHWsqAg4RxiyA401dPg/kPKV5/fGZLyRbVu\nsup43BkV4n1XRv8CgYAmUIE1dJjfdPkgZiVd1epCyDZFNkBPRu1q06MwODDF+WMcllV9qMkP\nl0xCItqgDd1Ok8RygpVG2VIqam8IFAOC8b3NyTgGqSiVISba5jfrUjsqy/E21kdpZSJaiDwx\npjIMiwgmVigazsTgQSCWJhfNXKXSgHxtLbrVuLI9URjLdQKBgQDProyaG7pspt6uUdqMTa4+\nGVkUg+gIt5aVTf/Lb25K3SHA1baPamtbTDDf6vUjeJtTG+O+RMGqK5mB2MywjVHJdMGcJ44e\nogIh9eWY450oUoVBjEsdUd7Ef5KcpMFDUVFJwzCY371+Loqh2KYAk8WUSRzwGuw2QtLPO/L/\nQkKj4Q==\n-----END RSA PRIVATE KEY-----\n',
  },
  /* eslint-enable max-len */
];

// Randomly generated an X.509 certs using https://www.samltool.com/self_signed_certs.php
export const x509CertPairs = [
  /* eslint-disable max-len */
  {
    public: '-----BEGIN CERTIFICATE-----\nMIICZjCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQ0FADBQMQswCQYDVQQGEwJ1czEL\nMAkGA1UECAwCQ0ExDTALBgNVBAoMBEFjbWUxETAPBgNVBAMMCGFjbWUuY29tMRIw\nEAYDVQQHDAlTdW5ueXZhbGUwHhcNMTgxMjA2MDc1MTUxWhcNMjgxMjAzMDc1MTUx\nWjBQMQswCQYDVQQGEwJ1czELMAkGA1UECAwCQ0ExDTALBgNVBAoMBEFjbWUxETAP\nBgNVBAMMCGFjbWUuY29tMRIwEAYDVQQHDAlTdW5ueXZhbGUwgZ8wDQYJKoZIhvcN\nAQEBBQADgY0AMIGJAoGBAKphmggjiVgqMLXyzvI7cKphscIIQ+wcv7Dld6MD4aKv\n7Jqr8ltujMxBUeY4LFEKw8Terb01snYpDotfilaG6NxpF/GfVVmMalzwWp0mT8+H\nyzyPj89mRcozu17RwuooR6n1ofXjGcBE86lqC21UhA3WVgjPOLqB42rlE9gPnZLB\nAgMBAAGjUDBOMB0GA1UdDgQWBBS0iM7WnbCNOnieOP1HIA+Oz/ML+zAfBgNVHSME\nGDAWgBS0iM7WnbCNOnieOP1HIA+Oz/ML+zAMBgNVHRMEBTADAQH/MA0GCSqGSIb3\nDQEBDQUAA4GBAF3jBgS+wP+K/jTupEQur6iaqS4UvXd//d4vo1MV06oTLQMTz+rP\nOSMDNwxzfaOn6vgYLKP/Dcy9dSTnSzgxLAxfKvDQZA0vE3udsw0Bd245MmX4+GOp\nlbrN99XP1u+lFxCSdMUzvQ/jW4ysw/Nq4JdJ0gPAyPvL6Qi/3mQdIQwx\n-----END CERTIFICATE-----\n',
    private: '-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKphmggjiVgqMLXy\nzvI7cKphscIIQ+wcv7Dld6MD4aKv7Jqr8ltujMxBUeY4LFEKw8Terb01snYpDotf\nilaG6NxpF/GfVVmMalzwWp0mT8+HyzyPj89mRcozu17RwuooR6n1ofXjGcBE86lq\nC21UhA3WVgjPOLqB42rlE9gPnZLBAgMBAAECgYAwZ7g2FbqAZMQf/RKUORTiIw04\nXdbGLsi6/gZGNuUUrjxfGPiqxzaTFP+qk0zr3U4PEWB0v9uqvDFYoVURDhT7isxm\nH5bc6dxwvBRIy8tLtvxo0jMTotJaBhEHP3YMKxbC7lxo3PV5HLIve5nf9ChOypKp\n4zbP4d1IJjpu8ggrbQJBANoPCrJyXjsDgh8WAEpALAsgM4ugyJwdk8AHJUTy3IeJ\niYYB/RLVpYW8LI1dmqN5NPKbyKE+dsdSiiEpclsocl8CQQDIBt5DbO+tEGr5BGsk\nBi+P3E1M3KVV2eJv+inlgYkYeS/cdd5CJczCDwxeDk8DXsKvmOp0LCHeU2sCKjSy\nF07fAkB86KLjB1ptCZxu/CZcYhgYo3CDai2gJ90r4av6q/eheCqb5eW29UUkr18B\n932OaO7ojk5F90cI9IIFbv1/tFKXAkEAnrXUZWtqQMdmGW+IE21VD7CdJP9tsFDR\nekfkNlYxkVmWwDZFw/Z6IQAPsBFqYCIwF2Qdo0/hD6bgoTcb2LLlwQJATqOMr7yr\neYKLJ+edhwMHx4U5ZIT8l/MjDv4/6L6FgGYVo7gNjjIIsDXUOo3PlBOWe6fxb5+f\ntFlwxZNz+g9ONg==\n-----END PRIVATE KEY-----\n',
  },
  {
    public: '-----BEGIN CERTIFICATE-----\nMIICZjCCAc+gAwIBAgIBADANBgkqhkiG9w0BAQ0FADBQMQswCQYDVQQGEwJ1czEL\nMAkGA1UECAwCQ0ExDTALBgNVBAoMBEFjbWUxETAPBgNVBAMMCGFjbWUuY29tMRIw\nEAYDVQQHDAlTdW5ueXZhbGUwHhcNMTgxMjA2MDc1ODE4WhcNMjgxMjAzMDc1ODE4\nWjBQMQswCQYDVQQGEwJ1czELMAkGA1UECAwCQ0ExDTALBgNVBAoMBEFjbWUxETAP\nBgNVBAMMCGFjbWUuY29tMRIwEAYDVQQHDAlTdW5ueXZhbGUwgZ8wDQYJKoZIhvcN\nAQEBBQADgY0AMIGJAoGBAKuzYKfDZGA6DJgQru3wNUqv+S0hMZfP/jbp8ou/8UKu\nrNeX7cfCgt3yxoGCJYKmF6t5mvo76JY0MWwA53BxeP/oyXmJ93uHG5mFRAsVAUKs\ncVVb0Xi6ujxZGVdDWFV696L0BNOoHTfXmac6IBoZQzNNK4n1AATqwo+z7a0pfRrJ\nAgMBAAGjUDBOMB0GA1UdDgQWBBSKmi/ZKMuLN0ES7/jPa7q7jAjPiDAfBgNVHSME\nGDAWgBSKmi/ZKMuLN0ES7/jPa7q7jAjPiDAMBgNVHRMEBTADAQH/MA0GCSqGSIb3\nDQEBDQUAA4GBAAg2a2kSn05NiUOuWOHwPUjW3wQRsGxPXtbhWMhmNdCfKKteM2+/\nLd/jz5F3qkOgGQ3UDgr3SHEoWhnLaJMF4a2tm6vL2rEIfPEK81KhTTRxSsAgMVbU\nJXBz1md6Ur0HlgQC7d1CHC8/xi2DDwHopLyxhogaZUxy9IaRxUEa2vJW\n-----END CERTIFICATE-----\n',
    private: '-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKuzYKfDZGA6DJgQ\nru3wNUqv+S0hMZfP/jbp8ou/8UKurNeX7cfCgt3yxoGCJYKmF6t5mvo76JY0MWwA\n53BxeP/oyXmJ93uHG5mFRAsVAUKscVVb0Xi6ujxZGVdDWFV696L0BNOoHTfXmac6\nIBoZQzNNK4n1AATqwo+z7a0pfRrJAgMBAAECgYBG15vpnBSuH0VS+I80XQef6TtG\nA4wStx6MSbppLqi8epWV3nmdEgQszx5YEPqpDR53AZWP6WftkVtS1IypOChTwRIh\n73vheFJ4XYqjoU+2OUtj7hhMMHDBFhw7W3Jvz4PkPu9drmzBS8N5Dd38ROwhwoS3\nUD/18pxXXyd61s/+gQJBANSuA7fRna1qXmRmdwpQR1Mebh0dw2ZgOn4ekIgsfmgP\nGPznhsjWQEuT1BxIS8R8x4ZmCJY4W89GfUBLtWprBTsCQQDOrIyHCOzOmNYXcgRT\nhW+ZiSi+46FAYqCKawIwlq2M0GsJaMTdXFQFKTmnxiNvWxxDOeZcIsrc5uwEwr6A\n3I/LAkEAwuFBHurAZOsW20DYy2aMNKmplJx1NBXxAyfWoDDFE2ziJLuyUc2g1J/8\nuH22j7EW0xwjuiKiXeflVUkKTx0JiQJAUQb5OV/YZ88n8J008QHZlRpfLSfVaobA\nZkQ54Y7Rj+mObWvz8s1l63gUMKDP97KCzCCBHhJN8nlegydOxPq0LQJADBjkunGt\nfIGv6A3SG5/5nRYI1gHQsq30BaAPwx6BuDBtnaf5BpzcFvu1JMNHoVFYzmiykpwX\n1zUhaAtcX2BV9g==\n-----END PRIVATE KEY-----\n',
  },
  /* eslint-enable max-len */
];

// Randomly generated key pairs that don't correspond to anything related to Firebase or GCP
export const jwksKeyPair = {
  /* eslint-disable max-len */
  // The private key for this key pair is identical to the one used in ./mock.jwks.json
  private: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEArFYQyEdjj43mnpXwj+3WgAE01TSYe1+XFE9mxUDShysFwtVZ\nOHFSMm6kl+B3Y/O8NcPt5osntLlH6KHvygExAE0tDmFYq8aKt7LQQF8rTv0rI6MP\n92ezyCEp4MPmAPFD/tY160XGrkqApuY2/+L8eEXdkRyH2H7lCYypFC0u3DIY25Vl\nq+ZDkxB2kGykGgb1zVazCDDViqV1p9hSltmm4el9AyF08FsMCpk/NvwKOY4pJ/sm\n99CDKxMhQBaT9lrIQt0B1VqTpEwlOoiFiyXASRXp9ZTeL4mrLPqSeozwPvspD81w\nbgecd62F640scKBr3ko73L8M8UWcwgd+moKCJwIDAQABAoIBAEDPJQSMhE6KKL5e\n2NbntJDy4zGC1A0hh6llqtpnZETc0w/QN/tX8ndw0IklKwD1ukPl6OOYVVhLjVVZ\nANpQ1GKuo1ETHsuKoMQwhMyQfbL41m5SdkCuSRfsENmsEiUslkuRtzlBRlRpRDR/\nwxM8A4IflBFsT1IFdpC+yx8BVuwLc35iVnaGQpo/jhSDibt07j+FdOKEWkMGj+rL\nsHC6cpB2NMTBl9CIDLW/eq1amBOAGtsSKqoGJvaQY/mZf7SPkRjYIfIl2PWSaduT\nfmMrsYYFtHUKVOMYAD7P5RWNkS8oERucnXT3ouAECvip3Ew2JqlQc0FP7FS5CxH3\nWdfvLuECgYEA8Q7rJrDOdO867s7P/lXMklbAGnuNnAZJdAEXUMIaPJi7al97F119\n4DKBuF7c/dDf8CdiOvMzP8r/F8+FFx2D61xxkQNeuxo5Xjlt23OzW5EI2S6ABesZ\n/3sQWqvKCGuqN7WENYF3EiKyByQ22MYXk8CE7KZuO57Aj88t6TsaNhkCgYEAtwSs\nhbqKSCneC1bQ3wfSAF2kPYRrQEEa2VCLlX1Mz7zHufxksUWAnAbU8O3hIGnXjz6T\nqzivyJJhFSgNGeYpwV67GfXnibpr3OZ/yx2YXIQfp0daivj++kvEU7aNfM9rHZA9\nS3Gh7hKELdB9b0DkrX5GpLiZWA6NnJdrIRYbAj8CgYBCZSyJvJsxBA+EZTxOvk0Z\nZYGGCc/oUKb8p6xHVx8o35yHYQMjXWHlVaP7J03RLy3vFLnuqLvN71ixszviMQP7\n2LuDCJ2YBVIVzNWgY07cgqcgQrmKZ8YCY2AOyVBdX2JD8+AVaLJmMV49r1DYBj/K\nN3WlRPYJv+Ej+xmXKus+SQKBgHh/Zkthxxu+HQigL0M4teYxwSoTnj2e39uGsXBK\nICGCLIniiDVDCmswAFFkfV3G8frI+5a26t2Gqs6wIPgVVxaOlWeBROGkUNIPHMKR\niLgY8XJEg3OOfuoyql9niP5M3jyHtCOQ/Elv/YDgjUWLl0Q3KLHZLHUSl+AqvYj6\nMewnAoGBANgYzPZgP+wreI55BFR470blKh1mFz+YGa+53DCd7JdMH2pdp4hoh303\nXxpOSVlAuyv9SgTsZ7WjGO5UdhaBzVPKgN0OO6JQmQ5ZrOR8ZJ7VB73FiVHCEerj\n1m2zyFv6OT7vqdg+V1/SzxMEmXXFQv1g69k6nWGazne3IJlzrSpj\n-----END RSA PRIVATE KEY-----\n',
  public: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArFYQyEdjj43mnpXwj+3W\ngAE01TSYe1+XFE9mxUDShysFwtVZOHFSMm6kl+B3Y/O8NcPt5osntLlH6KHvygEx\nAE0tDmFYq8aKt7LQQF8rTv0rI6MP92ezyCEp4MPmAPFD/tY160XGrkqApuY2/+L8\neEXdkRyH2H7lCYypFC0u3DIY25Vlq+ZDkxB2kGykGgb1zVazCDDViqV1p9hSltmm\n4el9AyF08FsMCpk/NvwKOY4pJ/sm99CDKxMhQBaT9lrIQt0B1VqTpEwlOoiFiyXA\nSRXp9ZTeL4mrLPqSeozwPvspD81wbgecd62F640scKBr3ko73L8M8UWcwgd+moKC\nJwIDAQAB\n-----END PUBLIC KEY-----\n',
};

/**
 * Generates a mocked Firebase ID token.
 *
 * @param {object} overrides Overrides for the generated token's attributes.
 * @param {object} claims Extra claims to add to the token.
 * @param {string} secret Custom key to sign the token with.
 * @return {string} A mocked Firebase ID token with any provided overrides included.
 */
export function generateIdToken(overrides?: object, claims?: object, secret?: string): string {
  const options = _.assign({
    audience: projectId,
    expiresIn: ONE_HOUR_IN_SECONDS,
    issuer: 'https://securetoken.google.com/' + projectId,
    subject: uid,
    algorithm: ALGORITHM,
    header: {
      kid: certificateObject.private_key_id,
    },
  }, overrides);

  const payload = {
    ...developerClaims,
    ...claims,
  };

  return jwt.sign(payload, secret ?? certificateObject.private_key, options);
}

/**
 * Generates a mocked Auth Blocking token.
 *
 * @param overrides Overrides for the generated token's attributes.
 * @param claims Extra claims to add to the token.
 * @param {string} secret Custom key to sign the token with.
 * @return A mocked Auth Blocking token with any provided overrides included.
 */
export function generateAuthBlockingToken(overrides?: object, claims?: object, secret?: string): string {
  const options = _.assign({
    audience: `https://us-central1-${projectId}.cloudfunctions.net/functionName`,
    expiresIn: TEN_MINUTES_IN_SECONDS,
    issuer: 'https://securetoken.google.com/' + projectId,
    subject: uid,
    algorithm: ALGORITHM,
    header: {
      kid: certificateObject.private_key_id,
    },
  }, overrides);

  const payload = {
    ...developerClaims,
    ...claims,
  };

  return jwt.sign(payload, secret ?? certificateObject.private_key, options);
}

/**
 * Generates a mocked Firebase session cookie.
 *
 * @param {object=} overrides Overrides for the generated token's attributes.
 * @param {number=} expiresIn Optional custom session cookie expiration in seconds.
 * @return {string} A mocked Firebase session cookie with any provided overrides included.
 */
export function generateSessionCookie(overrides?: object, expiresIn?: number): string {
  const options = _.assign({
    audience: projectId,
    expiresIn: expiresIn || ONE_HOUR_IN_SECONDS,
    issuer: 'https://session.firebase.google.com/' + projectId,
    subject: uid,
    algorithm: ALGORITHM,
    header: {
      kid: certificateObject.private_key_id,
    },
  }, overrides);

  return jwt.sign(developerClaims, certificateObject.private_key, options);
}

/**
 * Generates a mocked App Check token.
 *
 * @param {object} overrides Overrides for the generated token's attributes.
 * @return {string} A mocked App Check token with any provided overrides included.
 */
export function generateAppCheckToken(overrides?: object): string {
  const options = _.assign({
    audience: ['projects/' + projectNumber, 'projects/' + projectId],
    expiresIn: ONE_HOUR_IN_SECONDS,
    issuer: 'https://firebaseappcheck.googleapis.com/' + projectNumber,
    subject: appId,
    algorithm: ALGORITHM,
    header: {
      kid: jwksResponse.keys[0].kid,
    },
  }, overrides);

  return jwt.sign(developerClaims, jwksKeyPair.private, options);
}

/** Mock socket emitter class. */
export class MockSocketEmitter extends events.EventEmitter {
  public setTimeout: (_: number) => void = () => undefined;
}

/** Mock stream passthrough class with dummy abort method. */
export class MockStream extends stream.PassThrough {
  public abort: () => void = () => undefined;
}

export interface MockHttp2Request {
  headers: http2.OutgoingHttpHeaders,
  data: any
}

export interface MockHttp2Response {
  headers?: http2.IncomingHttpHeaders & http2.IncomingHttpStatusHeader,
  data?: Buffer,
  delay?: number,
  sessionError?: any
  streamError?: any,
}

export class Http2Mocker {
  private connectStub: sinon.SinonStub | null;
  private originalConnect = http2.connect;
  private timeouts: NodeJS.Timeout[] = [];
  private mockResponses: MockHttp2Response[] = [];
  public requests: MockHttp2Request[] = [];

  public http2Stub(mockResponses: MockHttp2Response[]): void {
    this.mockResponses = mockResponses
    this.connectStub = sinon.stub(http2, 'connect');
    this.connectStub.callsFake((_target: any, options: any) => {
      const session = this.originalConnect('https://www.example.com', options);
      session.request = this.createMockRequest(session)
      return session;
    })
  }

  private createMockRequest(session:http2.ClientHttp2Session) {
    return (requestHeaders: http2.OutgoingHttpHeaders) => {
      // Create a mock ClientHttp2Stream to return
      const mockStream = new stream.Readable({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        read() {} 
      }) as http2.ClientHttp2Stream;

      mockStream.end = (data: any) => {
        this.requests.push({ headers: requestHeaders, data: data })
        return mockStream
      };
  
      mockStream.setTimeout = (timeout, callback: () => void) => {
        this.timeouts.push(setTimeout(callback, timeout))
      }

      const mockRes = this.mockResponses.shift();
      if (mockRes) {
        this.timeouts.push(setTimeout(() => {
          if (mockRes.sessionError) {
            session.emit('error', mockRes.sessionError)
          }
          if (mockRes.streamError) {
            mockStream.emit('error', mockRes.streamError)
          }
          else {
            mockStream.emit('response', mockRes.headers);
            mockStream.emit('data', mockRes.data);
            mockStream.emit('end');
          }
        }, mockRes.delay))
      }
      else {
        throw Error('A mock request response was expected but not found.')
      }
      return mockStream;
    }
  }

  public done(): void {
    // Clear timeouts
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout)
    })

    // Remove stub
    if (this.connectStub) {
      this.connectStub.restore();
      this.connectStub = null;
    }

    // Check if all mock requests responces were used
    if (this.mockResponses.length > 0) {
      throw Error('A extra mock request was provided but not used.')
    }

    this.requests = []
  }
}

/**
 * MESSAGING
 */
const mockPayloadDataValue = {
  foo: 'one',
  bar: 'two',
};

const mockPayloadNotificationValue = {
  title: 'Mock Title',
  body: 'Mock body.',
};

export const messaging = {
  topic: 'mock-topic',
  topicWithPrefix: '/topics/mock-topic',
  topicWithPrivatePrefix: '/topics/private/mock-topic',
  condition: "'mock-topic-0' in topics || ('mock-topic-1' in topics && 'mock-topic-2' in topics)",
  messageId: 1212121212,
  multicastId: 1234567890,
  notificationKey: 'mock-notification-key',
  registrationToken: 'mock-registration-token',
  payloadDataOnly: {
    data: mockPayloadDataValue,
  },
  payloadNotificationOnly: {
    notification: mockPayloadNotificationValue,
  },
  payload: {
    data: mockPayloadDataValue,
    notification: mockPayloadNotificationValue,
  },
  options: {
    collapseKey: 'foo',
    dryRun: true,
  },
};
