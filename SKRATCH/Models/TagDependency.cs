using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Models
{
	public class TagDependency
	{
		public int Id { get; set; }
		public int ParentTagId { get; set; }
		public Tag ParentTag { get; set; }
		public int ChildTagId { get; set; }
		public Tag ChildTag { get; set; }
	}
}
