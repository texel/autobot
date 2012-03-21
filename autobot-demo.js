// autobot-demo.js
// For testing out the Autobot API

// Register a simple callback

$( function () {
  return;

  Autobot.register({
    when: function () {
      return $('h1').length;
    },

    action: function () {
      console.log("there is an h1 on the page!");
    }
  });

  Autobot.register({
    when: function () {
      return $('p').length;
    },

    action: function () {
      console.log('definitely a p tag, too');
    }
  });

  var exampleStory = new Autobot.story([
    {
      action: function (story) {
        // Perform the first step, no matter what
      }
    },
    {
      when: function (story) { /* User has performed the first step */ },
      action: function (story) { 
        /* Perform the second step */

      }
    }
  ]);

  exampleStory.run(2);
});
