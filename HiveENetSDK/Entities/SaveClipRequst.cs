using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class SaveClipRequst
    {
    /// <summary>
    /// 
    /// </summary>
        public long version { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string type { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public ClipObject @object { get; set; }

    }
}
