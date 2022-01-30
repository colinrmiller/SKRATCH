USE [SKRATCH];
GO



set identity_insert [Tag] on
insert into [Tag] ([Id], [Name], [IsUserCreated], [IsStatus])
values (1, 'TODO', 0, 0), (2, 'URGENT', 0, 0), (3, 'PROJECT', 0, 0), (4, 'TASK', 0, 0), (5, 'REVIEW', 0, 0), (6, 'EVENT', 0, 0), (7, 'TAG', 1, 0), (8, 'JENKINS', 1, 0);
set identity_insert [Tag] off

set identity_insert [User] on
insert into [User] (Id, DisplayName, FirstName, LastName, Email, CreateDateTime, FirebaseUserId) values (1, 'colinraymiller', 'Colin', 'miller', 'colinraymiller@gmail.com', '2020-04-20','hrEhRHFb3gfkLSKXNO656lwJpo73');
set identity_insert [User] off

set identity_insert [Note] on
insert into [Note] (Id, Content, UserId, DateAdded, IsStaged) values (1, 'First Note', 1, '2020-05-19', 1);
insert into [Note] (Id, Content, UserId, DateAdded, IsStaged) values (2, 'Test\n #TAG #PROJECT\n - Action 1 #TASK\n ', 1, '2020-05-19', 1);
insert into [Note] (Id, Content, UserId, DateAdded, IsStaged) values (3, 'Test\n #JENKINS #Review\n - Installed on port 8080\n - CI/CD App', 1, '2020-05-19', 0);
set identity_insert [Note] off

set identity_insert [NoteTag] on
insert into [NoteTag] (Id, NoteId, TagId) values (1, 1, 1);
insert into [NoteTag] (Id, NoteId, TagId) values (2, 2, 7);
insert into [NoteTag] (Id, NoteId, TagId) values (3, 2, 4);
insert into [NoteTag] (Id, NoteId, TagId) values (4, 3, 5);
insert into [NoteTag] (Id, NoteId, TagId) values (5, 3, 8);
set identity_insert [NoteTag] off
