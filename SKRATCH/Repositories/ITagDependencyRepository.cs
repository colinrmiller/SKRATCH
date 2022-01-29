using SKRATCH.Models;

namespace SKRATCH.Repositories
{
	public interface ITagDependencyRepository
	{
		void Add(TagDependency TagDependency);
		void Delete(int id);
		TagDependency GetById(int id);
	}
}