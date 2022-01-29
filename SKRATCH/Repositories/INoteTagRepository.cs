using SKRATCH.Models;

namespace SKRATCH.Repositories
{
	public interface INoteTagRepository
	{
		void Add(NoteTag NoteTag);
		void clearNoteTagsForNote(int NoteId);
		void Delete(int id);
		NoteTag GetById(int id);
	}
}