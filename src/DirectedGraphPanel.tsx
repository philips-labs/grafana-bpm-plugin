// SPDX-License-Identifier: MIT
// Copyright (c) 2022 Koninklijke Philips N.V., https://www.philips.com

import React, { useState, useEffect } from 'react';
import { getFieldDisplayName, LoadingState, PanelProps } from '@grafana/data';
import { DirectedGraphOptions } from 'types';
import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';
import { useStyles } from '@grafana/ui';
import ReactFlow, { Node, Edge, MarkerType, Position, ReactFlowInstance, useNodesState, useEdgesState, MiniMap, Controls } from 'react-flow-renderer';
import dagre from 'dagre';

import 'components/componentstyle.css'

import TwoTextFourNumber from 'components/TwoTextFourNumber';
import TwoTextThreeNumber from 'components/TwoTextThreeNumber';
import TwoTextTwoNumber from 'components/TwoTextTwoNumber';
import TwoTextOneNumber from 'components/TwoTextOneNumber';
import OneTextFourNumber from 'components/OneTextFourNumber';
import OneTextThreeNumber from 'components/OneTextThreeNumber';
import OneTextTwoNumber from 'components/OneTextTwoNumber';
import OneTextOneNumber from 'components/OneTextOneNumber';
import OneText from 'components/OneText';
import TwoText from 'components/TwoText';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Custom node types
const nodeTypes = { 
    twoTextFourNumber: TwoTextFourNumber,
    twoTextThreeNumber: TwoTextThreeNumber,
    twoTextTwoNumber: TwoTextTwoNumber,
    twoTextOneNumber: TwoTextOneNumber,
    oneTextFourNumber: OneTextFourNumber,
    oneTextThreeNumber: OneTextThreeNumber,
    oneTextTwoNumber: OneTextTwoNumber,
    oneTextOneNumber: OneTextOneNumber,
    oneText: OneText,
    twoText: TwoText
};

interface Props extends PanelProps<DirectedGraphOptions> { };

// Layout computation function
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {

    // Is the layout horizontal or vertical?
    const isHorizontal = direction === 'LR';

    // Set layout direction on dagre graph
    dagreGraph.setGraph({ rankdir: direction });

    // set nodes
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: node.data.nodeWidth, height: node.data.nodeHeight });
    });

    // set edges
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Call layout
    dagre.layout(dagreGraph);

    nodes.forEach((node: Node) => {

        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - node.data.nodeWidth / 2,
            y: nodeWithPosition.y - node.data.nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
}

// The vertex click handler
const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.data && node.data.url && node.data.url.startsWith('http')) {
        window.open(node.data.url, '_blank');
    } else {
        console.error('Node does not have valid URL.');
    }
}

// Hardcoded height and width of the vertex box
// This makes it easier to render the directed graph using dagrejs
const HEIGHT_OF_VERTEX_BOX = 300;
const WIDTH_OF_VERTEX_BOX = 400;

export const DirectedGraphPanel: React.FC<Props> = ({ options, data, width, height }) => {

    // Nodes and edges
    const [nodes, setNodes] = useNodesState([])
    const [edges, setEdges] = useEdgesState([])
    const [shouldLayout, setShouldLayout] = useState<boolean>(true);
    const [errorInInputs, setErrorInInputs] = useState<boolean>(false);
    const [errorInData, setErrorInData] = useState<boolean>(false);
    const [isDragable, setIsDragable] = useState<boolean>(false);
    const [showMiniMap, setShowMiniMap] = useState<boolean>(false);
    const [minimumZoom, setMinimumZoom] = useState(0.05);
    const [startTime, setStartTime] = useState(data.request?.startTime);
    const [endtTime, setEndTime] = useState(data.request?.endTime);

    const styles = useStyles(getStyles);

    // Has the options changed? If yes then prepare to render.
    if (isDragable !== options.isDragable) {
        setIsDragable(options.isDragable);
        setShouldLayout(true);
    }

    // Has the option to show / hide moni map changed?
    if (showMiniMap !== options.showMiniMap) {
        setShowMiniMap(options.showMiniMap);
        setShouldLayout(true);
    }

    // Has the minimum zoom changed?
    if (minimumZoom !== options.minimumZoom) {
        setMinimumZoom(options.minimumZoom);
        setShouldLayout(true);
    }

    // We should have two data series - if not then just render an error.
    if (data && data.series && data.series.length !== 2) {
        setErrorInInputs(true);
        setShouldLayout(true);
    }

    // Has the time range changed? If yes then we should layout
    if (startTime !== data.request?.startTime || endtTime !== data.request?.endTime) {
        setStartTime(data.request?.startTime);
        setEndTime(data.request?.endTime);
        setShouldLayout(true);
    }

    useEffect(() => {

        if (shouldLayout && data && data.state === LoadingState.Done) {
            try {

                // temp node and edge arrays
                let tempNodes = [];
                let tempEdges = [];

                // Get the nodes and edges data frames
                let nodesFrame = data.series[0];
                let edgesFrame = data.series[1];

                // Extract nodes data from the first series
                const id = nodesFrame.fields.find((field) => field.name === "id");
                const type = nodesFrame.fields.find((field) => field.name === "type");
                const title = nodesFrame.fields.find((field) => field.name === "title");
                const sub_text = nodesFrame.fields.find((field) => field.name === "sub_text");
                const number1 = nodesFrame.fields.find((field) => field.name === "number1")!;
                const number2 = nodesFrame.fields.find((field) => field.name === "number2")!;
                const number3 = nodesFrame.fields.find((field) => field.name === "number3")!;
                const number4 = nodesFrame.fields.find((field) => field.name === "number4")!;

                // Extract the display names of the number attributes
                // They will be used as title while rendering the number
                const number1DisplayName = getFieldDisplayName(number1, nodesFrame);
                const number2DisplayName = getFieldDisplayName(number2, nodesFrame);
                const number3DisplayName = getFieldDisplayName(number3, nodesFrame);
                const number4DisplayName = getFieldDisplayName(number4, nodesFrame);

                const url = nodesFrame.fields.find((field) => field.name === "url");

                for (let i = 0; i < nodesFrame.length; i++) {
                    // Create the vertex variable
                    let vertex = {
                        id: id?.values.get(i),
                        type: type?.values.get(i),
                        title: title?.display!(title?.values.get(i)),
                        sub_text: sub_text?.display!(sub_text?.values.get(i)),
                        number1: number1?.display!(number1?.values.get(i)),
                        number2: number2?.display!(number2?.values.get(i)),
                        number3: number3?.display!(number3?.values.get(i)),
                        number4: number4?.display!(number4?.values.get(i)),
                        url: url?.values.get(i),
                        nodeWidth: WIDTH_OF_VERTEX_BOX,
                        nodeHeight: HEIGHT_OF_VERTEX_BOX,
                    };

                    // Assign the titles of the number attributes
                    vertex.number1.title = number1DisplayName;
                    vertex.number2.title = number2DisplayName;
                    vertex.number3.title = number3DisplayName;
                    vertex.number4.title = number4DisplayName;

                    // Create the node object of reactflow
                    let node = {
                        id: vertex.id,
                        type: vertex.type,
                        data: vertex,
                        position: { "x": 0, "y": 0 },
                        draggable:isDragable,
                        connectable: false,
                        selectable: false
                    };
                    tempNodes.push(node);
                }

                // Extract nodes data from the second series
                const edgeid = edgesFrame.fields.find((field) => field.name === "id");
                const source = edgesFrame.fields.find((field) => field.name === "source");
                const target = edgesFrame.fields.find((field) => field.name === "target");

                // create edges of the reactflow
                for (let i = 0; i < edgesFrame.length; i++) {
                    let edge = {
                        id: edgeid?.values.get(i),
                        source: source?.values.get(i),
                        target: target?.values.get(i),
                        type: 'smoothstep',
                        style: { stroke: 'white', strokeWidth: '2px' },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: 'white'
                        }
                    }
                    tempEdges.push(edge);
                }

                // Use dagrejs to conpute the layout and the x,y coordicates of the vertices
                const layoutedElements = getLayoutedElements(tempNodes, tempEdges, 'TB');
                // Trigger repaint of the panel
                setNodes(layoutedElements.nodes);
                setEdges(layoutedElements.edges);
                setShouldLayout(false);
                setErrorInData(false);

            } catch (error) {

                // Something went wrong - log the error and set error flag
                console.error(error);
                setErrorInData(true);

            }
        }

    }, [shouldLayout]);

    if (errorInInputs) {
        return (
            <div className={styles.centeredTextBox}>
                <h1>Error in Data Source Configuration</h1>
                <p>The data source must contain two data series. The first data series must contain array of nodes. The second data series must contain series of edges.</p>
            </div>
        )
    } else if (errorInData) {
        // Render error tile - this is related to some issue with data
        return (
            <div className={styles.centeredTextBox}>
                <h1>Error in Data</h1>
                <p>The vetrices and edges data returned from data sources does not confirm to the required format.</p>
            </div>
        )
    } else {
        // Render the reactflow flow chart
        return (
            <ReactFlow
                defaultNodes={nodes}
                defaultEdges={edges}
                fitView={true}
                onInit={(reactFlowInstance: ReactFlowInstance) => { getLayoutedElements(nodes, edges, 'TB') }}
                onNodeClick={onNodeClick}
                minZoom={minimumZoom}
                nodeTypes={nodeTypes}>
                <Controls showInteractive={false} />
                {showMiniMap && <MiniMap />}
            </ReactFlow>
        )
    }

};

const getStyles = (theme: GrafanaTheme) => {
    return {
        centeredTextBox: css`
            margin: auto;
            width: 80%;
            border: 2px solid red;
            padding: 10px;
            text-align: center;
        `,
        theme: theme
    };
};
