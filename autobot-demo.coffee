# autobot-demo.coffee
# For testing out the Autobot API

exampleStory = new Autobot.Story(
  steps: [
    {
      name: "start"
      action: (story) ->
        # Perform the first step, no matter what
        console.log('Please type something in the field.')
    }
    {
      when: (story) ->
        # user has performed the first step
        $("#testField").val()

      action: (story) ->
        # Perform the second step
        console.log("congratulations, you've written something in the text field!")
        console.log("now, make the field say 'bacon'")
    }
    {
      before: (story) ->
        console.log("executing this step before.")

      when: (story) ->
        $("#testField").val() is 'bacon'

      action: (story) ->
        # Do the last thing
        console.log("... and now we're done with the script.")
    }
  ]
  onComplete: (story) ->
    console.log("story complete")

  onCancel: (story) ->
    console.log("story cancelled")
)

exampleStory.run(1)

exports = this
exports.exampleStory = exampleStory
