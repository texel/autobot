// autobot-demo.js
// For testing out the Autobot API

// Register a simple callback

$( function () {

  var exampleStory = new Autobot.Story([
    {
      action: function (story) {
        // Perform the first step, no matter what
        console.log('performing the first action');
      }
    },
    {
      when: function (story) { /* User has performed the first step */ },
      action: function (story) { 
        /* Perform the second step */

      }
    },
    {
      when: function (story) { /* Some other predicate */ },
      action: function (story) { /* do the last thing */ },
      poll: false // Don't keep checking to see if the condition is met.
    }
  ]);

  exampleStory.run(1);
});
