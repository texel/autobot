// autobot.js
// A javascript story automation framework

(function () {
  var Autobot = {};

  Autobot.Story = function ( steps ) {
    // Initialize story
    this.steps = [];

    _.each(steps, function ( step, index ) {
      this.steps.push( new Autobot.Step(step) );   
    }, this);
  };

  _.extend(Autobot.Story.prototype, {
    run: function ( startAt ) {

    }
  });

  Autobot.Step = function ( options ) {
    if (options.when) {
      this.when = options.when;
    }

    this.action = options.action;
  };

  this.Autobot = Autobot;
})(this);
