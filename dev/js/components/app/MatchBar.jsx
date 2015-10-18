MatchBar = React.createClass({
  render: function() {
    return (
      <div className="container-fluid match-bar-wrap">
        <div className="col-md-1">
          <div className="icon">
            <i className="fa fa-heart" />
          </div>
        </div>
        <div className="match-river UIRiver col-md-11">
          <div className="matches el-wrap">
          </div>
        </div>
      </div>
    );
}});
