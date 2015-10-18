LikeUI = React.createClass({
  render: function() {
    return (
      <div className="likeUI mainPage" data-active={this.props.active}>
        <MassLike />
        <div className="match-hovercard container-fluid wrap-full-width" style={{display: 'none'}}>
          <div className="col-md-4">
            <div className="row">
              <h2><span className="js-match-name" />, <span className="js-match-age" /></h2>
              <h3><span className="js-miles-away" /></h3>
              <h4>last online <span className="js-last-online" /></h4>
              <p className="js-hovercard-bio" />
            </div>
            <div className="row">
            </div>
            <div className="row">
              <div className="cp-btn js-unmatch" data-target-match={1232141}>
                unmatch
              </div>
            </div>
          </div>
          <div className="col-md-8 js-hovercard-photos">
          </div>
        </div>
        <div className="black-overlay" style={{display: 'none'}}>
        </div>
      </div>
    );
  }
});