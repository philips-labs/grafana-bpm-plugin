// SPDX-License-Identifier: MIT
// Copyright (c) 2022 Koninklijke Philips N.V., https://www.philips.com

import { FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { DirectedGraphOptions } from './types';
import { DirectedGraphPanel } from './DirectedGraphPanel';

export const plugin = new PanelPlugin<DirectedGraphOptions>(DirectedGraphPanel)
.useFieldConfig({
  disableStandardOptions: [
    FieldConfigProperty.Min,
    FieldConfigProperty.Max,
    FieldConfigProperty.Mappings,
    FieldConfigProperty.Decimals,
    FieldConfigProperty.NoValue,
    FieldConfigProperty.Links
  ]
})
.setPanelOptions(builder => {
  return builder
    .addBooleanSwitch({
      path: 'isDragable',
      name: 'Allow Dragging of Nodes?',
      description: 'Should dragging of nodes be allowed?',
      defaultValue: false
    })
    .addBooleanSwitch({
      path: 'showMiniMap',
      name: 'Show mini map?',
      description: 'Should mini map of the directed graph be shown?',
      defaultValue: false
    })
    .addNumberInput({
      path: 'minimumZoom',
      name: 'Minimum Zoom',
      description: 'Minimum Zoom',
      defaultValue: 0.05
    })
});