import type { Context } from '@ignisia/core';
import type { JSX } from 'react';

export interface Page {
  default(props: Record<string, unknown>): JSX.Element;
  getServerSideProps?(ctx: Context): Promise<Record<string, unknown>>;
  metadata?: Record<string, unknown>;
  generateMetadata?(props: Record<string, unknown>): Record<string, unknown>;
}
