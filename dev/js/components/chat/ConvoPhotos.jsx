var ConvoPhotos = React.createClass({
  render: function() {
    var age = moment().diff(this.props.match.person.birth_date, 'years');
    var photoNodes = this.props.match['person']['photos'].map(function(photo) {
      var sized_p = photo.processedFiles[1].url
      return (
        <div className="matchPhoto">
          <img src={sized_p} />
        </div>
      )
    });
    return(
      <div className="convoPhotos" >
        <div className="matchInfo">
          <p className="matchName">{this.props.match.person['name']}, {age}</p>
          <p>{this.props.match.person['bio']}</p>
        </div>
        <div className="matchPhotos">
          {photoNodes}
        </div>
      </div>
    )
  }
})