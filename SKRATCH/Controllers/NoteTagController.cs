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
	public class NoteTagController : Controller
	{
		private readonly INoteTagRepository _NoteTagRepository;

		public NoteTagController(INoteTagRepository NoteTagRepository)
		{
			_NoteTagRepository = NoteTagRepository;
		}

		[HttpPost]
		public IActionResult Post(NoteTag noteTag)
		{
			_NoteTagRepository.Add(noteTag);
			return NoContent();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			_NoteTagRepository.Delete(id);
		}

		[HttpDelete("ClearNote/{id}")]
		public void ClearNoteTags(int id)
		{
			_NoteTagRepository.clearNoteTagsForNote(id);
		}

	}
}
