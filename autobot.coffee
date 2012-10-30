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

    @executeCurrent()

  skip: ->
    # Before we get a new step, make sure we
    # run cleanup on the current one
    @currentStep?.cleanup()
    @next()

  executeCurrent: ->
    if @currentStep = @steps[@currentStepIndex]
      @currentStep.run()
    else
      @onComplete?(this)

  next: ->
    @currentStepIndex += 1
    @executeCurrent()
    
  cancel: ->
    @currentStep?.cleanup()
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
# Able to poll continuously, to see if the "waitBefore" and "waitAfter" conditions
# are met.
class Autobot.Step
  constructor: (options) ->
    @actionQueue = []

    @name       = options.name
    @before     = options.before
    @waitBefore = options.waitBefore # Pass true to wait until @next() is called on the story
    @action     = options.action
    @waitAfter  = options.waitAfter
    @shouldPoll = options.poll ? true
    @interval   = options.interval || 200
    @story      = options.story

    # Passing true to @waitBefore or @waitAfter creates a function that waits around forever
    if @waitBefore
      if @waitBefore == true
        @waitBefore = -> (false)

      @waitBeforeWrapper = =>
        @startPolling(@waitBefore)

    if @waitAfter
      if @waitAfter == true
        @waitAfter = -> (false)

      @waitAfterWrapper = =>
        @startPolling(@waitAfter)

    # Prepare the queue
    @actionQueue.push(_.bind(@execute, this, @before))  if @before
    @actionQueue.push(@waitBeforeWrapper)               if @waitBeforeWrapper
    @actionQueue.push(_.bind(@execute, this, @action))  if @action
    @actionQueue.push(@waitAfterWrapper)                if @waitAfterWrapper
    @actionQueue.push(_.bind(@execute, this, @cleanup))

  stopPolling: =>
    clearInterval(@intervalId) if @intervalId
  
  # Take a function, and poll its result periodically.
  # When the function returns true, execute the next item in the stack.
  startPolling: (f) =>
    @stopPolling() # We don't want multiple stuff polling at once.

    pollingFunction = =>
      if f(this)
        @stopPolling()
        @next()

    @intervalId = setInterval(pollingFunction, @interval)

  # Wrapper that takes a function and makes sure we call @next
  execute: (f) =>
    f()
    @next()
    # @action?(this)
    # if @story
      # @story.after()
      # @story.currentStepIndex += 1
      # @story.next()

  cleanup: =>
    # If we're currently waiting, stop polling.
    @stopPolling()

  next: =>
    if currentAction = @actionQueue.shift()
      currentAction()
    else if @story
      @story.after()
      @story.next()

  run: =>
    @next()

@Autobot = Autobot
