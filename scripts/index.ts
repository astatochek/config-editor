import { CfgBuilder } from '../src/app/builder';

const cfg = CfgBuilder.node('ManagedElement', 1)
  .addParam('displayedName', 'Base Station')
  .addNode(
    CfgBuilder.node('MANAGEMENT', 200)
      .addParam('ref', 'ManagedElement=1')
      .addNode(
        CfgBuilder.node('CELL', 1).addNode(
          CfgBuilder.node('FDD', 10).addParam('label', 'test'),
        ),
      ),
  )
  .addNode(
    CfgBuilder.node('HARDWARE', 200)
      .addParam('IPv6', 'ManagedElement=1')
      .addNode(CfgBuilder.node('IPMSV', 200).addParam('layer', '')),
  )
  .build();

Bun.write('./generated/config.json', JSON.stringify(cfg));
