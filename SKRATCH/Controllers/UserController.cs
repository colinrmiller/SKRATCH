using Microsoft.AspNetCore.Mvc;
using System;
using SKRATCH.Models;
using SKRATCH.Repositories;

namespace SKRATCH.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _UserRepository;
        public UserController(IUserRepository UserRepository)
        {
            _UserRepository = UserRepository;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var users = _UserRepository.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{firebaseUserId}")]
        public IActionResult GetUser(string firebaseUserId)
        {
            var response = _UserRepository.GetByFirebaseUserId(firebaseUserId);
            return Ok(response);
        }

        [HttpGet("GetUserByUserId/{id}")]
        public IActionResult GetUserById(int id)
        {
            return Ok(_UserRepository.GetUserByUserId(id));
        }

        [HttpGet("DoesUserExist/{firebaseUserId}")]
        public IActionResult DoesUserExist(string firebaseUserId)
        {
            var User = _UserRepository.GetByFirebaseUserId(firebaseUserId);
            if (User == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpPost]
        public IActionResult Post(User User)
        {
            User.CreateDateTime = DateTime.Now;
            _UserRepository.Add(User);
            return CreatedAtAction(
                nameof(GetUser),
                new { firebaseUserId = User.FirebaseUserId },
                User);
        }
    }
}
