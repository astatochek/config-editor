export const DnLevelSeparator = ',';
export const DnIndexSeparator = '=';

export class CfgPath {
  static NullPath = new CfgPath('');

  constructor(private path: string) {}

  derive(fullId: string): CfgPath {
    return new CfgPath(
      `${this.path}${this.path === '' ? '' : DnLevelSeparator}${fullId}`,
    );
  }

  toSegments(): string[] {
    return this.path.split(DnLevelSeparator);
  }

  toString(): string {
    return this.path;
  }
}
