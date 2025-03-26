export const ReplicaInstanceType = {
  SOCKET: 'SOCKET',
  FILE: 'FILE',
} as const;

export type ReplicaInstanceType =
  (typeof ReplicaInstanceType)[keyof typeof ReplicaInstanceType];

export type ReplicaInstanceMap = {
  [K in ReplicaInstanceType]: K extends typeof ReplicaInstanceType.FILE
    ? `file://${string}`
    : K extends typeof ReplicaInstanceType.SOCKET
      ? WebSocket
      : never;
};
