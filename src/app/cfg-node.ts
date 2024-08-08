import { Signal, computed, signal } from '@angular/core';
import { CfgPath } from './cfg-path';
import { LeafCfgNode } from './leaf-node';

export type CfgNodeDto = Record<string, any>;

export class CfgNode {
  readonly id: Signal<string>;
  constructor(
    readonly name: string,
    readonly children: (CfgNode | LeafCfgNode)[],
  ) {
    const id = children.find((node) => node.name === 'id') as LeafCfgNode;
    this.id = computed(() => `${name}=${id.value()}`);
  }

  isOpen = signal(false);
  hasError = computed(() =>
    this.children.some((node) => {
      const isLeaf = !CfgNode.isCfgNode(node);
      return isLeaf && node.hasError();
    }),
  );

  hasErrorRecursive: Signal<boolean> = computed(() =>
    this.children.some((node) => {
      if (CfgNode.isCfgNode(node)) {
        return node.hasErrorRecursive();
      }
      return node.hasError();
    }),
  );

  private findBySegments(segments: string[]): CfgNode {
    const [first, ...rest] = segments;
    if (this.id() === first) return this.findBySegments(rest);
    if (first === undefined) return this;
    const target = this.children.find(
      (child) => CfgNode.isCfgNode(child) && child.id() === first,
    ) as CfgNode;

    if (rest.length === 0) {
      return target;
    }

    return target.findBySegments(rest);
  }

  static Root = class RootCfgNode extends CfgNode {
    constructor(dto: CfgNodeDto) {
      const key = Object.keys(dto)[0];
      const node = CfgNode.fromDto(key, dto[key][0]);
      super(node.name, node.children);
    }

    find(path: CfgPath): CfgNode {
      return this.findBySegments(path.toSegments());
    }
  };

  static isCfgNode(o: any): o is CfgNode {
    return o instanceof CfgNode;
  }

  static fromDto(name: string, dto: CfgNodeDto): CfgNode {
    const children = Array.from(Object.entries(dto)).reduce(
      (children, [key, value]) => {
        if (Array.isArray(value)) {
          return children.concat(...value.map((v) => CfgNode.fromDto(key, v)));
        }
        return children.concat(new LeafCfgNode(key, value));
      },
      [] as any[],
    );
    return new CfgNode(name, children);
  }
}
