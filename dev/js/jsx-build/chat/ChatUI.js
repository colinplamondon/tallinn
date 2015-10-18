'use strict';

var ChatUI = React.createClass({
  displayName: 'ChatUI',

  getDefaultProps: function getDefaultProps() {
    return {
      'historyMaxDaysBack': 20
    };
  },
  loadUpdates: function loadUpdates() {
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'timestamp': self.initialFetch
      },
      dataType: 'json',
      success: (function (msg) {
        var timestamp = msg.timestamp;
        var historyData = self.sortByDateProp(msg.results, 'last_activity_date');

        this.setState({ data: historyData });
        self.lastFetch = timestamp;
        var currentreact = this;

        if (!self.activeConvoNotSet) {
          var target_match = this.state.convo['_id'];
          $.each(historyData, function (idx, val) {
            if (val['_id'] == target_match) {
              currentreact.setState({ 'convo': val });
              return false;
            }
          });
        }
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  getInitialState: function getInitialState() {
    return {
      data: [],
      convo: {
        "_id": "",
        'messages': [{ 'from': '', 'message': '' }],
        "person": {
          "photos": [{ "processedFiles": [{ 'url': '' }, { 'url': '' }, { 'url': '' }] }]
        }
      }
    };
  },
  historyLooper: function historyLooper(callback) {
    var lookup = {
      "3": 7,
      "7": 14,
      "14": 20
    };

    var current_history = parseInt(self.lastDayFetch);
    var next = lookup[current_history];

    this.collectHistory(next, function () {
      callback();
    });
  },
  collectHistory: function collectHistory(days_back, callback) {
    var currentreact = this;
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': parseInt(days_back)
      },
      dataType: 'json',
      success: (function (msg) {
        var timestamp = msg.timestamp;
        var historyData = Global.sortByDateProp(msg.results, 'last_activity_date');

        currentreact.props.lastFetch = timestamp;
        currentreact.props.initialFetch = timestamp;
        currentreact.props.lastDayFetch = days_back;

        if (self.activeConvoNotSet) {
          $.each(historyData, function (idx, val) {
            if (val.messages.length > 0) {
              self.activeConvoNotSet = false;

              currentreact.setState({
                data: historyData,
                convo: val
              });
            }
          });
          if (self.activeConvoNotSet === true) {
            currentreact.setState({ data: historyData });
          }
          callback();
        } else {
          currentreact.setState({ data: historyData });
        }
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  quickFetch: function quickFetch() {
    this.loadUpdates();
  },
  componentDidMount: function componentDidMount() {
    console.log('mounted');
    var currentreact = this;
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': 3
      },
      dataType: 'json',
      success: (function (msg) {
        var timestamp = msg.timestamp;
        var historyData = msg.results;

        this.props.lastFetch = timestamp;
        this.props.initialFetch = timestamp;
        this.props.lastDayFetch = 3;
        this.props.activeConvoNotSet = true;
        $.each(historyData, function (idx, val) {
          if (val.messages.length > 0) {
            this.activeConvoNotSet = false;

            currentreact.setState({
              data: historyData,
              convo: val
            });
          }
        });
        if (this.activeConvoNotSet === true) {
          currentreact.setState({ data: historyData });
        }

        setInterval(this.loadUpdates, 5000);

        var activereact = this;
        function loop() {

          if (this.props.lastDayFetch != this.props.historyMaxDaysBack) {
            activereact.historyLooper(function () {
              loop();
            });
          }
        }
        loop();
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  setNewConvo: function setNewConvo(match) {
    this.setState({ convo: match.match });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'chatUI mainPage', 'data-active': this.props.active },
      React.createElement(MatchList, { data: this.state.data, activeConvo: this.state.convo, setNewConvo: this.setNewConvo }),
      React.createElement(ActiveConvo, { triggerHistory: this.quickFetch, match: this.state.convo }),
      React.createElement(ConvoPhotos, { match: this.state.convo })
    );
  }
});
//# sourceMappingURL=ChatUI.js.map
