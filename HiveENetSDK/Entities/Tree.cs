using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class Tree
    {
        public string guid { get; set; }

        public string name { get; set; }

        public int parentcount { get; set; }

        public string path { get; set; }

        public string fatherGuid { get; set; }

        public DateTime createdate { get; set; }

        public List<Tree> nodes { get; set; }
    }
}
