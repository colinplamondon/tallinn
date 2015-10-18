var MessageBubble = React.createClass({
  render: function() {
    // var me = Global.tinderId;
    // var them = x._id;
    // var from = me == from ? "me" :"them";
    return (
      <div className="messageBubble row" data-first={this.props.first} data-from={this.props.from} data-started={this.props.started}>
        <div className="col-md-1 col-md-offset-1">
          <img className="mePhoto img-circle" src={Global.profilePic} />
        </div>
        <div className="messageText col-md-8">
          <p>
            {this.props.text}
            <span className="messageTimestamp">{this.props.timestamp}</span>
          </p>
        </div>
        <div className="col-md-1">
          <img className="themPhoto img-circle" src={this.props.their_pic} />
        </div>
      </div>
    )
  }
});
