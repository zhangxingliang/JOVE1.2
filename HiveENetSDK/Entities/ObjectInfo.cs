using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class ObjectInfo
    {
        public ObjectEntity entity { get; set; }

        public FileFormatInfo fileformatinfo { get; set; }

        public List<StreamMedia> streammedia { get; set; }
    }
}
