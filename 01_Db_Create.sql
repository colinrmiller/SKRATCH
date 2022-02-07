USE [master]

IF db_Id('SKRATCH') IS NULl
  CREATE DATABASE [SKRATCH]
GO

USE [SKRATCH]
GO

DROP TABLE IF EXISTS [User];
DROP TABLE IF EXISTS [Note];
DROP TABLE IF EXISTS [NoteTag];
DROP TABLE IF EXISTS [Tag];
DROP TABLE IF EXISTS [TagDependency];
GO







CREATE TABLE [User] (
  [Id] int PRIMARY KEY IdENTITY(1, 1),
  [DisplayName] nvarchar(255),
  [FirstName] nvarchar(255),
  [LastName] nvarchar(255),
  [Email] nvarchar(255) NOT NULL,
  [CreateDateTime] datetime NOT NULL,
  [FirebaseUserId] nvarchar(255),

  CONSTRAINT UQ_FirebaseUserId UNIQUE(FirebaseUserId)

)
GO

CREATE TABLE [Note] (
  [Id] int PRIMARY KEY IdENTITY(1, 1),
  [Content] nvarchar(max) NOT NULL,
  [UserId] int NOT NULL,
  [DateAdded] datetime NOT NULL,
  [DateUpdated] datetime,
  [DateStart] datetime,
  [DateEnd] datetime,
  [IsStaged] bit NOT NULL,
  [MetaData] nvarchar(255),

  CONSTRAINT [FK_Note_User] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id]),
)
GO

CREATE TABLE [Tag] (
  [Id] int PRIMARY KEY IdENTITY(1, 1),
  [Name] nvarchar(255) NOT NULL,
  [UserId] int,
  [IsUserCreated] bit NOT NULL,
  [IsStatus] bit NOT NULL,
  [MetaData] nvarchar,
  [Type] nvarchar(255),

  CONSTRAINT [FK_Tag_User] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id]),
)
GO

CREATE TABLE [NoteTag] (
  [Id] int PRIMARY KEY IdENTITY(1, 1),
  [NoteId] int NOT NULL,
  [TagId] int NOT NULL,

  CONSTRAINT [FK_NoteTag_Note] FOREIGN KEY ([NoteId]) REFERENCES [Note] ([Id]) ON DELETE CASCADE,
  CONSTRAINT [FK_NoteTag_Tag] FOREIGN KEY ([TagId]) REFERENCES [Tag] ([Id]) ON DELETE CASCADE,

)
GO




CREATE TABLE [TagDependency] (
  [Id] int PRIMARY KEY IdENTITY(1, 1),
  [ParentTagId] int,
  [ChildTagId] int,

  CONSTRAINT [FK_TagDependency_ParentTag] FOREIGN KEY ([ParentTagId]) REFERENCES [Tag] ([Id]) ON DELETE NO ACTION,
  CONSTRAINT [FK_TagDependency_ChildTag] FOREIGN KEY ([ChildTagId]) REFERENCES [Tag] ([Id]) ON DELETE NO ACTION,
)
GO
