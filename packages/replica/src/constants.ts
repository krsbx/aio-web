export const ReplicaInstanceType = {
  SOCKET: 'socket',
  FILE: 'file',
} as const;

export type ReplicaInstanceType =
  (typeof ReplicaInstanceType)[keyof typeof ReplicaInstanceType];
