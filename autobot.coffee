Autobot = {}

class Autobot.Story
  constructor: (options) ->
    @name  = options.name
    @steps = []
    @beforeEach = options.beforeEach
    @afterEach  = options.afterEach
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
    # Before we get a new step, make sure we
    # run cleanup on the current one
    @currentStep?.cleanup()

    if @currentStep = @steps[@currentStepIndex]
      @currentStep.run()
    else
      @onComplete?(this)

  cancel: ->
    @currentStep?.stop()
    @onCancel?(this)

  before: ->
    @beforeEach?(this)

  after: ->
    @afterEach?(this)

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
    @story?.before()
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
    @action?(this)
    if @story
      @story.after()
      @story.currentStepIndex += 1
      @story.next()

  cleanup: ->
    # If we're currently waiting, stop polling.
    @stop()

@Autobot = Autobot
