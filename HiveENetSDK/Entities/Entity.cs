using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class Entity
    {
        /// <summary>
        /// 
        /// </summary>
        public string id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string guid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string type { get; set; }

        public string archivestatus { get; set; }

        public string lowgroupstatus { get; set; }

        public string highgroupstatus { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int? subtype { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int? folderid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string folderpath { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string cdid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string keyword { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int? iconframe { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string iconfilename { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string creator { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string modifier { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string menber { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string Delater { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string createdate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string modifydate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string accessdate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string deletedate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string column { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string status { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string usedflag { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string lockflag { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string rights { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string journallist { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string note { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string editterminal { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string modifyterminal { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string deviceid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string markin { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string markout { get; set; }


        public int deleteflag { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string colorspace { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public Item Item { get; set; }
    }
}
