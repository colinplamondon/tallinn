var ConvoHistoryBox = React.createClass({
  render: function() {

    var messages = this.props.match['messages'];
    var m = this.props.match;
    var started = 'false';

    if(messages.length >0 ) {
      if(messages[0].from.length > 0) {
        started = 'true';
      }
    }
    var messageNodes = messages.map(function(message, idx){
      var from = Global.tinderId == message['from'] ? "me" :"them";
      var first = false;
      if(idx === 0){
        first = true;
      } else if(from == 'them') {
        first = messages[idx-1]['from'] == m.person._id ? false : true;
      } else if (from == 'me') {
        first = messages[idx-1]['from'] == Global.tinderId ? false : true;
      }
      var their_pic = ''
      if (m.hasOwnProperty('person')) {
        their_pic = m.person.photos[0].processedFiles[2].url;
      }

      var timestamp = ''
      if(message.hasOwnProperty('sent_date')){
        var ts = message.sent_date;
        timestamp = moment(ts).fromNow();
      }

      return (
        <MessageBubble key={message._id}
          from={from}
          text={message['message']}
          first={first.toString()}
          their_pic={their_pic}
          started={started}
          timestamp={timestamp} />
      );
    });
    return (
      <div className="convoHistoryBox">
        {messageNodes}
      </div>
    )
  }
});