NavBoxes = React.createClass({
  getInitialState: function() {
    return ({
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
    this.setState({"page":this.props.page});

    var activereact = this;
    var page_sub = function( msg, data ){
      activereact.setState({
        'page': data
      });
    };
    var token = PubSub.subscribe('page_pubsub', page_sub);

  },
	render: function() {
    var pages = this.state.pages;
    var currentreact = this;
    var navNodes = pages.map(function(page, idx){
      return (
        <NavBox key={page.page} activeP={currentreact.state.page} page={page} pageChange={currentreact.pageChange}/>
      )
    });
		return (
      <div className="navBoxes">
  		  {navNodes}
      </div>
    )
	}
})