using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SKRATCH.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Repositories
{
	public class TagDependencyRepository : BaseRepository, ITagDependencyRepository
	{
		public TagDependencyRepository(IConfiguration config) : base(config) { }

		public TagDependency GetById(int id)
		{
			using (var conn = Connection)
			{
				conn.Open();
				using (var cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"
                       SELECT ChildTagId, ParentTagId
                         FROM TagDependency
                        WHERE Id = @id;";

					cmd.Parameters.AddWithValue("@id", id);
					var reader = cmd.ExecuteReader();

					TagDependency TagDependency = new TagDependency();

					if (reader.Read())
					{
						TagDependency.Id = id;
						TagDependency.ChildTagId = reader.GetInt32(reader.GetOrdinal("ChildTagId"));
						TagDependency.ParentTagId = reader.GetInt32(reader.GetOrdinal("ParentTagId"));
					}

					reader.Close();

					return TagDependency;
				}
			}
		}

		//public List<TagDependency> GetTagDependencysByChildTagId(int id)
		//{
		//    using (var conn = Connection)
		//    {
		//        conn.Open();
		//        using (var cmd = conn.CreateCommand())
		//        {
		//            cmd.CommandText = @"
		//               SELECT pt.Id, pt.ChildTagId, pt.ParentTagId, t.Name 
		//                 FROM TagDependency pt
		//                      LEFT JOIN Tag t ON t.Id = pt.ParentTagId
		//                      LEFT JOIN Note p ON p.id= pt.ChildTagId
		//                WHERE p.id = @id";

		//            cmd.Parameters.AddWithValue("@id", id);
		//            var reader = cmd.ExecuteReader();

		//            List<TagDependency> TagDependencys = new List<TagDependency> { };

		//            while (reader.Read())
		//            {
		//                TagDependency TagDependency = new TagDependency()
		//                {
		//                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
		//                    ChildTagId = reader.GetInt32(reader.GetOrdinal("ChildTagId")),
		//                    ParentTagId = reader.GetInt32(reader.GetOrdinal("ParentTagId")),
		//                    Tag = new Tag()
		//                    {
		//                        Name = reader.GetString(reader.GetOrdinal("Name")),
		//                    }
		//                };

		//                TagDependencys.Add(TagDependency);
		//            }

		//            reader.Close();

		//            return TagDependencys;
		//        }
		//    }
		//}

		public void Add(TagDependency TagDependency)
		{
			using (SqlConnection conn = Connection)
			{
				conn.Open();
				using (SqlCommand cmd = conn.CreateCommand())
				{
					cmd.CommandText = @"INSERT INTO TagDependency (ChildTagId, ParentTagId) OUTPUT INSERTED.ID
                                                     VALUES (@ChildTagId, @ParentTagId)";
					cmd.Parameters.AddWithValue("@ChildTagId", TagDependency.ChildTagId);
					cmd.Parameters.AddWithValue("@ParentTagId", TagDependency.ParentTagId);

					int id = (int)cmd.ExecuteScalar();

					TagDependency.Id = id;
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
					cmd.CommandText = @"DELETE FROM TagDependency WHERE id = @id";
					cmd.Parameters.AddWithValue("@id", id);

					cmd.ExecuteNonQuery();
				}
			}
		}
	}
}
