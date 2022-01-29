using System.Collections.Generic;
using SKRATCH.Models;

namespace SKRATCH.Repositories
{
    public interface IUserRepository
    {
        void Add(User User);
        List<User> GetAllUsers();
        User GetByFirebaseUserId(string firebaseUserId);
        User GetUserByUserId(int userId);
    }
}