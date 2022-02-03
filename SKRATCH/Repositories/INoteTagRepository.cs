using SKRATCH.Models;

namespace SKRATCH.Repositories
{
	public interface INoteTagRepository
	{
		void Add(NoteTag NoteTag);
		void ClearNoteTag(NoteTag noteTag);
		void ClearNoteTagsForNote(int noteId);
		void Delete(int id);
		NoteTag GetById(int id);
	}
}