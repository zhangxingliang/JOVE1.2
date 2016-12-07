using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class TrackEvent
    {
        /// <summary>
        /// 
        /// </summary>
        public string id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string type { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public PopcornOptions popcornOptions { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public Clipdata clipdata { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool attach { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string plugin { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string track { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string name { get; set; }
    }
}
