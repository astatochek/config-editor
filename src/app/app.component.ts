import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TreeComponent } from './tree.component';
import { CfgPath } from './cfg-path';
import { EditorProvider as EditorProvider } from './editor.provider';
import { PanelComponent } from './panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeComponent, PanelComponent],
  template: `<div class="w-full grid grid-cols-2">
    <div class="max-h-screen overflow-y-auto">
      <cfg-tree [node]="provider.root" [path]="path()" />
    </div>
    <div>
      @if (provider.focused(); as node) {
        <cfg-panel [node]="node" />
      }
    </div>
  </div>`,
})
export class AppComponent {
  provider = inject(EditorProvider);
  path = computed(() => CfgPath.NullPath.derive(this.provider.root.id()));
}
