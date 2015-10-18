var MessageInput = React.createClass({
  getInitialState: function(){
    return({
      "is_disabled": "",
      "submitting": "",
      "message_input": "",
      "placeholder": "Enter your message.",
      "already_reset_for": "",
      "attempted_send": ""
    });
  },
  componentWillReceiveProps: function() {
    if(this.props.last_message==this.state.attempted_send) {
      if (this.props.last_message != this.state.already_reset_for) {
        this.setState(this.getInitialState());
        this.setState({
          "already_reset_for": this.state.last_message
        })
      }
    }
  },
  handleChange: function(event) {
    this.setState({message_input: event.target.value});
  },
  messageSubmit: function(e) {
    e.preventDefault();
    var msg = this.refs.msg.value.trim();

    if(!msg) {
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
  render: function() {
    return (
      <div className="messageInput row">
        <img className="col-md-2" src={Global.profilePic} />

        <form className="messageForm" onSubmit={this.messageSubmit}>
          <input disabled={this.state.is_disabled} value={this.state.message_input} type="text" onChange={this.handleChange} ref="msg" className="col-md-7" placeholder={this.state.placeholder} />
          <button disabled={this.state.is_disabled} type="submit" value="" className="submit col-md-3">
            <span className="default">submit</span>
            <i className="fa fa-spinner fa-spin"></i>
          </button>
        </form>
      </div>
    )
  }
});