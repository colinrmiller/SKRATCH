using SKRATCH.Models;
using System.Collections.Generic;

namespace SKRATCH.Repositories
{
	public interface INoteRepository
	{
		void Add(Note Note);
		void Delete(int id);
		List<Note> GetNoteById(int id);
		List<Note> GetNotesByTagId(int id);
		List<Note> GetNotesByUserId(int id);
		void Update(Note Note);
	}
}