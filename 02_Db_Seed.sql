USE [SKRATCH];
GO



set identity_insert [Tag] on
insert into [Tag] ([Id], [Name], [IsUserCreated], [IsStatus], [Type])
values (1, 'TODO', 0, 1, 'status'), (2, 'P0', 0, 0, 'priority'),(9, 'P1', 0, 0, 'priority'), (10, 'P2', 0, 0, 'priority'),(11, 'P3', 0, 0, 'priority'),(12, 'P4', 0, 0, 'priority'),(3, 'PROJECT', 0, 0, null), (4, 'TASK', 0, 0, null), (5, 'REVIEW', 0, 0, null), (6, 'EVENT', 0, 0, 'type'), (7, 'TAG', 1, 0, null), (8, 'JENKINS', 1, 0, null);
set identity_insert [Tag] off

set identity_insert [User] on
insert into [User] (Id, DisplayName, FirstName, LastName, Email, CreateDateTime, FirebaseUserId) values (1, 'colinraymiller', 'Colin', 'miller', 'colinraymiller@gmail.com', '2020-04-20','ve7miQcU6RfWjIkYMoxVXAzcvnU2');
insert into [User] (Id, DisplayName, FirstName, LastName, Email, CreateDateTime, FirebaseUserId) values (2,  'admin', 'Admin', 'miller', 'admin@example.com', '2020-04-20','hVYU8fsZQ6TLJHKkifh5o7b3FIC3');
set identity_insert [User] off

set identity_insert [Note] on
insert into [Note] (Id, Content, UserId, DateAdded, DateUpdated, DateStart, DateEnd, IsStaged) values (1, 'First Note', 1, '2020-05-19','2020-05-19',null,null, 1);
insert into [Note] (Id, Content, UserId, DateAdded, DateUpdated, DateStart, DateEnd, IsStaged) values (2, 'First Event\n - bring a chair', 1, '2020-05-19','2020-05-19','2022-02-03','2020-02-04', 1);
insert into [Note] (Id, Content, UserId, DateAdded, DateUpdated, DateStart, DateEnd, IsStaged) values (3, 'Second Event', 1, '2020-05-19','2020-05-19','2022-02-02','2020-02-04', 0);
set identity_insert [Note] off

set identity_insert [NoteTag] on
insert into [NoteTag] (Id, NoteId, TagId) values (1, 1, 1);
insert into [NoteTag] (Id, NoteId, TagId) values (2, 2, 7);
insert into [NoteTag] (Id, NoteId, TagId) values (3, 2, 4);
insert into [NoteTag] (Id, NoteId, TagId) values (6, 2, 2);
insert into [NoteTag] (Id, NoteId, TagId) values (4, 3, 5);
insert into [NoteTag] (Id, NoteId, TagId) values (5, 3, 8);
set identity_insert [NoteTag] off
