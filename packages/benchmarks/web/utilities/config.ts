export const PORT_ALLOCATION = {
  IGNISIA: 3000,
  HONO: 3001,
  BUN: 3002,
};

export const FRAMEWORK = {
  IGNISIA: 'Ignisia',
  HONO: 'Hono',
  BUN: 'Bun',
};

export const FRAMEWORKS = Object.values(FRAMEWORK);

export const PORTS = Object.values(PORT_ALLOCATION);

export const FRAMEWORK_PORTS = [
  { framework: FRAMEWORK.IGNISIA, port: PORT_ALLOCATION.IGNISIA },
  { framework: FRAMEWORK.HONO, port: PORT_ALLOCATION.HONO },
  { framework: FRAMEWORK.BUN, port: PORT_ALLOCATION.BUN },
];

export const BENCHMARK = {
  CONNECTIONS: 100,
  DURATION: 30,
  PIPELINING: 10,
};
