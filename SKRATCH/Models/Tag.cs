using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Models
{
	public class Tag
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public int UserId { get; set; } 
		public User User { get; set; }
		public bool IsUserCreated { get; set; }
		public bool IsStatus{ get; set; }
		public string Type { get; set; }
		public string MetaData { get; set; }
	}
}
