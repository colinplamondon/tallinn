MassLike = React.createClass({
  render: function() {
    return (
        <div className="masslike wrap-full-width">
          <div className="container">
            <div className="masslike-blocked js-masslike-blocked row " style={{display: 'none'}}>
              <div className="col-md-12">
                <i className="fa fa-circle-o-notch fa-spin" />
              </div>
              <div className="col-md-6 col-md-offset-3">
                <p>Easy there tiger. Still got <span className="js-mass-like-counter" style={{display: 'inline'}}>20</span> girls left to like.</p>
                <br />
                <p>In the meantime, work on <a href="#" className="js-goto-openers">your openers</a>, or <a href="#" className="js-goto-chat">chat with someone</a> you have already matched with.</p>
              </div>
            </div> {/* ./masslike-blocked */}
            <div className="row masslike-intro js-masslike-intro">
              <div className="intro js-switch-bar on col-md-5">
                <div className="row">
                  <p className="status">Intro messages are <span className="js-intro-message-status" /></p>
                  <span className="switch switch-square">
                    <input type="checkbox" className="js-intro-switch" id="s1" />
                    <label htmlFor="s1" data-on="I" data-off="O" />
                  </span>
                </div>
                <div className="row description">
                  <p>Whatever you put in below will sent when you actually match. Even if you match a week from now. Best avoid stuff about weekend plans - most matches happen 2-5 days after you like someone.</p>
                </div>
                <div className="row intro-el">
                  <label>Your intro:</label>
                  <textarea className="js-intro-input" data-intro-num={1} id="intro-input-1" />
                  <div className="js-add-intro-token js-intro-token cp-btn" data-token="{first_name}" data-target-area="intro-input-1">insert first name</div>
                </div>
              </div> {/* /.intro */}
              <div className="masslike col-md-6 col-md-offset-1">
                <div className="desc row">
                  <span>Change number of girls to like:</span>
                </div>
                <div className="select-like-num row">
                  <div className="like-num-el js-like-num-el" data-num={5}>5</div>
                  <div className="like-num-el js-like-num-el" data-num={20}>20</div>
                  <div className="like-num-el js-like-num-el active" data-num={50}>50</div>
                  <div className="like-num-el js-like-num-el" data-num={100}>100</div>
                  <div className="like-num-el js-like-num-el" data-num={250}>250</div>
                  <div className="like-num-el js-like-num-el" data-num={500}>500</div>
                </div>
                <div className="action row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="js-like primary" data-like-num={50}>Swipe right on <span className="js-swipe-num">50</span></div>
                    </div>
                    <div className="row js-if-intros-on js-if-toggle">
                      <div className="col-md-10 col-md-offset-1">
                        <p className="desc">Your intro at left will send to all the matches you get from this group of <span className="js-swipe-num">likes</span>.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> {/* /.action */}
            </div>
          </div>
        </div>
    );
}});
