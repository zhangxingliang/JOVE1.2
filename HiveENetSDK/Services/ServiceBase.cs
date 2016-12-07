using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK.Services
{
    public abstract class ServiceBase
    {
        public ApiContext ApiContext { get; protected set; }

        public ServiceBase(ApiContext context)
        {
            this.ApiContext = context;
        }
    }
}
