import { Injectable, computed, signal, untracked } from '@angular/core';
import { CfgPath } from './cfg-path';
import config from '../../generated/config.json';
import { CfgNode } from './cfg-node';

@Injectable({ providedIn: 'root' })
export class EditorProvider {
  root = new CfgNode.Root(config);
  path = signal<CfgPath | undefined>(undefined);

  focused = computed(() => {
    const path = this.path();
    if (path === undefined) return undefined;
    return untracked(() => this.root.find(path));
  });
}
