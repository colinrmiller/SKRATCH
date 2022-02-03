using SKRATCH.Models;
using System.Collections.Generic;

namespace SKRATCH.Repositories
{
	public interface ITagRepository
	{
		void AddTagToNote(NoteTag noteTag);
		int Add(Tag tag);
		void Delete(int id);
		List<Tag> GetAllUserTags(int userId);
		Tag GetTagById(int id);
		List<Tag> GetTagsByNoteId(int id);
		void Update(Tag tag);
		List<Tag> GetAllUserTagsByType(int userId, string type);
		List<Tag> GetPriorityTags();
	}
}