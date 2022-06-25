# Grafana Phlowchart Panel

**Description**:  Phlowchart Grafana panel can be used to render interactive flow charts from directed graph data. Directed graphs have vertices and edges. Phlowchart supports different types of vertices. Details of the types can be found below. This panel has dependency on the [Infinity](https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/) data source plugin.

- **Technology stack**: [ReactJS](https://reactjs.org/), [NodeJS](https://nodejs.org/en/), [Grafana toolkit](https://www.npmjs.com/package/@grafana/toolkit), [Yarn](https://yarnpkg.com/), [ReactFlow](https://reactflow.dev/), [DagreJS](https://github.com/dagrejs/dagre).
- **Key concepts** Grafana does offer [Node graph panel](https://grafana.com/docs/grafana/v7.5/panels/visualizations/node-graph/) as a way to visualize a directed graph data however it is currently in Beta and also the visualization supported is very basic. There is a need to develop visualization panel that can offer rich visualization capability for directed graph. This panel attempts to do that uusing ReactFlow and DagreJS.
- **Status**:  Initial release supporting 10 different types of vertices.

**Screenshot**:

![Screenshot 1](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/screenshot1.png)

See the [nodes.json](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/sample_data/nodes.json) and [edges.json](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/sample_data/edges.json) in the sample_data folder for data behind the above graph.

## Dependencies

- [ReactJS](https://reactjs.org/)
- [NodeJS](https://nodejs.org/en/)
- [Grafana toolkit](https://www.npmjs.com/package/@grafana/toolkit)
- [Yarn](https://yarnpkg.com/)
- [ReactFlow](https://reactflow.dev/)
- [DagreJS](https://github.com/dagrejs/dagre)

## Installation

Installng plugin on Grafana Cloud / Local Grafana - https://grafana.com/docs/grafana/latest/plugins/installation/

## Configuration

Build a web service with two API end points - one that provides the vertices data and another that provided the edges that link the vertices in a directed graph:

The vertices API end point should return a response similar to below:

```json
[
   {
      "id": "1",
      "type": "twoTextFourNumber",
      "title": "Vertex title 1",
      "sub_text": "Vertex sub text 1",
      "number1": 80,
      "number2": 45,
      "number3": 39,
      "number4": 4,
      "url": "http://www.domain.com/path/subpath/1"
   },
   {
      "id": "2",
      "type": "twoTextTwoNumber",
      "title": "Vertex title 2",
      "sub_text": "Vertex sub text 2",
      "number1": 116,
      "number2": 5,
      "number3": null,
      "number4": null,
      "url": "http://www.domain.com/path/subpath/2"
   },
   {
      "id": "3",
      "type": "oneTextThreeNumber",
      "title": "Vertex title 3",
      "sub_text": null,
      "number1": 93,
      "number2": 44,
      "number3": 32,
      "number4": null,
      "url": "http://www.domain.com/path/subpath/3"
   }
]
```

The following table describes attributes of the vertex JSON object model:

| Attribute Name  | Type | Description |
| ------------- | ------------- | ------------- |
| id | string | Unique identifier of the vertex. This identifier is used as source and destination attributes when defining edges that connect vertices of a directed graph. |
| type | string | This is the most important attribute of the vertex. It defines how the specific vertex is rendered. See [Vertex Types Supported](#vertex-types-supported) section below for supported values. |
| title | string | This attribute specifies the primary text of the vertex. |
| sub_text | string | This attribute specifies the secondary text of the vertex. This attribute is applicable for vertex types that have two text attributes. |
| number1 | number | This attribute specifies the first number of the vertex. This attribute is applicable for vertex types that have one or more numbers to display. |
| number2 | number | This attribute specifies the second number of the vertex. This attribute is applicable for vertex types that have one or more numbers to display. |
| number3 | number | This attribute specifies the third number of the vertex. This attribute is applicable for vertex types that have one or more numbers to display. |
| number4 | number | This attribute specifies the fourth number of the vertex. This attribute is applicable for vertex types that have one or more numbers to display. |
| url | string | This attribute will contain the URL where the user will be directed on click of the vertex. This provides a way for user looking at the directed graph visualization to “drill down”. |

**Important Note**: All the 9 attributes have to be present for all vertices irrespective of the type of the vertices. Attributes that are not applicable for a vertex type should be assigned a "null" value as shown in the sample above. Even if a non-null value is assigned to such attributes, they will not be rendered as part of the vertex.

The edges API end point should return a response similar to below:

```json
[
   {
      "id": "1-2",
      "source": "1",
      "target": "2"
   },
   {
      "id": "2-3",
      "source": "2",
      "target": "3"
   }
]
```

The following table describes attributes of the edge JSON object model:

| Attribute Name  | Type | Description |
| ------------- | ------------- | ------------- |
| id | string | Unique identifier of the edge. This must be a unique value in the edge collection. |
| source | string | The "id" attribute of the vertex that is the source of the edge. The arrow connector will flow from source to target vertex. |
| target | string | The "id" attribute of the vertex that is the target of the edge. The arrow connector will flow from source to target vertex. |

The above will be rendered as following with default configuration of the panel:

![Sample Graph](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/sample1.png)

The the infinity plugin to invoke the web service and pass the data to the Phlowchart plugin. Within the infinity data source, configure the vertices API end point as the first series and configure the edges API end point as second series. The Phlowchart plugin will render the directed graph based on the attributes of the vertex.

### Infinity Data Source Configuration

![Infinity Data Source Configuration](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/infinity-configuration.png)

The above diagram shows a sample configuration of the Infinity data source. Following are points to be considered:

- The type has to be selected as JSON
- Two series have to be created - one for vertices and another for edges. The configuration of the HTTP request (HTTP method, headers, query parameters) will depend on the implementation of the web service being consumed.
- Select Table or Data Frame as the format

### Vertex Types Supported

Following vertex types are supported and can be specified in the "type" attribute of the vertex JSON data:

| Type Name  | Description | Sample Image |
| ------------- | ------------- | ------------- |
| twoTextFourNumber  | Display two text values and four number values  | ![twoTextFourNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/TwoTextFourNumber.png)  |
| twoTextThreeNumber  | Display two text values and three number values  | ![twoTextThreeNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/TwoTextThreeNumber.png)  |
| twoTextTwoNumber  | Display two text values and two number values  | ![twoTextTwoNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/TwoTextTwoNumber.png)  |
| twoTextOneNumber  | Display two text values and one number value  | ![twoTextOneNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/TwoTextOneNumber.png)  |
| oneTextFourNumber  | Display one text values and four number values  | ![oneTextFourNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/OneTextFourNumber.png)  |
| oneTextThreeNumber  | Display one text values and three number values  | ![oneTextThreeNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/OneTextThreeNumber.png)  |
| oneTextTwoNumber  | Display one text values and two number values  | ![oneTextTwoNumber](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/OneTextTwoNumber.png)  |
| oneTextOneNumber  | Display one text values and one number value  | ![Sample](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/OneTextOneNumber.png)  |
| oneText  | Display one text value  | ![oneText](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/OneText.png)  |
| twoText  | Display two text values  | ![twoText](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/images/TwoText.png)  |

## Usage

Install the Infinity data source and Phlowchart plugin on Grafana. As shown above implement a web services that provides directed graph data. Use Infinity data source plugin to invoke the web service and fetch the directed graph data. Use the Phlowchart panel plugin to render the directed graph.

## How to test the software

Please have a look at the following link to know how to setup the environment for development as well as usage.

[Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)

1. Install dependencies

   ```bash
   yarn install --pure-lockfile
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

## Known issues

No open issue.

## Contact / Getting help

Write an email to [MAINTAINERS](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/MAINTAINERS.md)

## License

Link to [LICENSE](https://raw.githubusercontent.com/philips-labs/grafana-bpm-plugin/main/LICENSE)

## Credits and references

1. [ReactFlow](https://reactflow.dev/)
2. [DagreJS](https://github.com/dagrejs/dagre)
3. [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
4. [Grafana documentation](https://grafana.com/docs/)
5. [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
6. [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System