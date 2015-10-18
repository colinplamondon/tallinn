'use strict';

var ConvoPhotos = React.createClass({
  displayName: 'ConvoPhotos',

  render: function render() {
    var age = moment().diff(this.props.match.person.birth_date, 'years');
    var photoNodes = this.props.match['person']['photos'].map(function (photo) {
      var sized_p = photo.processedFiles[1].url;
      return React.createElement(
        'div',
        { className: 'matchPhoto' },
        React.createElement('img', { src: sized_p })
      );
    });
    return React.createElement(
      'div',
      { className: 'convoPhotos' },
      React.createElement(
        'div',
        { className: 'matchInfo' },
        React.createElement(
          'p',
          { className: 'matchName' },
          this.props.match.person['name'],
          ', ',
          age
        ),
        React.createElement(
          'p',
          null,
          this.props.match.person['bio']
        )
      ),
      React.createElement(
        'div',
        { className: 'matchPhotos' },
        photoNodes
      )
    );
  }
});
//# sourceMappingURL=ConvoPhotos.js.map
