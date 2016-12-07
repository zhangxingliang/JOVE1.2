using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class UserInfo
    {
        public int id { get; set; }

        public string loginName { get; set; }

        public string nickName { get; set; }

        public string userCode { get; set; }

        public DateTime loginTime { get; set; }

        public int type { get; set; }

        public DateTime newrefreshtime { get; set; }

        public DateTime pwdChangeTime { get; set; }

        public List<Organization> roles { get; set; }

    }
}
