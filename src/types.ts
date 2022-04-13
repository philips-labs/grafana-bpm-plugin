// SPDX-License-Identifier: MIT
// Copyright (c) 2022 Koninklijke Philips N.V., https://www.philips.com

import { DisplayValue } from "@grafana/data";

export interface DirectedGraphOptions {
  isDragable: boolean,
  showMiniMap: boolean,
  minimumZoom: number
}

type NodeType = "twoTextFourNumber" | "twoTextThreeNumber" | "twoTextTwoNumber" | "twoTextOneNumber" | "oneTextFourNumber" | "oneTextThreeNumber" | "oneTextTwoNumber" | "oneTextOneNumber" | "oneText" | "twoText"

export interface DirectedGraphVertex {
  id: string,
  type: NodeType,
  title: DisplayValue,
  sub_text: DisplayValue,
  number1: DisplayValue,
  number2: DisplayValue,
  number3: DisplayValue,
  number4: DisplayValue,
  width: number,
  height: number,
  url: string,
}