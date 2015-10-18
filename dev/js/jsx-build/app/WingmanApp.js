'use strict';

WingmanApp = React.createClass({
  displayName: 'WingmanApp',

  getInitialState: function getInitialState() {
    return { 'page': 'likes' };
  },
  componentDidMount: function componentDidMount() {
    var currentreact = this;
    var page_change = function page_change(msg, data) {
      console.log('page change in wingmanapp');
      console.log('data is: ' + data);
      console.log('msg is: ' + msg);

      currentreact.setState({
        "page": data
      });
    };
    var token = PubSub.subscribe('page_pubsub', page_change);
  },
  render: function render() {

    return React.createElement(
      'div',
      { className: 'wingmanApp', 'data-page': this.state.page },
      React.createElement(MatchBar, null),
      React.createElement(LikeUI, { active: this.state.page == 'likes' ? 'true' : 'false' }),
      React.createElement(ChatUI, { active: this.state.page == 'chat' ? 'true' : 'false' }),
      React.createElement(RecBar, null)
    );
  }
});
//# sourceMappingURL=WingmanApp.js.map
