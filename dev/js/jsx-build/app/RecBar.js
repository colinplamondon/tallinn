"use strict";

RecBar = React.createClass({
		displayName: "RecBar",

		render: function render() {
				return React.createElement(
						"div",
						{ className: "container-fluid rec-bar-wrap" },
						React.createElement(
								"div",
								{ className: "rec-river UIRiver col-md-12" },
								React.createElement("div", { className: "recommendations el-wrap" })
						)
				);
		} });
//# sourceMappingURL=RecBar.js.map
