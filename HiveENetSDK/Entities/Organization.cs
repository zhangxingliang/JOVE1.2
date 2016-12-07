using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class Organization
    {
        public int id { get; set; }

        public int operate { get; set; }

        public string organizationCode { get;set; }

        public string organizationName { get; set; }

        public int parentId { get; set; }

        public string siteCode { get; set; }

        public string siteName { get; set; }
    }
}
