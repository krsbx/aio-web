export const PORT_ALLOCATION = {
  IGNISIA: 3000,
  HONO: 3002,
  BUN: 3003,
  ELYSIA: 3004,
};

export const FRAMEWORK = {
  IGNISIA: 'Ignisia',
  HONO: 'Hono',
  BUN: 'Bun',
  ELYSIA: 'Elysia',
};

export const FRAMEWORKS = Object.values(FRAMEWORK);

export const PORTS = Object.values(PORT_ALLOCATION);

export const FRAMEWORK_PORTS = [
  { framework: FRAMEWORK.IGNISIA, port: PORT_ALLOCATION.IGNISIA },
  { framework: FRAMEWORK.HONO, port: PORT_ALLOCATION.HONO },
  { framework: FRAMEWORK.BUN, port: PORT_ALLOCATION.BUN },
  { framework: FRAMEWORK.ELYSIA, port: PORT_ALLOCATION.ELYSIA },
];

export const BENCHMARK = {
  CONNECTIONS: 100,
  DURATION: 30,
  PIPELINING: 10,
};
