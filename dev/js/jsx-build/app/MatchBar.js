"use strict";

MatchBar = React.createClass({
  displayName: "MatchBar",

  render: function render() {
    return React.createElement(
      "div",
      { className: "container-fluid match-bar-wrap" },
      React.createElement(
        "div",
        { className: "col-md-1" },
        React.createElement(
          "div",
          { className: "icon" },
          React.createElement("i", { className: "fa fa-heart" })
        )
      ),
      React.createElement(
        "div",
        { className: "match-river UIRiver col-md-11" },
        React.createElement("div", { className: "matches el-wrap" })
      )
    );
  } });
//# sourceMappingURL=MatchBar.js.map
