(function() {
  var Autobot;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Autobot = {};
  Autobot.Story = (function() {
    function Story(options) {
      var step, stepDefinition, stepDefinitions, _i, _len;
      this.steps = [];
      this.onComplete = options.onComplete;
      this.onCancel = options.onCancel;
      this.currentStepIndex = 0;
      stepDefinitions = options.steps || [];
      for (_i = 0, _len = stepDefinitions.length; _i < _len; _i++) {
        stepDefinition = stepDefinitions[_i];
        step = new Autobot.Step(stepDefinition);
        step.story = this;
        this.steps.push(step);
      }
    }
    Story.prototype.run = function(startAt) {
      var startStep;
      if (startAt) {
        startStep = this.findStep(startAt);
        console.log('found step', startStep);
        this.currentStepIndex = _.indexOf(this.steps, this.findStep(startAt));
      }
      return this.next();
    };
    Story.prototype.next = function() {
      if (this.currentStep = this.steps[this.currentStepIndex]) {
        this.currentStep.run();
      } else {
        if (typeof this.onComplete === "function") {
          this.onComplete(this);
        }
      }
      return this.currentStepIndex += 1;
    };
    Story.prototype.cancel = function() {
      var _ref;
      if ((_ref = this.currentStep) != null) {
        _ref.stop();
      }
      return typeof this.onCancel === "function" ? this.onCancel(this) : void 0;
    };
    Story.prototype.findStep = function(nameOrIndex) {
      if (_.isNumber(nameOrIndex)) {
        return this.steps[nameOrIndex];
      } else {
        return _.find(this.steps, function(step) {
          return step.name === nameOrIndex;
        });
      }
    };
    return Story;
  })();
  Autobot.Step = (function() {
    function Step(options) {
      this.poll = __bind(this.poll, this);      var _ref;
      this.name = options.name;
      this.before = options.before;
      this.when = options.when;
      this.action = options.action;
      this.shouldPoll = (_ref = options.poll) != null ? _ref : true;
      this.interval = options.interval || 200;
      this.story = options.story;
    }
    Step.prototype.run = function() {
      if (typeof this.before === "function") {
        this.before(this);
      }
      if (this.when) {
        if (this.when(this)) {
          return this.execute();
        } else if (this.shouldPoll) {
          return this.intervalId = setInterval(this.poll, this.interval);
        }
      } else {
        return this.execute();
      }
    };
    Step.prototype.stop = function() {
      if (this.intervalId) {
        return clearInterval(this.intervalId);
      }
    };
    Step.prototype.poll = function() {
      if (this.when(this)) {
        this.stop();
        return this.execute();
      }
    };
    Step.prototype.execute = function() {
      var _ref;
      this.action(this);
      return (_ref = this.story) != null ? _ref.next() : void 0;
    };
    return Step;
  })();
  this.Autobot = Autobot;
}).call(this);
