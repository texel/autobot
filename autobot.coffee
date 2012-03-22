Autobot = {}

class Autobot.Story
  constructor: (options) ->
    @steps = []
    @onComplete = options.onComplete
    @onCancel   = options.onCancel

    @currentStepIndex = 0

    stepDefinitions = options.steps || []

    for stepDefinition in stepDefinitions
      step = new Autobot.Step(stepDefinition)

      # Add a reference to this story, so the steps
      # can call back...
      step.story = this
      @steps.push(step)

  run: (startAt) ->
    if startAt
      startStep = @findStep(startAt)
      console.log('found step', startStep)
      @currentStepIndex = _.indexOf(@steps, @findStep(startAt))

    @next()

  next: ->
    if @currentStep = @steps[@currentStepIndex]
      @currentStep.run()
    else
      @onComplete?(this)

    @currentStepIndex += 1

  cancel: ->
    @currentStep?.stop()
    @onCancel?(this)

  findStep: (nameOrIndex) ->
    if _.isNumber(nameOrIndex)
      @steps[nameOrIndex]
    else
      _.find @steps, (step) ->
        step.name == nameOrIndex

# Autobot.Step
# Encapsulates the logic for one step in an Autobot story.
# Able to poll continuously, to see if the "when" condition
# is met.
class Autobot.Step
  constructor: (options) ->
    @name       = options.name
    @before     = options.before
    @when       = options.when
    @action     = options.action
    @shouldPoll = options.poll ? true
    @interval   = options.interval || 200
    @story      = options.story

  run: ->
    @before?(this)

    if @when
      if @when(this)
        @execute()
      else if @shouldPoll
        @intervalId = setInterval(@poll, @interval)
    else
      @execute()

  stop: ->
    clearInterval(@intervalId) if @intervalId

  poll: =>
    if @when(this)
      @stop()
      @execute()

  execute: ->
    @action(this)
    @story?.next()

@Autobot = Autobot
