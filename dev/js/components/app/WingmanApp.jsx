WingmanApp = React.createClass({
  getInitialState: function() {
    return({'page':'like'})
  },
  componentWillMount: function() {
    this.setState({
      "page": this.props.page
    });

    var currentreact = this;
    var page_change = function(msg, data) {
      console.log('page change in wingmanapp');
      console.log('data is: '+data);
      console.log('msg is: '+ msg);

      currentreact.setState({
        "page": data
      });
    };
    var token = PubSub.subscribe('page_pubsub', page_change);

  },
  render: function() {
    console.log(this.state.page);
    return (
      <div className="wingmanApp" data-page={this.state.page}>
        <MatchBar />
      	<LikeUI active={this.state.page=='likes' ? 'true': 'false'}/>
      	<ChatUI active={this.state.page=='chat' ? 'true': 'false'}/>
        <RecBar />
      </div>
    )
  }
});
