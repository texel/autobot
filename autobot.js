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
      
    },
    
    next: function () {
      this.currentStep = this.steps.unshift();
      this.currentStep.run();
    }
  });

  Autobot.Step = function ( options ) {
    if (options.when) {
      this.when = options.when;
    }

    this.action = options.action;

    // poll defaults to true
    if ('poll' in options) {
      this.poll = options.poll;
    }
    else {
      this.poll = true;
    }

    // By default, poll every 200ms
    this.interval = options.interval || 200;
  };

  _.extend(Autobot.Step.prototype, {
    run: function () {
      if (this.when && this.when(this)) {
        this.action(this);
      }
      else if (this.poll) {
        this.intervalId = setInterval(this.poll, this.interval);
      }
    },

    poll: function () {
      if (this.when(this)) {
        clearInterval(this.intervalId);
        this.action(this);
      }
    }
  });

  this.Autobot = Autobot;
})(this);
