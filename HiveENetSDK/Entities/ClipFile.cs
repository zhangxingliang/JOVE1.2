using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class ClipFile
    {
        public int qualitytype { get; set; }

        public int clipclass { get; set; }

        public long clipin { get; set; }

        public long clipout { get; set; }

        public long filein { get; set; }

        public long fileout { get; set; }

        public ulong length { get; set; }

        public long mediachannel { get; set; }

        public string filename { get; set; }

        public ulong filesize { get; set; }

        public int filestatus { get; set; }

        public long formatid { get; set; }

        public DateTime createtime { get; set; }
    }
}
