using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK   
{
    public class EditedClipFile
    {
        public string Length { get; set; }
        public string MediaChannel { get; set; }
        public string FileSize { get; set; }
        public string FormatID { get; set; }
        public string ClipID { get; set; }
        public int QualityType { get; set; }
        public int ClipClass { get; set; }
        public string FilePath { get; set; }
        public long ClipIn { get; set; }
        public long ClipOut { get; set; }
        public long FileIn { get; set; }
        public long FileOut { get; set; }
        public string FileFormat { get; set; }

    }
}
