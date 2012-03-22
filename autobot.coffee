Autobot = {}

class Autobot.Story
  constructor: (@steps) ->
    # Should use a comprehension here
    _.each @steps, (step, index) =>
      @steps.push(new Autobot.Step(step))

  run: (startAt) ->

  next: ->
    @currentStep = @steps.unshift()
    @currentStep.run()

class Autobot.Step
  constructor: (options) ->
    @when     = options.when
    @action   = options.action
    @poll     = options.poll ? true
    @interval = options.interval || 200

  run: ->
    if @when && @when(this)
      @action(this)
    else if @poll
      @intervalId = setInterval(@poll, @interval)

  poll: ->
    if @when(this)
      clearInterval(@intervalId)
      @action(this)

@Autobot = Autobot
