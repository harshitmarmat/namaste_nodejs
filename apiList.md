### Api List

## authRouter
    - POST /signup
    - POST /login
    - POST /logout

## profileRouter
    - GET /profile/view
    - PATCH /profile/update

## requestRouter
    - POST /request/send/:status/:toUserId
    - POST /request/reveiew/:status/:fromUserId

## userRouter
    - GET /user/requests/received
    - GET /user/connections
    - GET /user/feed


## Event 
    - GET /events (all events)
    - GET /event/:id (event_id)

    ## Event Detail 
    - Event Name 
    - Event Date / time
    - Event Venue
    - Event capacity
    - Event participated member
    - Event participants