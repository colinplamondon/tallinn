NavBoxes = React.createClass({
  getInitialState: function() {
    return ({
      page: 'likes',
      pages: [
        {
          'page': 'likes',
          'num': 0
        }, {
          'page': 'chat',
          'num': 0
        }
      ]
    })
  },
  pageChange: function(page) {
    PubSub.publish('page_pubsub', page);
  },
  componentDidMount: function() {
    var currentreact = this;
    var page_sub = function( msg, data ){
      if(data !== currentreact.props.page) {
        currentreact.setState({
          'page': data
        });
      }
    };
    var token = PubSub.subscribe('page_pubsub', page_sub);

  },
	render: function() {
    var pages = this.state.pages;
    var currentreact = this;
    var navNodes = pages.map(function(page, idx){
      return (
        <NavBox activeP={currentreact.state.page} page={page} pageChange={currentreact.pageChange}/>
      )
    });
		return (
      <div className="navBoxes">
  		  {navNodes}
      </div>
    )
	}
})