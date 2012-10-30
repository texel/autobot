(function() {
  var exampleStory, exports;
  exampleStory = new Autobot.Story({
    name: "demo",
    beforeEach: function(story) {
      return 'execute before each step';
    },
    afterEach: function(story) {
      return 'execute after each step';
    },
    steps: [
      {
        name: "start",
        action: function(story) {
          return console.log('Please type something in the field.');
        }
      }, {
        waitBefore: function(story) {
          return $("#testField").val();
        },
        action: function(story) {
          console.log("congratulations, you've written something in the text field!");
          return console.log("now, make the field say 'bacon'");
        }
      }, {
        name: "beforeText",
        before: function(story) {
          return console.log("executing this step before.");
        },
        waitBefore: function(story) {
          return $("#testField").val() === 'bacon';
        },
        action: function(story) {
          return console.log("... and now we're done with the script.");
        }
      }
    ],
    onComplete: function(story) {
      return console.log("story complete");
    },
    onCancel: function(story) {
      return console.log("story cancelled");
    }
  });
  exampleStory.run();
  exports = this;
  exports.exampleStory = exampleStory;
}).call(this);
