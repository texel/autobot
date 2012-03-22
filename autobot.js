(function() {
  var Autobot;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Autobot = {};
  Autobot.Story = (function() {
    function Story(steps) {
      this.steps = [];
      _.each(steps, __bind(function(step, index) {
        step = _.extend(step, {
          story: this
        });
        return this.steps.push(new Autobot.Step(step));
      }, this));
    }
    Story.prototype.run = function(startAt) {
      return this.next();
    };
    Story.prototype.next = function() {
      if (this.currentStep = this.steps.shift()) {
        return this.currentStep.run();
      }
    };
    return Story;
  })();
  Autobot.Step = (function() {
    function Step(options) {
      this.poll = __bind(this.poll, this);      var _ref;
      this.when = options.when;
      this.action = options.action;
      this.shouldPoll = (_ref = options.poll) != null ? _ref : true;
      this.interval = options.interval || 200;
      this.story = options.story;
    }
    Step.prototype.run = function() {
      if (this.when) {
        if (this.when(this)) {
          this.action(this);
          return this.story.next();
        } else if (this.shouldPoll) {
          return this.intervalId = setInterval(this.poll, this.interval);
        }
      } else {
        this.action(this);
        return this.story.next();
      }
    };
    Step.prototype.poll = function() {
      if (this.when(this)) {
        clearInterval(this.intervalId);
        this.action(this);
        return this.story.next();
      }
    };
    return Step;
  })();
  this.Autobot = Autobot;
}).call(this);
