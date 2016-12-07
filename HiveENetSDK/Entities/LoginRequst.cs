using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class LoginRequst
    {
        public string LOGINNAME { get; set; }

        public string LOGINPWD { get; set; }

        public string LOGINSUBSYSTEM { get; set; }

        //20160401 add by wfg ,because of nunit test failed 
        public string LOGINIP { get; set; }
    }
}
