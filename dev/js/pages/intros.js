function IntrosClass() {
  this.url = "/intros";

  this.init = function(){
    this.installObservers();
    Global.returnCurrentCity(function(full_name, city_name){
      $('.js-current-city').text(city_name);
    });
	};

	this.installObservers = function(){

	};

}

Intros = new IntrosClass();
