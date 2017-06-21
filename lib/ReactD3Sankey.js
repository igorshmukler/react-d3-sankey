'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFauxDom = require('react-faux-dom');

var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

require('d3-plugins-sankey');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _default = (function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default(props) {
    _classCallCheck(this, _default);

    _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this, props);

    this.state = {
      nodes: [],
      links: []
    };
  }

  _createClass(_default, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        nodes: nextProps.nodes,
        links: nextProps.links
      });

      this.nodeWidth = nextProps.nodeWidth || 25; // default 25 pixels
      this.width = nextProps.width || 690; // default 690 pixels
      this.height = nextProps.height || 400; // default 400 pixels
      this.nodeColor = nextProps.nodeColor || '#888888';
      this.linkColor = nextProps.linkColor || '#cccccc';
    }
  }, {
    key: 'render',
    value: function render() {
      // ========================================================================
      // Set units, margin, sizes
      // ========================================================================
      var margin = { top: 10, right: 0, bottom: 10, left: 0 };
      var width = this.width - margin.left - margin.right;
      var height = this.height - margin.top - margin.bottom;

      var formatNumber = _d32['default'].format(",.0f"); // zero decimal places
      var format = function format(d) {
        return formatNumber(d);
      };

      // ========================================================================
      // Set the sankey diagram properties
      // ========================================================================
      var sankey = _d32['default'].sankey().size([width, height]).nodeWidth(this.nodeWidth).nodePadding(10);

      var path = sankey.link();

      var graph = {
        nodes: _lodash2['default'].cloneDeep(this.state.nodes),
        links: _lodash2['default'].cloneDeep(this.state.links)
      };

      sankey.nodes(graph.nodes).links(graph.links).layout(32);

      // ========================================================================
      // Initialize and append the svg canvas to faux-DOM
      // ========================================================================
      var svgNode = _reactFauxDom2['default'].createElement('div');

      var svg = _d32['default'].select(svgNode).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // ========================================================================
      // Add links
      // ========================================================================
      var link = svg.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", "link").attr("stroke", this.linkColor).on('click', this.props.openModal) // register eventListener
      .attr("d", path).style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      });

      // add link titles
      link.append("title").text(function (d) {
        return d.source.name + " → " + d.target.name + "\n Weight: " + format(d.value);
      });

      // ========================================================================
      // Add nodes
      // ========================================================================
      var node = svg.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").on('click', this.props.openModal) // register eventListener
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      // add nodes rect
      node.append("rect").attr("height", function (d) {
        return d.dy;
      }).attr("width", sankey.nodeWidth()).attr("fill", this.nodeColor).append("title").text(function (d) {
        return d.name + "\n" + format(d.value);
      });

      // add nodes text
      node.append("text").attr("x", -6).attr("y", function (d) {
        return d.dy / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").text(function (d) {
        return d.name;
      }).filter(function (d) {
        return d.x < width / 2;
      }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");

      // Above D3 manipaluation equal to following jsx if didn't rely on faux-dom
      // ------------------------------------------------------------------------
      // var links = graph.links.map((link, i) => {
      //   return (
      //     <g>
      //       <path key={i} className="link" onClick={()=>{this.props.openModal(link)}} d={path(link)} style={{strokeWidth: Math.max(1, link.dy)}}>
      //         <title>{link.source.name + " → " + link.target.name + "\n Weight: " + format(link.value)}</title>
      //       </path>
      //     </g>
      //   );
      // });

      // var nodes = graph.nodes.map((node, i) => {
      //   return (
      //     <g key={i} className="node" onClick={()=>{this.props.openModal(node)}} transform={"translate(" + node.x + "," + node.y + ")"}>
      //       <rect height={node.dy} width={sankey.nodeWidth()}>
      //         <title>{node.name + "\n" + format(node.value)}</title>
      //       </rect>
      //       { (node.x >= width / 2) ?
      //         <text x={-6} y={node.dy / 2} dy={".35em"} textAnchor={"end"} >{node.name}</text> :
      //         <text x={6 + sankey.nodeWidth()} y={node.dy / 2} dy={".35em"} textAnchor={"start"} >{node.name}</text>
      //       }
      //     </g>
      //   );
      // });

      // ========================================================================
      // Render the faux-DOM to React elements
      // ========================================================================
      return svgNode.toReact();

      // JSX rendering return if didn't rely on faux-dom
      // ------------------------------------------------------------------------
      // return (
      //   <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      //     <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
      //       {links}
      //       {nodes}
      //     </g>
      //   </svg>
      // );
    }
  }]);

  return _default;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];