import { computed, signal } from '@angular/core';

export class LeafCfgNode {
  value = signal(this.initialValue);
  errors = signal<string[]>([]);
  hasError = computed(() => this.errors().length > 0);

  constructor(
    readonly name: string,
    readonly initialValue: string,
  ) {}

  setValue(newValue: string): void {
    this.value.set(newValue);
    this.revalidate();
  }

  revalidate(): void {
    if (this.value().length === 0) {
      this.errors.set(['length']);
    } else {
      this.errors.set([]);
    }
  }
}
