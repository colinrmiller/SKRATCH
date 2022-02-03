using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SKRATCH.Models;
using SKRATCH.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace SKRATCH.Repositories
{
	public class NoteRepository : BaseRepository, INoteRepository
	{
		public NoteRepository(IConfiguration config) : base(config) { }

		public List<Note> GetNotesByUserId(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                      SELECT n.Id, 
							  n.Content, 
                              n.DateAdded, 
                              n.DateUpdated, 
							  n.DateStart,
							  n.DateEnd,
							  n.IsStaged,
							  n.UserId,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime,
							  t.Id AS TagId, 
							  t.Name AS TagName, 
							  t.IsUserCreated AS TagIsUserCreated, 
							  t.IsStatus AS TagIsStatus, 
							  t.MetaData AS TagMetaData
                         FROM Note n
                              LEFT JOIN [User] u ON n.UserId = u.id
                              LEFT JOIN NoteTag nt ON nt.NoteId = n.id
                              LEFT JOIN Tag t ON t.Id = nt.TagId
                        WHERE n.UserId = @userId
                        ORDER BY DateAdded ASC";

					cmd.Parameters.AddWithValue("@userId", id);

					var reader = cmd.ExecuteReader();

					var notes = new List<Note>();
					while (reader.Read())
					{
						var noteId = DbUtils.GetInt(reader, "Id");

						var existingNote = notes.FirstOrDefault(note => note.Id == noteId);
						if (existingNote == null)
						{
							existingNote = NewNoteFromReader(reader);
							notes.Add(existingNote);
						}
						if (DbUtils.IsNotDbNull(reader, "TagId"))
						{
							Tag tag = new Tag()
							{
								Id = DbUtils.GetInt(reader, "TagId"),
								UserId = DbUtils.GetInt(reader, "Id"),
								Name = DbUtils.GetString(reader, "TagName"),
								IsUserCreated = DbUtils.GetBoolean(reader, "TagIsUserCreated"),
								MetaData = DbUtils.GetString(reader, "TagMetaData"),
							};

							existingNote.Tags.Add(tag);
						}
					}

					reader.Close();

					return notes;
				}
			}
		}

		public List<Note> GetUpcomingNotesByUserId(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                      SELECT n.Id, 
							  n.Content, 
                              n.DateAdded, 
                              n.DateUpdated, 
							  n.DateStart,
							  n.DateEnd,
							  n.IsStaged,
							  n.UserId,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime,
							  t.Id AS TagId, 
							  t.Name AS TagName, 
							  t.IsUserCreated AS TagIsUserCreated, 
							  t.IsStatus AS TagIsStatus, 
							  t.MetaData AS TagMetaData
                         FROM Note n
                              LEFT JOIN [User] u ON n.UserId = u.id
                              LEFT JOIN NoteTag nt ON nt.NoteId = n.id
                              LEFT JOIN Tag t ON t.Id = nt.TagId
                        WHERE n.UserId = @userId
							AND n.DateStart IS NOT Null 
							AND n.DateEnd <= @endOfDay
                        ORDER BY DateAdded ASC";

					cmd.Parameters.AddWithValue("@userId", id);
					DateTime endOfCurrentDay= new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);

					cmd.Parameters.AddWithValue("@endOfDay", endOfCurrentDay);

					var reader = cmd.ExecuteReader();

					var notes = new List<Note>();
					while (reader.Read())
					{
						var noteId = DbUtils.GetInt(reader, "Id");

						var existingNote = notes.FirstOrDefault(note => note.Id == noteId);
						if (existingNote == null)
						{
							existingNote = NewNoteFromReader(reader);
							notes.Add(existingNote);
						}
						if (DbUtils.IsNotDbNull(reader, "TagId"))
						{
							Tag tag = new Tag()
							{
								Id = DbUtils.GetInt(reader, "TagId"),
								UserId = DbUtils.GetInt(reader, "Id"),
								Name = DbUtils.GetString(reader, "TagName"),
								IsUserCreated = DbUtils.GetBoolean(reader, "TagIsUserCreated"),
								MetaData = DbUtils.GetString(reader, "TagMetaData"),
							};

							existingNote.Tags.Add(tag);
						}
					}

					reader.Close();

					return notes;
				}
			}
		}

		public Note GetNoteById(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                       SELECT n.Id, 
							  n.Content, 
                              n.DateAdded, 
                              n.DateUpdated, 
							  n.DateStart,
							  n.DateEnd,
							  n.IsStaged,
							  n.UserId,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime,
							  t.Id AS TagId, 
							  t.Name AS TagName, 
							  t.IsUserCreated AS TagIsUserCreated, 
							  t.IsStatus AS TagIsStatus, 
							  t.MetaData AS TagMetaData
                         FROM Note n
                              LEFT JOIN [User] u ON n.UserId = u.id
                              LEFT JOIN NoteTag nt ON nt.NoteId = n.id
                              LEFT JOIN Tag t ON t.Id = nt.TagId
                        WHERE n.Id = @id
                        ORDER BY DateUpdated DESC";

					cmd.Parameters.AddWithValue("@id", id);

					var reader = cmd.ExecuteReader();

					Note note = null;
					while (reader.Read())
					{
						if (note == null)
						{
							note = NewNoteFromReader(reader);
						}
						if (DbUtils.IsNotDbNull(reader, "TagId"))
						{
							Tag tag = new Tag()
							{
								Id = DbUtils.GetInt(reader, "TagId"),
								UserId = DbUtils.GetInt(reader, "Id"),
								Name = DbUtils.GetString(reader, "TagName"),
								IsUserCreated = DbUtils.GetBoolean(reader, "TagIsUserCreated"),
								MetaData = DbUtils.GetString(reader, "TagMetaData"),
							};

							note.Tags.Add(tag);
						}
					}

					reader.Close();

					return note;
				}
			}
		}

		public List<Note> GetNotesByTagId(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                       SELECT n.Id, 
							  n.Content, 
                              n.DateAdded, 
                              n.DateUpdated, 
							  n.DateStart,
							  n.DateEnd,
							  n.IsStaged,
							  n.UserId,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime,
							  t.Id AS TagId, 
							  t.Name AS TagName, 
							  t.IsUserCreated AS TagIsUserCreated, 
							  t.IsStatus AS TagIsStatus, 
							  t.MetaData AS TagMetaData
                         FROM Note n
                              LEFT JOIN [User] u ON n.UserId = u.id
                              LEFT JOIN NoteTag nt ON nt.NoteId = n.id
                              LEFT JOIN Tag t ON t.Id = nt.TagId
                        WHERE TagId = @id
                        ORDER BY DateUpdated DESC";

					cmd.Parameters.AddWithValue("@id", id);


					var notes = new List<Note>();
					var reader = cmd.ExecuteReader();
					while (reader.Read())
					{
						var noteId = DbUtils.GetInt(reader, "Id");

						var existingNote = notes.FirstOrDefault(note => note.Id == noteId);
						if (existingNote == null)
						{
							existingNote = NewNoteFromReader(reader);
							notes.Add(existingNote);
						}
						if (DbUtils.IsNotDbNull(reader, "TagId"))
						{
							Tag tag = new Tag()
							{
								Id = DbUtils.GetInt(reader, "TagId"),
								UserId = DbUtils.GetInt(reader, "Id"),
								Name = DbUtils.GetString(reader, "TagName"),
								IsUserCreated = DbUtils.GetBoolean(reader, "TagIsUserCreated"),
								MetaData = DbUtils.GetString(reader, "TagMetaData"),
							};

							existingNote.Tags.Add(tag);
						}
					}

					reader.Close();

					return notes;
				}
			}
		}

		public List<Note> GetNotesByTagName(string tagName, int userId)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                       SELECT n.Id, 
							  n.Content, 
                              n.DateAdded, 
                              n.DateUpdated, 
							  n.DateStart,
							  n.DateEnd,
							  n.IsStaged,
							  n.UserId,
                              u.FirstName, u.LastName, u.DisplayName, 
                              u.Email, u.CreateDateTime,
							  t.Id AS TagId, 
							  t.[Name] AS TagName, 
							  t.IsUserCreated AS TagIsUserCreated, 
							  t.IsStatus AS TagIsStatus, 
							  t.MetaData AS TagMetaData
                         FROM Note n
                              LEFT JOIN [User] u ON n.UserId = u.id
                              LEFT JOIN NoteTag nt ON nt.NoteId = n.id
                              LEFT JOIN Tag t ON t.Id = nt.TagId
                        WHERE t.[Name] = @tagName AND n.UserId = @userId
                        ORDER BY DateUpdated ASC";

					cmd.Parameters.AddWithValue("@tagName", tagName);
					cmd.Parameters.AddWithValue("@userId", userId);

					var reader = cmd.ExecuteReader();

					var notes = new List<Note>();
					while (reader.Read())
					{
						var noteId = DbUtils.GetInt(reader, "Id");
						
						var existingNote = notes.FirstOrDefault(note => note.Id == noteId);
						if (existingNote == null)
						{
							existingNote = NewNoteFromReader(reader);
							notes.Add(existingNote);
						}
						if (DbUtils.IsNotDbNull(reader, "TagId"))
						{
							Tag tag = new Tag()
							{
								Id = DbUtils.GetInt(reader, "TagId"),
								UserId = DbUtils.GetInt(reader, "Id"),
								Name = DbUtils.GetString(reader, "TagName"),
								IsUserCreated = DbUtils.GetBoolean(reader, "TagIsUserCreated"),
								MetaData = DbUtils.GetString(reader, "TagMetaData"),
							};

							existingNote.Tags.Add(tag);
						}
					}

					reader.Close();

					return notes;
				}
			}
		}

		public int Add(Note Note)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                        INSERT INTO Note (
                            Content, UserId, DateAdded, DateUpdated, IsStaged, MetaData)
                        OUTPUT INSERTED.ID
                        VALUES (
                            @Content, @UserId, @DateAdded, @DateUpdated, @IsStaged, @MetaData)";
					cmd.Parameters.AddWithValue("@Content", Note.Content);
					cmd.Parameters.AddWithValue("@UserId", Note.UserId);
					cmd.Parameters.AddWithValue("@DateAdded", Note.DateAdded);
					cmd.Parameters.AddWithValue("@DateUpdated", Note.DateUpdated);

					if (Note.IsStaged)
					{
						cmd.Parameters.AddWithValue("@IsStaged", '1');
					}
					else
					{
						cmd.Parameters.AddWithValue("@IsStaged", '0');
					}

					if (Note.MetaData != null)
					{
						cmd.Parameters.AddWithValue("@metaData", Note.MetaData);
					}
					else
					{
						cmd.Parameters.AddWithValue("@metaData", "{}");
					}

					Note.Id = (int)cmd.ExecuteScalar();
					return Note.Id;
				}
			}
		}

		public void Update(Note Note)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{


					cmd.CommandText = @"UPDATE Note 
                                           SET Content = @content,
                                               DateUpdated = @dateUpdated,
											   IsStaged = @IsStaged,
                                               MetaData = @metaData
                                         WHERE id = @id";

					cmd.Parameters.AddWithValue("@content", Note.Content);
					cmd.Parameters.AddWithValue("@dateUpdated", Note.DateUpdated);
					cmd.Parameters.AddWithValue("@id", Note.Id);
					
					if (Note.IsStaged)
					{
						cmd.Parameters.AddWithValue("@IsStaged", '1');
					} else
					{
						cmd.Parameters.AddWithValue("@IsStaged", '0');
					}

					if (Note.MetaData != null)
					{
						cmd.Parameters.AddWithValue("@metaData", Note.MetaData);
					}
					else
					{
						cmd.Parameters.AddWithValue("@metaData", "{}");
					}


					cmd.ExecuteNonQuery();
				}
			}
		}

		public void Delete(int id)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"DELETE FROM Note WHERE id = @id";
					cmd.Parameters.AddWithValue("@id", id);

					cmd.ExecuteNonQuery();
				}
			}
		}

		private Note NewNoteFromReader(SqlDataReader reader)
		{
			return new Note()
			{
				Id = reader.GetInt32(reader.GetOrdinal("Id")),
				Content = reader.GetString(reader.GetOrdinal("Content")),
				DateAdded = reader.GetDateTime(reader.GetOrdinal("DateAdded")),
				DateUpdated = reader.GetDateTime(reader.GetOrdinal("DateUpdated")),
				UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
				DateStart = DbUtils.GetNullableDateTime(reader, "DateStart"),
				DateEnd = DbUtils.GetNullableDateTime(reader,"DateEnd"),
				User = new User()
				{
					Id = reader.GetInt32(reader.GetOrdinal("UserId")),
					DisplayName = reader.GetString(reader.GetOrdinal("DisplayName")),
					FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
					LastName = reader.GetString(reader.GetOrdinal("LastName")),
					Email = reader.GetString(reader.GetOrdinal("Email")),
					CreateDateTime = reader.GetDateTime(reader.GetOrdinal("CreateDateTime")),
				},
				Tags = new List<Tag>()
			};
		}

	}

}
