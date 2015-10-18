"use strict";

LikeUI = React.createClass({
  displayName: "LikeUI",

  render: function render() {
    return React.createElement(
      "div",
      { className: "likeUI mainPage", "data-active": this.props.active },
      React.createElement(MassLike, null),
      React.createElement(
        "div",
        { className: "match-hovercard container-fluid wrap-full-width", style: { display: 'none' } },
        React.createElement(
          "div",
          { className: "col-md-4" },
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "h2",
              null,
              React.createElement("span", { className: "js-match-name" }),
              ", ",
              React.createElement("span", { className: "js-match-age" })
            ),
            React.createElement(
              "h3",
              null,
              React.createElement("span", { className: "js-miles-away" })
            ),
            React.createElement(
              "h4",
              null,
              "last online ",
              React.createElement("span", { className: "js-last-online" })
            ),
            React.createElement("p", { className: "js-hovercard-bio" })
          ),
          React.createElement("div", { className: "row" }),
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "div",
              { className: "cp-btn js-unmatch", "data-target-match": 1232141 },
              "unmatch"
            )
          )
        ),
        React.createElement("div", { className: "col-md-8 js-hovercard-photos" })
      ),
      React.createElement("div", { className: "black-overlay", style: { display: 'none' } })
    );
  }
});
//# sourceMappingURL=LikeUI.js.map
