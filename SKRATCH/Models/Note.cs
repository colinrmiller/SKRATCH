using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SKRATCH.Models
{
    public class Note
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime DateAdded { get; set; }
        public DateTime DateUpdated { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public bool IsStaged { get; set; }

        public string MetaData { get; set; }

        public List<Tag> Tags { get; internal set; }
		public DateTime? DateStart { get; internal set; }
		public DateTime? DateEnd { get; internal set; }
	}
}
