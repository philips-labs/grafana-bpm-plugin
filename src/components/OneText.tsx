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

function OneText({ data }: { data: DirectedGraphVertex }) {

    console.log("Rendering OneText");

    const theme2 = useTheme2();

    return (
        <div className="maincontainer">
            <Handle type="target" position={Position.Top} />
            <table className="mainTable">
                <tr>
                    <td className='titleCell'>
                        <BigValue
                            height={295}
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
            </table>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
};

export default OneText;