var ActiveConvo = React.createClass({
  handleMessageSubmit: function(message) {
    this.setState({'submitting': true});
    var currentreact = this;
    var DONOTSEND = false;

    if(!DONOTSEND) {
      $.ajax({
        type: "POST",
        url: '/send_message',
        data: {
          'message': message,
          "match_id": this.props.match._id
        },
        dataType: 'json',
        success: function(msg) {
          console.log('sent message succesfully');
          currentreact.setState({
            'submitting':false,
            "last_message": message
          });
          currentreact.props.triggerHistory();
        }.bind(this),
        error: function(xhr, status, err) {
          alert(err.toString());
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  getInitialState: function() {
    return {
      "last_message": ""
    };
  },
  render: function() {
    if(!this.props.match.person.hasOwnProperty('name')){
      return (
        <div className="activeConvo col-md-6">
          <div className="convoHistoryBox noConvo">
            <i className="fa fa-spinner fa-spin"></i>
          </div>
        </div>
      )
    } else if (this.props.match.messages.length === 0 ) {
      return (
        <div className="activeConvo col-md-6">
          <div className="convoHistoryBox">
            <h3 className="helptext">Kick off the conversation below!</h3>
          </div>
          <MessageInput last_message={this.state.last_message}
            onMessageSubmit={this.handleMessageSubmit}
            submitting=''
            placeholder="Enter your message here."/>
        </div>
      )
    } else {
      return (
      <div className="activeConvo col-md-6">
        <ConvoHistoryBox match={this.props.match}/>
        <MessageInput last_message={this.state.last_message}
          onMessageSubmit={this.handleMessageSubmit}
          submitting=''
          placeholder="Enter your message here." />
      </div>
    )
    }
  }
});