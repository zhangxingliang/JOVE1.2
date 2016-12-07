using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class Resource
    {
        public int IconFrame { get; set; }
        public string CreateDate { get; set; }
        public List<EditedClipFile> Files { get; set; }
        public List<Mark> Markers { get; set; }
        public string __id { get; set; }
        public string ObjectID { get; set; }
        public string ObjectGUID { get; set; }
        public int ObjectType { get; set; }
        public int SubType { get; set; }
        public int FolderID { get; set; }
        public string ObjectName { get; set; }
        public string CreatorID { get; set; }
        public string IconFileName { get; set; }
        public long TrimIn { get; set; }
        public long TrimOut { get; set; }
        public long Length { get; set; }
    }
}
