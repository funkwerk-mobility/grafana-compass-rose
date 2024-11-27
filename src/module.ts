import { PanelPlugin } from '@grafana/data';
import { CompassPanel } from './CompassPanel';
import { PanelOptions } from './types';

export const plugin = new PanelPlugin<PanelOptions>(CompassPanel).setPanelOptions(builder => {
  return builder
    .addNumberInput({
      path: 'headingField',
      name: 'Heading Field',
      description: 'Field containing heading value (0-360)',
      defaultValue: 0,
    });
});
