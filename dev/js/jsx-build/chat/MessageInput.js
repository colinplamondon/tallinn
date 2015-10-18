"use strict";

var MessageInput = React.createClass({
  displayName: "MessageInput",

  getInitialState: function getInitialState() {
    return {
      "is_disabled": "",
      "submitting": "",
      "message_input": "",
      "placeholder": "Enter your message.",
      "already_reset_for": "",
      "attempted_send": ""
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps() {
    if (this.props.last_message == this.state.attempted_send) {
      if (this.props.last_message != this.state.already_reset_for) {
        this.setState(this.getInitialState());
        this.setState({
          "already_reset_for": this.state.last_message
        });
      }
    }
  },
  handleChange: function handleChange(event) {
    this.setState({ message_input: event.target.value });
  },
  messageSubmit: function messageSubmit(e) {
    e.preventDefault();
    var msg = this.refs.msg.value.trim();

    if (!msg) {
      return;
    }
    this.setState({
      "submitting": "submitting",
      "message_input": "",
      "placeholder": "submitting...",
      "is_disabled": "disabled",
      "attempted_send": msg
    });

    this.props.onMessageSubmit(msg);

    return;
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "messageInput row" },
      React.createElement("img", { className: "col-md-2", src: Global.profilePic }),
      React.createElement(
        "form",
        { className: "messageForm", onSubmit: this.messageSubmit },
        React.createElement("input", { disabled: this.state.is_disabled, value: this.state.message_input, type: "text", onChange: this.handleChange, ref: "msg", className: "col-md-7", placeholder: this.state.placeholder }),
        React.createElement(
          "button",
          { disabled: this.state.is_disabled, type: "submit", value: "", className: "submit col-md-3" },
          React.createElement(
            "span",
            { className: "default" },
            "submit"
          ),
          React.createElement("i", { className: "fa fa-spinner fa-spin" })
        )
      )
    );
  }
});
//# sourceMappingURL=MessageInput.js.map
