(function() {
  var Autobot;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Autobot = {};
  Autobot.Story = (function() {
    function Story(options) {
      var step, stepDefinition, stepDefinitions, _i, _len;
      this.name = options.name;
      this.steps = [];
      this.beforeEach = options.beforeEach;
      this.afterEach = options.afterEach;
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
      return this.executeCurrent();
    };
    Story.prototype.skip = function() {
      var _ref;
      if ((_ref = this.currentStep) != null) {
        _ref.cleanup();
      }
      return this.next();
    };
    Story.prototype.executeCurrent = function() {
      if (this.currentStep = this.steps[this.currentStepIndex]) {
        return this.currentStep.run();
      } else {
        return typeof this.onComplete === "function" ? this.onComplete(this) : void 0;
      }
    };
    Story.prototype.next = function() {
      this.currentStepIndex += 1;
      return this.executeCurrent();
    };
    Story.prototype.cancel = function() {
      var _ref;
      if ((_ref = this.currentStep) != null) {
        _ref.cleanup();
      }
      return typeof this.onCancel === "function" ? this.onCancel(this) : void 0;
    };
    Story.prototype.before = function() {
      return typeof this.beforeEach === "function" ? this.beforeEach(this) : void 0;
    };
    Story.prototype.after = function() {
      return typeof this.afterEach === "function" ? this.afterEach(this) : void 0;
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
      this.run = __bind(this.run, this);
      this.next = __bind(this.next, this);
      this.cleanup = __bind(this.cleanup, this);
      this.execute = __bind(this.execute, this);
      this.startPolling = __bind(this.startPolling, this);
      this.stopPolling = __bind(this.stopPolling, this);      var _ref;
      this.actionQueue = [];
      this.name = options.name;
      this.before = options.before;
      this.waitBefore = options.waitBefore;
      this.action = options.action;
      this.waitAfter = options.waitAfter || options.wait;
      this.shouldPoll = (_ref = options.poll) != null ? _ref : true;
      this.interval = options.interval || 200;
      this.story = options.story;
      if (this.waitBefore) {
        if (this.waitBefore === true) {
          this.waitBefore = function() {
            return false;
          };
        }
        this.waitBeforeWrapper = __bind(function() {
          return this.startPolling(this.waitBefore);
        }, this);
      }
      if (this.waitAfter) {
        if (this.waitAfter === true) {
          this.waitAfter = function() {
            return false;
          };
        }
        this.waitAfterWrapper = __bind(function() {
          return this.startPolling(this.waitAfter);
        }, this);
      }
      if (this.before) {
        this.actionQueue.push(_.bind(this.execute, this, this.before));
      }
      if (this.waitBeforeWrapper) {
        this.actionQueue.push(this.waitBeforeWrapper);
      }
      if (this.action) {
        this.actionQueue.push(_.bind(this.execute, this, this.action));
      }
      if (this.waitAfterWrapper) {
        this.actionQueue.push(this.waitAfterWrapper);
      }
      this.actionQueue.push(_.bind(this.execute, this, this.cleanup));
    }
    Step.prototype.stopPolling = function() {
      if (this.intervalId) {
        return clearInterval(this.intervalId);
      }
    };
    Step.prototype.startPolling = function(f) {
      var pollingFunction;
      this.stopPolling();
      pollingFunction = __bind(function() {
        if (f(this)) {
          this.stopPolling();
          return this.next();
        }
      }, this);
      return this.intervalId = setInterval(pollingFunction, this.interval);
    };
    Step.prototype.execute = function(f) {
      f();
      return this.next();
    };
    Step.prototype.cleanup = function() {
      return this.stopPolling();
    };
    Step.prototype.next = function() {
      var currentAction;
      if (currentAction = this.actionQueue.shift()) {
        return currentAction();
      } else if (this.story) {
        this.story.after();
        return this.story.next();
      }
    };
    Step.prototype.run = function() {
      return this.next();
    };
    return Step;
  })();
  this.Autobot = Autobot;
}).call(this);
