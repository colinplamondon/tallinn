'use strict';

var MatchCell = React.createClass({
  displayName: 'MatchCell',

  handleClick: function handleClick(e) {
    this.props.onMatchChange(this.props.match);
  },
  render: function render() {
    var messageExp = this.props.messaged === 'true' ? this.props['last_three_messages'] : 'no messages yet';
    function createMessage() {
      return {
        __html: messageExp
      };
    }
    return React.createElement(
      'div',
      { className: 'matchCell row', 'data-active': this.props.currently_active, onClick: this.handleClick, match_id: this.props['match_id'], messaged: this.props['messaged'] },
      React.createElement('img', { className: 'col-md-4', src: this.props['profile'] }),
      React.createElement(
        'div',
        { className: 'col-md-8' },
        React.createElement(
          'span',
          { className: 'name' },
          this.props['name']
        ),
        React.createElement(
          'span',
          { className: 'lastonline' },
          'last online ',
          this.props['last_online']
        ),
        React.createElement('p', { dangerouslySetInnerHTML: createMessage() })
      )
    );
  }
});
//# sourceMappingURL=MatchCell.js.map
