'use strict';

NavBox = React.createClass({
  displayName: 'NavBox',

  click: function click() {
    var page_name = this.props.page.page;
    this.props.pageChange(page_name);
    return;
  },
  render: function render() {
    var page_n = this.props.page.page;
    console.log(this.props);
    return React.createElement(
      'div',
      { className: 'nav-box', 'data-active': this.props.page.page == this.props.activeP ? 'true' : 'false', onClick: this.click },
      React.createElement(
        'span',
        { className: 'number' },
        this.props.page.num
      ),
      React.createElement(
        'span',
        null,
        this.props.page.page
      )
    );
  }
});
//# sourceMappingURL=NavBox.js.map
