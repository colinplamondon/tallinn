function RegStartClass() {
  this.init = function(){
    this.installObservers();
	};


  this.installObservers = function() {
    var self = this;
    $('.js-fb-login').click(function(){
       FB.login(function(response) {
         // handle the response
         self.fbCheckLoginResponse(response);
       }, {scope: 'public_profile,email'});
    });
  };




  this.fbCheckLoginResponse = function(resp) {
    console.log('statusChangeCallback');
    console.log(resp);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (resp.status === 'connected') {
      // Logged into your app and Facebook.
      var token = resp.authResponse.accessToken;
      var userId = resp.authResponse.userID;

      window.location.href = '/complete-reg?fbToken='+token+'&fbUser='+userId;
      //relative to domain
    } else if (resp.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      alert('Please log into this app.');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      alert('Please log into Facebook.');
    }

  };
}

RegStart = new RegStartClass();
