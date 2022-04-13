// SPDX-License-Identifier: MIT
// Copyright (c) 2022 Koninklijke Philips N.V., https://www.philips.com

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DirectedGraphVertex } from 'types';
import {
    BigValue,
    BigValueColorMode,
    BigValueGraphMode,
    BigValueJustifyMode,
    BigValueTextMode,
    useTheme2
} from '@grafana/ui';

function TwoTextOneNumber({ data }: { data: DirectedGraphVertex }) {

    console.log("Rendering TwoTextOneNumber");

    const theme2 = useTheme2();

    return (
        <div className="maincontainer">
            <Handle type="target" position={Position.Top} />
            <table className="mainTable">
                <tr>
                    <td className='titleCell'>
                        <BigValue
                            height={59}
                            width={395}
                            theme={theme2}
                            justifyMode={BigValueJustifyMode.Center}
                            graphMode={BigValueGraphMode.None}
                            colorMode={BigValueColorMode.Value}
                            textMode={BigValueTextMode.Value}
                            value={data.title}
                        />
                    </td>
                </tr>
                <tr>
                    <td className='subTitleCell'>
                        <BigValue
                            height={39}
                            width={395}
                            theme={theme2}
                            justifyMode={BigValueJustifyMode.Center}
                            graphMode={BigValueGraphMode.None}
                            colorMode={BigValueColorMode.Value}
                            textMode={BigValueTextMode.Value}
                            value={data.sub_text}
                        />
                    </td>
                </tr>
                <tr>
                    <td className='numberCellEx'>
                        <BigValue
                            height={198}
                            width={195}
                            theme={theme2}
                            justifyMode={BigValueJustifyMode.Center}
                            graphMode={BigValueGraphMode.None}
                            colorMode={BigValueColorMode.Value}
                            textMode={BigValueTextMode.ValueAndName}
                            value={data.number1}
                        />
                    </td>
                </tr>
            </table>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
};

export default TwoTextOneNumber;