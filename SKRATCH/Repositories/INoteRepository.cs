using SKRATCH.Models;
using System.Collections.Generic;

namespace SKRATCH.Repositories
{
	public interface INoteRepository
	{
		int Add(Note Note);
		void Delete(int id);
		Note GetNoteById(int id);
		List<Note> GetNotesByTagId(int id);
		List<Note> GetNotesByTagName(string tagName, int userId);
		List<Note> GetNotesByUserId(int id);
		void Update(Note Note);
		List<Note> GetUpcomingNotesByUserId(int userId);
	}
}