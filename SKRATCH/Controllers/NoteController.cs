using Microsoft.AspNetCore.Mvc;
using SKRATCH.Models;
using SKRATCH.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class NoteController : Controller
	{
		private readonly IUserRepository _UserRepository;
		private readonly INoteRepository _NoteRepository;

		public NoteController(IUserRepository UserRepository, INoteRepository NoteRepository)
		{
			_UserRepository = UserRepository;
			_NoteRepository = NoteRepository;
		}

		// GET (notes by user) 
		// Get (note)
		// Get (notes by Tag)
		// POST
		// PUT
		// DELETE

		// GET: api/<NoteController>?userId=1
		[HttpGet]
		public IActionResult Index(int userId)
		{
			// TODO get current user Id
			userId = 1;

			var notes = _NoteRepository.GetNotesByUserId(1);
			return Ok(notes);
		}

		// GET api/<NoteController>/5
		[HttpGet("{id}")]
		public IActionResult Get(int id)
		{
			// TODO only corresponding user should be allowed access

			var note = _NoteRepository.GetNoteById(id);
			return Ok(note);
		}


		[HttpGet("NotesByTagName/{tagName}")]
		public IActionResult NotesByTagName(string tagName, int userId)
		{
			var notes = _NoteRepository.GetNotesByTagName(tagName, userId);
			return Ok(notes);
		}
		
		[HttpGet("upcoming")]
		public IActionResult NotesByTagName(int userId)
		{
			var notes = _NoteRepository.GetUpcomingNotesByUserId(userId);
			return Ok(notes);
		}

		[HttpPost]
		public IActionResult Post(Note note)
		{
			note.DateAdded = DateTime.Now;
			note.DateUpdated = DateTime.Now;
			int noteId = _NoteRepository.Add(note);
			return Ok(noteId);
		}

		// PUT api/<NoteController>/5
		[HttpPut("{id}")]
		public IActionResult Put(int id, Note note)
		{
			if (id != note.Id)
			{
				return BadRequest();
			}

			note.DateUpdated = DateTime.Now;
			_NoteRepository.Update(note);
			return NoContent();
		}

		// DELETE api/<NoteController>/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			_NoteRepository.Delete(id);
		}
	}
}
