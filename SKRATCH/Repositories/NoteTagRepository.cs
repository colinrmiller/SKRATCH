using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SKRATCH.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Repositories
{
	public class NoteTagRepository : BaseRepository, INoteTagRepository
	{
		public NoteTagRepository(IConfiguration config) : base(config) { }

		public NoteTag GetById(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                       SELECT NoteId, TagID
                         FROM NoteTag
                        WHERE Id = @id;";

					cmd.Parameters.AddWithValue("@id", id);
					var reader = cmd.ExecuteReader();

					NoteTag NoteTag = new NoteTag();

					if (reader.Read())
					{
						NoteTag.Id = id;
						NoteTag.NoteId = reader.GetInt32(reader.GetOrdinal("NoteId"));
						NoteTag.TagId = reader.GetInt32(reader.GetOrdinal("TagId"));
					}

					reader.Close();

					return NoteTag;
				}
			}
		}

		//public List<NoteTag> GetNoteTagsByNoteId(int id)
		//{
		//    using (var conn = Connection)
		//    {
		//        conn.Open();
		//        using (var cmd = conn.CreateCommand())
		//        {
		//            cmd.CommandText = @"
		//               SELECT pt.Id, pt.NoteId, pt.TagId, t.Name 
		//                 FROM NoteTag pt
		//                      LEFT JOIN Tag t ON t.Id = pt.TagId
		//                      LEFT JOIN Note p ON p.id= pt.NoteId
		//                WHERE p.id = @id";

		//            cmd.Parameters.AddWithValue("@id", id);
		//            var reader = cmd.ExecuteReader();

		//            List<NoteTag> NoteTags = new List<NoteTag> { };

		//            while (reader.Read())
		//            {
		//                NoteTag NoteTag = new NoteTag()
		//                {
		//                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
		//                    NoteId = reader.GetInt32(reader.GetOrdinal("NoteId")),
		//                    TagId = reader.GetInt32(reader.GetOrdinal("TagId")),
		//                    Tag = new Tag()
		//                    {
		//                        Name = reader.GetString(reader.GetOrdinal("Name")),
		//                    }
		//                };

		//                NoteTags.Add(NoteTag);
		//            }

		//            reader.Close();

		//            return NoteTags;
		//        }
		//    }
		//}

		public void Add(NoteTag NoteTag)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"INSERT INTO NoteTag (NoteId, TagId) OUTPUT INSERTED.ID
                                                     VALUES (@NoteId, @TagId)";
					cmd.Parameters.AddWithValue("@NoteId", NoteTag.NoteId);
					cmd.Parameters.AddWithValue("@TagId", NoteTag.TagId);

					int id = (int)cmd.ExecuteScalar();

					NoteTag.Id = id;
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
					cmd.CommandText = @"DELETE FROM NoteTag WHERE id = @id";
					cmd.Parameters.AddWithValue("@id", id);

					cmd.ExecuteNonQuery();
				}
			}
		}
		public void ClearNoteTag(NoteTag noteTag)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"DELETE FROM NoteTag WHERE NoteId = @NoteId AND TagId = @TagId";
					cmd.Parameters.AddWithValue("@NoteId", noteTag.NoteId);
					cmd.Parameters.AddWithValue("@TagId", noteTag.TagId);

					cmd.ExecuteNonQuery();
				}
			}
		}


		public void ClearNoteTagsForNote(int noteId)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"DELETE FROM NoteTag WHERE NoteId = @NoteId";
					cmd.Parameters.AddWithValue("@NoteId", noteId);

					cmd.ExecuteNonQuery();
				}
			}
		}
	}
}
