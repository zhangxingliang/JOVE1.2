using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class VideoInfo
    {
        public int formatID { get; set; }

        public int fileformat { get; set; }

        public int mediatype { get; set; }

        public int imagewidth { get; set; }

        public int imagehight { get; set; }

        public int frameRate { get; set; }

        public int bitsperpixel { get; set; }

        public int compression { get; set; }

        public int datarate { get; set; }

        public int scanmode { get; set; }

        public int gopsize { get; set; }

        public int bframecount { get; set; }

        public int pframecount { get; set; }

        public int bitcount { get; set; }
    }
}
