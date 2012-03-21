// helpbot-demo.js
// For testing out the Helpbot API

// Register a simple callback

$( function () {
  Helpbot.register({
    when: function () {
      return $('h1').length;
    },

    action: function () {
      console.log("there is an h1 on the page!");
    }
  });

  Helpbot.register({
    when: function () {
      return $('p').length;
    },

    action: function () {
      console.log('definitely a p tag, too');
    }
  });
});
