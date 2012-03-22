// autobot-demo.js
// For testing out the Autobot API

// Register a simple callback

$( function () {

  var exampleStory = new Autobot.Story([
    {
      action: function (story) {
        // Perform the first step, no matter what
        console.log('Please type something in the field.');
      }
    },
    {
      when: function (story) { 
        /* User has performed the first step */
        return $("#testField").val();
      },
      action: function (story) { 
        /* Perform the second step */
        console.log("congratulations, you've written something in the text field!");
      }
    },
    {
      action: function (story) { 
        /* do the last thing */
        console.log("... and now we're done with the script.");
      }
    }
  ]);

  exampleStory.run(1);
  window.exampleStory = exampleStory;
});
