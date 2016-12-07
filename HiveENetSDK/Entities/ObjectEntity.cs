using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class ObjectEntity
    {
        public string iconfilename { get; set; }

        public string id { get; set; }

        public string guid { get; set; }

        public string name { get; set; }

        public int type { get; set; }

        public int subtype { get; set; }

        public int foldid { get; set; }

        public string folderpath { get; set; }

        public string keyword { get; set; }

        public int iconframe { get; set; }

        public string creator { get; set; }

        public string modifier { get; set; }

        public DateTime createdate { get; set; }

        public DateTime modifydate { get; set; }

        public string accessdate { get; set; }

        public string deletedate { get; set; }

        public int status { get; set; }

        public int usedflag { get; set; }

        public int lockflag { get; set; }

        public string journallist { get; set; }

        public int markin { get; set; }

        public int markout { get; set; }

        public string mosid { get; set; }

        public string deviceid { get; set; }

        public string editterminal { get; set; }

        public string note { get; set; }

        public string rights { get; set; }

        public string cdid { get; set; }

        public EntityItem item { get; set; }
    }
}
