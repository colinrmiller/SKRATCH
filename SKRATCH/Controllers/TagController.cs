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
	public class TagController : Controller
	{
		private readonly ITagRepository _TagRepository;
		private readonly IUserRepository _UserRepository;

		public TagController(IUserRepository UserRepository, ITagRepository TagRepository)
		{
			_UserRepository = UserRepository;
			_TagRepository = TagRepository;
		}

		// GET api/<TagController>/5
		[HttpGet("{id}")]
		public IActionResult Get(int id)
		{
			// TODO only corresponding user should be allowed access

			var note = _TagRepository.GetTagById(id);
			return Ok(note);
		}

		[HttpGet("TagByNoteId/{id}")]
		public IActionResult TagByNoteId(int id)
		{
			var notes = _TagRepository.GetTagsByNoteId(id);
			return Ok(notes);
		}

		// GET: api/<TagController>/TagsByUserId/1
		[HttpGet("TagsByUserId/{id}")]
		public IActionResult TagsByUserId(int id)
		{
			var notes = _TagRepository.GetAllUserTags(id);
			return Ok(notes);
		}

		// GET: api/<TagController>/TagsByUserId/1
		[HttpGet("TagsByUserIdByType/{id}")]
		public IActionResult TagsByUserIdByType(int id, string type)
		{
			var notes = _TagRepository.GetAllUserTagsByType(id, type);
			return Ok(notes);
		}
		
		// GET: api/<TagController>/TagsByUserId/1
		[HttpGet("priorities")]
		public IActionResult Priorities()
		{
			var notes = _TagRepository.GetPriorityTags();
			return Ok(notes);
		}



		[HttpPost]
		public IActionResult Post(Tag tag)
		{
			int insertedId = _TagRepository.Add(tag);
			return Ok(insertedId);
		}

		// PUT api/<TagController>/5
		[HttpPut("{id}")]
		public IActionResult Put(int id, Tag note)
		{
			if (id != note.Id)
			{
				return BadRequest();
			}

			_TagRepository.Update(note);
			return NoContent();
		}

		// DELETE api/<TagController>/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			_TagRepository.Delete(id);
		}
	}
}
