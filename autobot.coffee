Autobot = {}

class Autobot.Story
  constructor: (steps) ->
    @steps = [];

    # Should use a comprehension here
    _.each steps, (step, index) =>
      # Add a reference to this story, so the steps
      # can call back...
      step = _.extend(step, {story: this})

      @steps.push(new Autobot.Step(step))

  run: (startAt) ->
    @next() # TODO: support startAt
  next: ->
    if @currentStep = @steps.shift()
      @currentStep.run()

class Autobot.Step
  constructor: (options) ->
    @when       = options.when
    @action     = options.action
    @shouldPoll = options.poll ? true
    @interval   = options.interval || 200
    @story      = options.story

  run: ->
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
