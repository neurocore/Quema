# Checklist

## 1. Core functionality (building MVP)

- [x] class of user with its attributes (also banned start & end time)
- [x] formalize state into simple object
- [x] save/load state to file
- [x] create actions with pure redo on state
- [ ] output to panel "statictics" users stat 
- [ ] ability to ban user from panel "queue"
- [ ] output actions log into respective panel
- [ ] parse & execute commands from command line
- [ ] command join [user] adds user to queue
- [ ] command play [code] sends to all users in party that code
- [ ] command ban [user] [time] to ban user
- [ ] commands clear, left [user], unban [user], set_n [n]
- [ ] make twitch connection via new window with oath request
- [ ] read all followers from channel and update our list
- [ ] testing (unit?)

## 2. Improvements

- [ ] not form party from first N users in queue, otherwise listen to their + in chat
- [ ] remove afk-ing users from queue
- [ ] change users stats after respective actions
- [ ] drag & drop for panel "queue"
- [ ] interpanel drag & drop (stats -> queue)
- [ ] listen to chat users commands and execute (if possible)
- [ ] two separate action lists for users and admin (to undo only admin actions)
- [ ] do we really need command pattern instead memento? (test on big channels)
