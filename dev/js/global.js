function GlobalClass() {
  this.init = function(){
    Global.installObservers();
    Pages.init();
  };

  this.installObservers = function(){

  };

}

Global = new GlobalClass();
