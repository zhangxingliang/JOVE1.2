using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class GetFolderRequst
    {
        public string usertoken { get; set; }

        public string path { get; set; }

        public string guid { get; set; }

        public int parentcount { get; set; }
    }
}
