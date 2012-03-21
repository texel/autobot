// helpbot.js
// A help framework for all your helpbot needs.

(function () {
  var Helpbot = {
    observers: [],
    register: function (observer) {
      this.observers.push(observer);
    },
    checkUpdated: _.debounce(function () {
      _.each(this.observers, function (observer) {
        console.log(observer);
        if (observer.when()) {
          observer.action();
        }
      });
    }, 200)
  };

  $( function () {
    $('body').bind('click', function () {
      Helpbot.checkUpdated();
    });
  });

  this.Helpbot = Helpbot;
})(this);
