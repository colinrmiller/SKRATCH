using Microsoft.AspNetCore.Mvc;
using SKRATCH.Models;
using SKRATCH.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Controllers
{
	public class TagController : Controller
	{
		private readonly ITagRepository _TagRepository;
		private readonly IUserRepository _UserRepository;

		public TagController(IUserRepository UserRepository, ITagRepository TagRepository)
		{
			_UserRepository = UserRepository;
			_TagRepository = TagRepository;
		}

		// GET: api/<TagController>?userId=1
		[HttpGet]
		public IActionResult Index(int userId)
		{

			var notes = _TagRepository.GetAllUserTags(userId);
			return Ok(notes);
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

		[HttpPost]
		public IActionResult Post(Tag note)
		{
			_TagRepository.Add(note);
			return NoContent();
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
