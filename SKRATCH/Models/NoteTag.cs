using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Models
{
	public class NoteTag
	{
		public int Id { get; set; }
		public int TagId { get; set; }
		public Tag Tag { get; set; }
		public int NoteId { get; set; }
		public Note Note { get; set; }

	}
}
