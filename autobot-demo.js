(function() {
  var exampleStory, exports;
  exampleStory = new Autobot.Story({
    steps: [
      {
        action: function(story) {
          return console.log('Please type something in the field.');
        }
      }, {
        when: function(story) {
          return $("#testField").val();
        },
        action: function(story) {
          console.log("congratulations, you've written something in the text field!");
          return console.log("now, make the field say 'bazonga'");
        }
      }, {
        before: function(story) {
          return console.log("executing this step before.");
        },
        when: function(story) {
          return $("#testField").val() === 'bazonga';
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
  exampleStory.run(1);
  exports = this;
  exports.exampleStory = exampleStory;
}).call(this);
