'use strict';

NavBoxes = React.createClass({
  displayName: 'NavBoxes',

  getInitialState: function getInitialState() {
    return {
      page: 'likes',
      pages: [{
        'page': 'likes',
        'num': 0
      }, {
        'page': 'chat',
        'num': 0
      }]
    };
  },
  pageChange: function pageChange(page) {
    PubSub.publish('page_pubsub', page);
  },
  componentDidMount: function componentDidMount() {
    var currentreact = this;
    var page_sub = function page_sub(msg, data) {
      if (data !== currentreact.props.page) {
        currentreact.setState({
          'page': data
        });
      }
    };
    var token = PubSub.subscribe('page_pubsub', page_sub);
  },
  render: function render() {
    var pages = this.state.pages;
    var currentreact = this;
    var navNodes = pages.map(function (page, idx) {
      return React.createElement(NavBox, { activeP: currentreact.state.page, page: page, pageChange: currentreact.pageChange });
    });
    return React.createElement(
      'div',
      { className: 'navBoxes' },
      navNodes
    );
  }
});
//# sourceMappingURL=NavBoxes.js.map
