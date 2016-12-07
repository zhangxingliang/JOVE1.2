using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class RenderPEFRequest
    {
        public EditorMediaJson json { get; set; }

        public string title { get; set; }

        public string pefFilePath { get; set; }

        public string folderPath { get; set; }
    }
}
