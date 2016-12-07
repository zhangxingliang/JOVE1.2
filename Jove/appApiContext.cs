using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HiveENetSDK;

namespace Jove
{
    public class AppContext : ApiContext
    {
        public AppContext(string url, string renderUrl)
            : base(url, renderUrl)
        {
            appContext = this;
        }

        private static AppContext appContext = null;
        public static AppContext Current
        {
            get
            {
                return appContext;
            }
        }
    }
}
