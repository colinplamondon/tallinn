"use strict";

var MessageBubble = React.createClass({
  displayName: "MessageBubble",

  render: function render() {
    // var me = Global.tinderId;
    // var them = x._id;
    // var from = me == from ? "me" :"them";
    return React.createElement(
      "div",
      { className: "messageBubble row", "data-first": this.props.first, "data-from": this.props.from, "data-started": this.props.started },
      React.createElement(
        "div",
        { className: "col-md-1 col-md-offset-1" },
        React.createElement("img", { className: "mePhoto img-circle", src: Global.profilePic })
      ),
      React.createElement(
        "div",
        { className: "messageText col-md-8" },
        React.createElement(
          "p",
          null,
          this.props.text,
          React.createElement(
            "span",
            { className: "messageTimestamp" },
            this.props.timestamp
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-1" },
        React.createElement("img", { className: "themPhoto img-circle", src: this.props.their_pic })
      )
    );
  }
});
//# sourceMappingURL=MessageBubble.js.map
