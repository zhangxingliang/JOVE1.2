using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class EditedObjectInfo
    {
        public string ObjectID { get; set; }

        public string ObjectGUID { get; set; }

        public string ObjectType { get; set; }

        public string SubType { get; set; }

        public string FolderID { get; set; }

        public string ObjectName { get; set; }

        public string IconFrame { get; set; }

        public string IconFileName { get; set; }

        public string Length { get; set; }

        public string TrimIn { get; set; }

        public string TrimOut { get; set; }

        public string CreatorID { get; set; }

        public string CreateDate { get; set; }

        public List<EditedClipFile> Files { get; set; }

        public List<Mark> Markers { get; set; }

        public string VideoStandard { get; set; }

        public string __id { get; set; }
    }
}
