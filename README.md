# WSCHAT Client
**Websocket chat app server, build with golang**

This project is part of Talenthub batch 11 "Scalable Web Service With Go" submission


## Known Limitations/Bugs

- (SERVER) All data (sessions, users, etc) are saved in memory. There is no database. *but this is easy to implement.
- (SERVER) If user change session, the user data is still saved in previous session, eventhou they didn't get the new message anymore
- (SERVER) sometimes there is PANIC ERROR log, eventhou the server is keep running, I'm still figuring it out.
- All new session created as "PRIVATE" type.
- user account & session-list are saved in localStorage, so there is possibility that the list is not uptodate.
- Every reload, localStorage are cleared, so you will create "new account" every reload.
- Prompt asking your name (for creating account), sometimes appear twice, so It will be creating 2 account in the server. last created account will be used.
- There is no ability to change account. 
- Broken layout in chat-box (especially in mobile view) 

## TODO NEXT
- Implement database system
- Implement authentication
- Change Request & Response schema for easier maintenance
- Fix bugs in FrontEnd
- Responsive UI


2023 &copy; Ahmad Ma'ruf
