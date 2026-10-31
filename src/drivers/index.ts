import type { Target } from '../schema.js';
import { DesktopDriver } from './desktop.js';
import { WebDriver } from './web.js';
export function createDriver(target: Target) { return target.kind === 'desktop' ? new DesktopDriver(target) : new WebDriver(target); }
