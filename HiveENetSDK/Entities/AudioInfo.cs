using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class AudioInfo
    {

        public int formatid { get; set; }

        public int fileformat { get; set; }

        public int mediatype { get; set; }

        public int channels { get; set; }

        public int samplesrate { get; set; }

        public int bitspersample { get; set; }
    }
}
