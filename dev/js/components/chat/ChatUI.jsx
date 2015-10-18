var ChatUI = React.createClass({
  getDefaultProps: function() {
    return ({
      'historyMaxDaysBack': 20
    })
  },
  loadUpdates: function() {
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'timestamp': self.initialFetch
      },
      dataType: 'json',
      success: function(msg) {
        var timestamp = msg.timestamp;
        var historyData = Global.sortByDateProp(msg.results, 'last_activity_date');

        this.setState({data:historyData});
        self.lastFetch = timestamp;
        var currentreact = this;

        if (!self.activeConvoNotSet) {
          var target_match = this.state.convo['_id'];
          $.each(historyData, function(idx, val){
            if(val['_id'] == target_match) {
              currentreact.setState({'convo':val});
              return false;
            }
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data:[],
      convo: {
        "_id":"",
        'messages':[
          {'from':'', "_id":"", 'message':''}
        ],
        "person": {
          "photos": [{"processedFiles":[{'url':''},{'url':''},{'url':''}]}]
        }
      }
    };
  },
  historyLooper: function(callback) {
    var lookup = {
      "3": 7,
      "7": 14,
      "14":20,
    };

    var current_history = parseInt(self.lastDayFetch);
    var next = lookup[current_history];

    this.collectHistory(next, function(){
      callback();
    });

  },
  collectHistory: function(days_back, callback) {
    var currentreact = this;
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': parseInt(days_back)
      },
      dataType: 'json',
      success: function(msg) {
        var timestamp = msg.timestamp;
        var historyData = Global.sortByDateProp(msg.results, 'last_activity_date');

        currentreact.props.lastFetch = timestamp;
        currentreact.props.initialFetch = timestamp;
        currentreact.props.lastDayFetch = days_back;

        if(self.activeConvoNotSet) {
          $.each(historyData, function(idx, val){
            if(val.messages.length>0) {
              self.activeConvoNotSet = false;

              currentreact.setState({
                data:historyData,
                convo:val
              })
            }
          });
          if(self.activeConvoNotSet === true) {
            currentreact.setState({data:historyData});
          }
          callback();
        } else {
          currentreact.setState({data:historyData});
        }

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  quickFetch: function() {
    this.loadUpdates();
  },
  componentDidMount: function() {
    var currentreact = this;
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': 3
      },
      dataType: 'json',
      success: function(msg) {
        var timestamp = msg.timestamp;
        var historyData = msg.results;

        this.props.lastFetch = timestamp;
        this.props.initialFetch = timestamp;
        this.props.lastDayFetch = 3;
        this.props.activeConvoNotSet = true;
        $.each(historyData, function(idx, val){
          if(val.messages.length>0) {
            this.activeConvoNotSet = false;

            currentreact.setState({
              data:historyData,
              convo:val
            })
          }
        });
        if(this.activeConvoNotSet === true) {
          currentreact.setState({data:historyData});
        }

        setInterval(this.loadUpdates, 5000);

        var activereact = this;
        function loop() {

          if(activereact.props.lastDayFetch != activereact.props.historyMaxDaysBack) {
            activereact.historyLooper(function(){
              loop();
            });
          }
        }
        loop();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  setNewConvo: function(match) {
    this.setState({convo:match.match});
  },
  render: function() {
    return (
      <div className="chatUI mainPage" data-active={this.props.active}>
        <MatchList data={this.state.data} activeConvo={this.state.convo} setNewConvo={this.setNewConvo} />
        <ActiveConvo triggerHistory={this.quickFetch} match={this.state.convo} />
        <ConvoPhotos match={this.state.convo} />
      </div>
    )
  }
});
