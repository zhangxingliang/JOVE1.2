using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class EditorMediaJson
    {
        /// <summary>
        /// 
        /// </summary>
        public string id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public List<string> url { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double duration { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public List<Track> tracks { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double framerate
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public string sizes
        {
            get;
            set;
        }


        /// <summary>
        /// 
        /// </summary>
        public string videostandard
        {
            get;
            set;
        }
        /// <summary>
        /// 
        /// </summary>
        public List<MarkPoint> markPoints { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public List<Resource> resources { get; set; }
    }
}
