###
ajaxQueue
This function generate queue of ajax calls and start calling
each ajax when the last ajax was completed
###
do () ->
  ajaxQueue = $({})
  $.ajaxQueue = (ajaxOptions) ->
    ajaxComplete = ajaxOptions.complete
    ajaxQueue.queue (next) ->
      ajaxOptions.complete = () ->
        if(ajaxComplete)
          ajaxComplete.apply this, arguments
        next()
      $.ajax ajaxOptions
