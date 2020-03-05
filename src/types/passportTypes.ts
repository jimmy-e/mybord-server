import { AuthenticateOptions } from 'passport';
import express from 'express';

export interface AuthenticateParams {
  authenticateOptions: AuthenticateOptions;
  strategyName: string;
}

export interface AuthenticateReturn {
  user: object | undefined;
  info: Info | undefined;
}

export interface BuildPassportContextParams {
  authenticate: (
    { authenticateOptions, strategyName }: AuthenticateParams
  ) => Promise<AuthenticateReturn>;
  isAuthenticated: () => boolean;
  login: ({ authenticateOptions, user }: LoginParams) => Promise<void>;
  logout: () => void;
}

export interface ExpressParams {
  request: express.Request;
  response: express.Response;
}

export interface Info {
  info: boolean;
  message?: string;
}

export interface LoginParams {
  authenticateOptions: AuthenticateOptions;
  user: object;
}

export interface PromisifiedAuthenticateParams extends ExpressParams {
  authenticateOptions: AuthenticateOptions;
  strategyName: string;
}

export interface PromisifiedLoginParams {
  authenticateOptions: AuthenticateOptions;
  request: express.Request;
  user: object;
}

export type VerifyFunction = (
  email: string,
  password: string,
  done: () => void
) => void;
