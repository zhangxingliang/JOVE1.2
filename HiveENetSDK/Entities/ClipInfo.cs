using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class ClipInfo
    {
        public string iconfilename { get; set; }

        public string id { get; set; }

        public string guid { get;set; }

        public string name { get; set; }

        public int type { get; set; }

        public int typetemp { get; set; }

        public string path { get; set; }

        public int subtype { get; set; }

        public int iconframe { get; set; }

        public string folderpath { get; set; }

        public ulong duration { get; set; }

        public DateTime createdate { get; set; }

        public string filestatus { get; set; }

        public string capturestatus { get; set; }

        public string videostandard { get; set; }

        public string dbestreamchannel { get; set; }

        public bool hasItem { get; set; }
    }
}
