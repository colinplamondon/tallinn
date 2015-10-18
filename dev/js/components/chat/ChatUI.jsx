// Startup: get 3 days of history...
//           set lastFetch, initialFetch, lastDayFetch, activeConvoNotSet
//           go through days, set first active convo to active

// States...
//  Startup
//
//
//

var ChatUI = React.createClass({
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
      },
      historyMaxDaysBack: 20,
      activeConvoNotSet: true,
      lastDayFetch: 0
    };
  },
  getUpdates: function(type, days_ago, callback) {
    if(type==='history' && days_ago === undefined) {
      console.log("ERROR: getUpdates in 'history' mode called without days_ago");
    }

    var params;
    console.log("State is: "+type);

    if(type==='startup') {
      params = {"days_ago": 3};
    } else if (type==='history') {
      params = {"days_ago": days_ago};
    } else if (type ==='poll') {
      params = {"timestamp": this.state.initialFetch};
    } else {
      params = {"timestamp": ""};
    }

    $.ajax({
      type: "POST",
      url: '/get_history',
      data: params,
      dataType: 'json',
      success: function(msg) {
        var timestamp = msg.timestamp;
        var historyData = Global.sortByDateProp(msg.results, 'last_activity_date');

        this.setState({data:historyData});
        this.setState({"lastFetch": timestamp});
        if (this.state.activeConvoNotSet) {
          this.findStartingConvo(historyData);
        }

        if(type==='startup') {
          console.log('in startup');
          console.log(this);
          this.setState({
            "initialFetch": timestamp,
            "lastDayFetch": 3
          });

          // setInterval(function(){
          //   currentreact.getUpdates('poll')
          // }, 5000);
          var backup_max = 6;
          var count = 0;
          console.log(this.state);
          var currentreact = this;
          function loop() {
            count ++;
            if(count==backup_max){
              return;
            }
            if(currentreact.state.lastDayFetch != currentreact.state.historyMaxDaysBack) {
              currentreact.historyLooper(function(){
                if(count>=backup_max) {
                  loop();
                }
              });
            }
          }
          loop();
        } else if (type === 'history') {
          this.state.lastDayFetch = days_ago;
          callback();
        }

        if(type === 'poll') {
        }

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  historyLooper: function(callback) {
    console.log('looping....');
    var lookup = {
      "3": 7,
      "7": 14,
      "14":20,
    };

    console.log(this.state);
    var current_history = parseInt(this.state.lastDayFetch);
    var next = lookup[current_history];
    console.log("next is: "+ next)

    this.getUpdates('history', next, function(){
      callback();
    });

  },

  findStartingConvo: function(data) {
    var currentreact = this;
    var found = false;
    $.each(data, function(idx, val){
      if(val.messages.length>0) {
        found = true;
        currentreact.setState({
          data:data,
          convo:val,
          activeConvoNotSet:false
        })
      }
    });
    // if still haven't found one, just set #1
    if(!found){
      this.setState({
        data:data,
        convo: data[0],
        activeConvoNotSet:false
      });
    }
  },
  quickFetch: function() {
    this.loadUpdates();
  },
  componentDidMount: function() {
    var currentreact = this;
    this.getUpdates('startup');
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
