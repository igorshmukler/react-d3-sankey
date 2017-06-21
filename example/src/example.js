var React = require('react');
var ReactDOM = require('react-dom');
var ReactD3Sankey = require('react-d-3-sankey');

var App = React.createClass({
	render () {
		return (
			<div>
				<ReactD3Sankey />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
