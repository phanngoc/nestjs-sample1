I have chatbot application, using typeorm and nestjs.
Entity have 3 table: user, message, thread. Thread has many to many to user, and message has many to one to thread.

Source code have two module, app.module and event.module

app.module: contain entity and repository typeorm
event.module: contain socket handle, and want to use repository from app.module

write full code for this application.

Package want to use:
- @nestjs/typeorm
- @nestjs-modules/ioredis
- @nestjs/jwt
- "@nestjs/platform-socket.io": "^10.3.7",


---


I want folder structure best practice for this application.