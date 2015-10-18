'use strict';

var ActiveConvo = React.createClass({
  displayName: 'ActiveConvo',

  handleMessageSubmit: function handleMessageSubmit(message) {
    this.setState({ 'submitting': true });
    var currentreact = this;
    var DONOTSEND = false;

    if (!DONOTSEND) {
      $.ajax({
        type: "POST",
        url: '/send_message',
        data: {
          'message': message,
          "match_id": this.props.match._id
        },
        dataType: 'json',
        success: (function (msg) {
          console.log('sent message succesfully');
          currentreact.setState({
            'submitting': false,
            "last_message": message
          });
          currentreact.props.triggerHistory();
        }).bind(this),
        error: (function (xhr, status, err) {
          alert(err.toString());
          console.error(this.props.url, status, err.toString());
        }).bind(this)
      });
    }
  },
  getInitialState: function getInitialState() {
    return {
      "last_message": ""
    };
  },
  render: function render() {
    if (!this.props.match.hasOwnProperty('person')) {
      return React.createElement(
        'div',
        { className: 'activeConvo col-md-6' },
        React.createElement(
          'div',
          { className: 'convoHistoryBox noConvo' },
          React.createElement('i', { className: 'fa fa-spinner fa-spin' })
        )
      );
    } else if (this.props.match.messages.length === 0) {
      return React.createElement(
        'div',
        { className: 'activeConvo col-md-6' },
        React.createElement(
          'div',
          { className: 'convoHistoryBox' },
          React.createElement(
            'h3',
            { className: 'helptext' },
            'Kick off the conversation below!'
          )
        ),
        React.createElement(MessageInput, { last_message: this.state.last_message,
          onMessageSubmit: this.handleMessageSubmit,
          submitting: '',
          placeholder: 'Enter your message here.' })
      );
    } else {
      return React.createElement(
        'div',
        { className: 'activeConvo col-md-6' },
        React.createElement(ConvoHistoryBox, { match: this.props.match }),
        React.createElement(MessageInput, { last_message: this.state.last_message,
          onMessageSubmit: this.handleMessageSubmit,
          submitting: '',
          placeholder: 'Enter your message here.' })
      );
    }
  }
});
//# sourceMappingURL=ActiveConvo.js.map
