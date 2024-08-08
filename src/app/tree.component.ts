import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CfgNode } from './cfg-node';
import { CfgPath } from './cfg-path';
import { EditorProvider } from './editor.provider';

@Component({
  selector: 'cfg-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-start justify-start">
      <button [class]="class()" (click)="toggle()">{{ node().id() }}</button>
      @if (node().isOpen()) {
        @for (child of children(); track child.id()) {
          <div class="pl-4">
            <cfg-tree [node]="child" [path]="path().derive(child.id())" />
          </div>
        }
      }
    </div>
  `,
})
export class TreeComponent {
  node = input.required<CfgNode>();
  path = input.required<CfgPath>();

  provider = inject(EditorProvider);

  children = computed(() => this.node().children.filter(CfgNode.isCfgNode));

  isOpen = computed(() => this.node().isOpen());
  class = computed(() => {
    const isError =
      this.node().hasError() ||
      (!this.node().isOpen() && this.node().hasErrorRecursive());
    const errorClass = isError ? 'bg-red-500' : '';

    const isFocused = this.node().id() === this.provider.focused()?.id();
    const focusedClass = isFocused ? 'font-bold' : '';
    return `${errorClass} ${focusedClass}`;
  });

  toggle(): void {
    this.node().isOpen.set(!this.node().isOpen());
    this.provider.path.set(this.path());
  }
}
