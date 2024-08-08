import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CfgNode } from './cfg-node';
import { EditorProvider } from './editor.provider';
import { LeafCfgNode } from './leaf-node';

@Component({
  selector: 'cfg-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 [class]="class()">{{ node().name }}</h1>
    <h2 class="text-xs">{{ path() }}</h2>
    <div class="grid grid-cols-2">
      @for (parameter of parameters(); track parameter.name) {
        <div>{{ parameter.name }}</div>
        <div>
          <input
            (input)="onInput($event, parameter)"
            [value]="parameter.value()"
          />
        </div>
      }
    </div>
  `,
})
export class PanelComponent {
  node = input.required<CfgNode>();

  provider = inject(EditorProvider);
  path = computed(() => this.provider.path()?.toString());

  parameters = computed(
    () =>
      this.node().children.filter(
        (child) => !CfgNode.isCfgNode(child),
      ) as LeafCfgNode[],
  );

  onInput(event: Event, parameter: LeafCfgNode): void {
    parameter.setValue((event.target as HTMLInputElement).value);
  }

  class = computed(() => {
    const isError = this.node().hasError();
    return `text-lg ${isError ? 'bg-red-500' : ''}`;
  });
}
