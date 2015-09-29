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
      var options = {
        fbToken: resp.authResponse.accessToken,
        fbId:  resp.authResponse.userID
      };
      $.post('/reg', options, function(results) {
        console.log(results);
        if(results.ok) {
          window.location.href = '/complete-reg';
        } else {
          alert("Error logging in! " + results.error);
        }
      });

      //relative to domain
    } else if (resp.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      alert('Please log into this app.');
    }

  };
}

RegStart = new RegStartClass();
