import { CfgNodeDto } from './cfg-node';

export class CfgBuilder {
  private constructor(
    readonly name: string,
    readonly multiplicity: number,
    readonly parameters: CfgNodeDto[],
  ) {}

  build(): CfgNodeDto {
    const ids = Array.from(Array(this.multiplicity).keys()).map(
      (index) => `${index + 1}`,
    );
    return {
      [this.name]: ids.map((id) =>
        this.parameters.reduce(
          (node, parameter) => {
            return { ...node, ...parameter };
          },
          { id },
        ),
      ),
    };
  }

  addParam(name: string, value: string): CfgBuilder {
    this.parameters.push({ [name]: value });
    return this;
  }

  addNode(node: CfgBuilder): CfgBuilder {
    this.parameters.push(node.build());
    return this;
  }

  static node(name: string, multiplicity: number): CfgBuilder {
    return new CfgBuilder(name, multiplicity, []);
  }
}
