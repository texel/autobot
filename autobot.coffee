Autobot = {}

class Autobot.Story
  constructor: (options) ->
    @steps = []
    @onComplete = options.onComplete
    @onCancel   = options.onCancel

    @currentStepIndex = -1

    stepDefinitions = options.steps || []

    for stepDefinition in stepDefinitions
      step = new Autobot.Step(stepDefinition)

      # Add a reference to this story, so the steps
      # can call back...
      step.story = this
      @steps.push(step)

  run: (startAt) ->
    @next() # TODO: support startAt
  next: ->
    @currentStepIndex += 1

    if @currentStep = @steps[@currentStepIndex]
      @currentStep.run()

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
    @before(this) if @before

    if @when
      if @when(this)
        @action(this)
        @story.next()
      else if @shouldPoll
        @intervalId = setInterval(@poll, @interval)
    else
      @action(this)
      @story.next()

  poll: =>
    if @when(this)
      clearInterval(@intervalId)
      @action(this)
      @story.next()

@Autobot = Autobot
