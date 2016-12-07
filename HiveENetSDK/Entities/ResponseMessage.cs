using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace HiveENetSDK
{
    public class ResponseMessage
    {
        [JsonProperty(PropertyName = "code", Order = 0)]
        public string Code { get; set; }
        [JsonProperty(PropertyName = "msg", Order = 1)]
        public string Msg { get; set; }
    }
    public class ResponseMessage<TEx> : ResponseMessage
        where TEx : class
    {
        [JsonProperty(PropertyName = "ext", Order = 2)]
        public TEx Ext { get; set; }
    }
}
