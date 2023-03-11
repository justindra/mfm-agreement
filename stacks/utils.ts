import { App } from 'sst/constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

export const WEB_DOMAIN_NAME = 'mfm.justindra.com';
export const HOSTED_ZONE = 'justindra.com';

/**
 * Check if the current stage is a production stage or not
 * @param stage The stage to check
 */
export const isProduction = (stage: string) => stage === 'prod';

/**
 * Get the app's domain name for the SST App
 * @param app The current SST App to get the URL for
 */
export const getWebDomain = (
  app: App,
  rootDomainName: string = WEB_DOMAIN_NAME
) =>
  isProduction(app.stage)
    ? `${rootDomainName}`
    : `${app.stage}.${rootDomainName}`;

/**
 * Get the app's URL for the SST App
 * @param app The current SST App, used to check the stage
 * @param rootDomainName The root domain name to use
 * @param subdomain The optional subdomain to use
 */
export const getWebUrl = (
  app: App,
  rootDomainName: string = WEB_DOMAIN_NAME,
  subdomain?: string
) =>
  app.local
    ? 'http://localhost:3000'
    : subdomain
    ? `https://${subdomain}.${getWebDomain(app, rootDomainName)}`
    : `https://${getWebDomain(app, rootDomainName)}`;

/**
 * Get the API Domain for the SST App
 * @param app The current SST App to get the domain for
 */
export const getApiDomain = (app: App) =>
  isProduction(app.stage)
    ? `api.${WEB_DOMAIN_NAME}`
    : `api.${app.stage}.${WEB_DOMAIN_NAME}`;

/**
 * Get the API URL for the SST App
 * @param app The current SST App to get the URL for
 */
export const getApiUrl = (app: App) => `https://${getApiDomain(app)}`;

/**
 * Get the removal policy to use. Generally speaking, in production we want to
 * retain it. But otherwise, we can just remove it when we remove the stack.
 * @param app The SST App to check
 * @returns
 */
export const getRemovalPolicy = (app: App): RemovalPolicy =>
  isProduction(app.stage) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
