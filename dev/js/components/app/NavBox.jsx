NavBox = React.createClass({
  click: function() {
    var page_name = this.props.page.page;
    this.props.pageChange(page_name);
    return;
  },
	render: function() {
    var page_n = this.props.page.page;
		return (
  		<div className="nav-box" data-page={this.props.page.page} data-active={this.props.page.page == this.props.activeP ? 'true' : 'false'} onClick={this.click}>
        <span className="number">{this.props.page.num}</span>
        <span>{this.props.page.page}</span>
      </div>
    )
	}
});