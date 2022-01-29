using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using SKRATCH.Models;
using SKRATCH.Utils;

namespace SKRATCH.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IConfiguration configuration) : base(configuration) { }

        public List<User> GetAllUsers()
        {
            {
                using (var conn = Connection)
                {
                    conn.Open();
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = @"
                      Select * From [User]";


                        var users = new List<User>();

                        var reader = cmd.ExecuteReader();
                        while (reader.Read())
                        {
                            int id = reader.GetInt32(reader.GetOrdinal("Id"));
                            string fireId = reader.GetString(reader.GetOrdinal("firebaseUserId"));
                            string display = reader.GetString(reader.GetOrdinal("displayName"));
                            string fName = reader.GetString(reader.GetOrdinal("firstName"));
                            string lName = reader.GetString(reader.GetOrdinal("lastName"));
                            string email = reader.GetString(reader.GetOrdinal("email"));
                            DateTime cDT = reader.GetDateTime(reader.GetOrdinal("createDateTime"));
                            string imgLoc = reader.GetString(reader.GetOrdinal("imageLocation"));
                            int UTI = reader.GetInt32(reader.GetOrdinal("userTypeId"));

                            users.Add(new User()
                            {
                                Id = id,
                                DisplayName = display,
                                FirstName = fName,
                                LastName = lName,
                                Email = email,
                                CreateDateTime = cDT,
                            });
                        }

                        reader.Close();

                        return users;
                    }
                }
            }
        }

        public User GetByFirebaseUserId(string firebaseUserId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT up.Id, Up.FirebaseUserId, up.FirstName, up.LastName, up.DisplayName, 
                               up.Email, up.CreateDateTime
                          From [User] up
                         WHERE FirebaseUserId = @FirebaseUserId";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    User User = null;

                    var reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        User = new User()
                        {
                            Id = DbUtils.GetInt(reader, "Id"),
                            FirebaseUserId = DbUtils.GetString(reader, "FirebaseUserId"),
                            FirstName = DbUtils.GetString(reader, "FirstName"),
                            LastName = DbUtils.GetString(reader, "LastName"),
                            DisplayName = DbUtils.GetString(reader, "DisplayName"),
                            Email = DbUtils.GetString(reader, "Email"),
                            CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime"),
                        };
                    }
                    reader.Close();

                    return User;
                }
            }
        }

        public User GetUserByUserId(int userId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT up.Id, Up.FirebaseUserId, up.FirstName, up.LastName, up.DisplayName, 
                               up.Email, up.CreateDateTime, up.ImageLocation, up.UserTypeId,
                               ut.Name AS UserTypeName
                          From [User] up
                               LEFT JOIN UserType ut on up.UserTypeId = ut.Id
                         WHERE up.id = @userId";

                    DbUtils.AddParameter(cmd, "@userId", userId);

                    User User = null;

                    var reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        User = new User()
                        {
                            Id = DbUtils.GetInt(reader, "Id"),
                            FirstName = DbUtils.GetString(reader, "FirstName"),
                            LastName = DbUtils.GetString(reader, "LastName"),
                            DisplayName = DbUtils.GetString(reader, "DisplayName"),
                            Email = DbUtils.GetString(reader, "Email"),
                            CreateDateTime = DbUtils.GetDateTime(reader, "CreateDateTime"),
                        };
                    }
                    reader.Close();

                    return User;
                }
            }
        }

        public void Add(User User)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"INSERT INTO User (FirebaseUserId, FirstName, LastName, DisplayName, 
                                                                 Email, CreateDateTime, ImageLocation, UserTypeId)
                                        OUTPUT INSERTED.ID
                                        VALUES (@FirebaseUserId, @FirstName, @LastName, @DisplayName, 
                                                @Email, @CreateDateTime, @ImageLocation, @UserTypeId)";
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", User.FirebaseUserId);
                    DbUtils.AddParameter(cmd, "@FirstName", User.FirstName);
                    DbUtils.AddParameter(cmd, "@LastName", User.LastName);
                    DbUtils.AddParameter(cmd, "@DisplayName", User.DisplayName);
                    DbUtils.AddParameter(cmd, "@Email", User.Email);
                    DbUtils.AddParameter(cmd, "@CreateDateTime", User.CreateDateTime);

                    User.Id = (int)cmd.ExecuteScalar();
                }
            }
        }

    }
}