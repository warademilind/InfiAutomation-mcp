import type { Snapshot, Step, Target } from '../schema.js';
export interface Driver {
  readonly kind: Target['kind'];
  start(): Promise<void>;
  snapshot(depth?: number, maxNodes?: number): Promise<Snapshot>;
  act(step: Step): Promise<unknown>;
  screenshot(path: string): Promise<void>;
  menus(depth?: number): Promise<unknown>;
  traceStart(): Promise<void>;
  traceStop(path: string): Promise<void>;
  close(): Promise<void>;
}
