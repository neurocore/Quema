# Checklist

## 1. Core functionality (building MVP)

- [x] class of user with its attributes (also banned start & end time)
- [x] formalize state into simple object
- [x] save/load state to file
- [x] create actions with pure redo on state
- [x] output to panel "statictics" users stat 
- [ ] ability to ban user from panel "queue"
- [ ] output actions log into respective panel
- [x] parse & execute commands from command line
- [x] command join [user] adds user to queue
- [x] command ban [user] [time] to ban user
- [x] command play [user] adds user to selection pool if selection started
- [x] command start [code] [time] starting selection and then a game session
- [x] commands clear, left [user], unban [user], set_n [n]
- [ ] not form party from first N users in queue, otherwise listen to their + in chat
- [x] changing zoom by ctrl+wheel and ctrl+0
- [ ] status bar (waiting/selecting, last action)
- [ ] make twitch connection via new window with oath request
- [ ] read all followers from channel and update our list
- [x] testing (unit)
- [ ] actions are throwing exceptions to describe the essence of the error
- [ ] strategies of adding users by its rating

## 2. Improvements

- [ ] remove afk-ing users from queue
- [ ] change users stats after respective actions
- [ ] drag & drop for panel "queue"
- [ ] interpanel drag & drop (stats -> queue)
- [ ] listen to chat users commands and execute (if possible)
- [ ] two separate action lists for users and admin (to undo only admin actions)
- [ ] do we really need command pattern instead of memento? (test on big channels)
- [ ] localization (English)
- [ ] ability to hide/show panels
- [ ] top navigation menu
- [ ] dark theme
