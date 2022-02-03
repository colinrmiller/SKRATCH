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
	public class TagRepository : BaseRepository, ITagRepository
	{

		public TagRepository(IConfiguration config) : base(config) { }

		public List<Tag> GetAllUserTags(int userId)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                      Select * from Tag
					  Where UserId = @userId OR IsUserCreated = 0
                        ORDER BY name ASC";

					cmd.Parameters.AddWithValue("@UserId", userId);

					var reader = cmd.ExecuteReader();

					var tags = new List<Tag>();
					while (reader.Read())
					{
						tags.Add(new Tag()
						{
							Id = reader.GetInt32(reader.GetOrdinal("Id")),
							Name = reader.GetString(reader.GetOrdinal("name")),
						});
					}

					reader.Close();

					return tags;
				}
			}
		}

		public List<Tag> GetAllUserTagsByType(int userId, string type)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                      Select * from Tag
					  Where (UserId = @userId OR IsUserCreated = 0) 
						AND (Type = @type) 
					
                        ORDER BY name ASC";

					cmd.Parameters.AddWithValue("@userId", userId);
					cmd.Parameters.AddWithValue("@type", type);

					var reader = cmd.ExecuteReader();

					var tags = new List<Tag>();
					while (reader.Read())
					{
						tags.Add(NewTagFromReader(reader));
					}

					reader.Close();

					return tags;
				}
			}
		}

		public int Add(Tag tag)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"INSERT INTO Tag (Name, UserId, IsUserCreated, IsStatus)
									    OUTPUT INSERTED.ID
                                        VALUES (@Name, @UserId, @IsUserCreated, 0)";

					cmd.Parameters.AddWithValue("@Name", tag.Name);
					cmd.Parameters.AddWithValue("@UserId", tag.UserId);
					if(tag.IsUserCreated){
						cmd.Parameters.AddWithValue("@IsUserCreated", 1);
					}
					else
					{
						cmd.Parameters.AddWithValue("@IsUserCreated", 0);
					}

					tag.Id = (int)cmd.ExecuteScalar();

					return tag.Id;

				}
			}
		}
		
		public Tag GetTagById(int id)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"SELECT Id,
                                               Name
                                          FROM Tag 
                                         WHERE id = @id";
					cmd.Parameters.AddWithValue("@id", id);
					Tag tag = null;
					SqlDataReader reader = cmd.ExecuteReader();
					while (reader.Read())
					{
						if (tag == null)
						{
							tag = new Tag()
							{
								Id = reader.GetInt32(reader.GetOrdinal("Id")),
								Name = reader.GetString(reader.GetOrdinal("Name"))
							};
						}
					}
					reader.Close();
					return tag;
				}
			}
		}

		public void AddTagToNote(NoteTag noteTag)
		{

			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"INSERT INTO NoteTag (NoteId, TagId) OUTPUT INSERTED.ID
                                                     VALUES (@noteId, @tagId)";
					cmd.Parameters.AddWithValue("@noteId", noteTag.NoteId);
					cmd.Parameters.AddWithValue("@tagId", noteTag.TagId);

					int id = (int)cmd.ExecuteScalar();

					noteTag.Id = id;
				}
			}
		}

		public List<Tag> GetTagsByNoteId(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                       SELECT t.*, nt.NoteId
                         FROM Note n
                              LEFT JOIN NoteTag nt ON nt.NoteId = n.Id
                              LEFT JOIN Tag t ON t.Id = nt.TagId
                        WHERE n.id = @id";

					cmd.Parameters.AddWithValue("@id", id);
					var reader = cmd.ExecuteReader();

					List<Tag> tags = new List<Tag> { };

					while (reader.Read())
					{
						Tag tag = NewTagFromReader(reader);

						tags.Add(tag);
					}

					reader.Close();

					return tags;
				}
			}
		}

		public void Update(Tag tag)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"UPDATE Tag 
                                           SET Name = @name
                                         WHERE id = @id";
					cmd.Parameters.AddWithValue("@name", tag.Name);
					cmd.Parameters.AddWithValue("@id", tag.Id);
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
					cmd.CommandText = @"DELETE FROM Tag WHERE id = @id";
					cmd.Parameters.AddWithValue("@id", id);
					cmd.ExecuteNonQuery();
				}
			}
		}

		public List<Tag> GetPriorityTags()
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                      Select * from Tag
					  Where Type = 'Priority'
                        ORDER BY name ASC";

					var reader = cmd.ExecuteReader();

					var tags = new List<Tag>();
					while (reader.Read())
					{
						tags.Add(new Tag()
						{
							Id = reader.GetInt32(reader.GetOrdinal("Id")),
							Name = reader.GetString(reader.GetOrdinal("name")),
						});
					}

					reader.Close();

					return tags;
				}
			}
		}

		private Tag NewTagFromReader(SqlDataReader reader)
		{
			return new Tag()
			{
				Id = DbUtils.GetInt(reader, "Id"),
				Name = DbUtils.GetNullableString(reader, "Name"),
				UserId = DbUtils.GetNullableInt(reader, "UserId"),
				IsUserCreated = DbUtils.GetBoolean(reader, "IsUserCreated"),
				IsStatus = DbUtils.GetBoolean(reader, "IsStatus"),
				Type = DbUtils.GetNullableString(reader, "Type"),
				MetaData = DbUtils.GetNullableString(reader, "MetaData"),
			};
		}
	}
}
