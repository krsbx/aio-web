import type { ApiMethod } from '../../app/constants';

export type CorsOrigins =
  | string
  | string[]
  | ((origin: string | null) => string | false);

export interface CORSOptions {
  origin?: CorsOrigins;
  allowMethods?: (ApiMethod | (string & {}))[];
  allowHeaders?: string[];
  exposeHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}
