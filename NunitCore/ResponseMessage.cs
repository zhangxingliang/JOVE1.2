using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NunitCore
{
    public class ResponseMessage
    {
        public ResponseMessage() { }

        [JsonProperty(PropertyName = "code", Order = 0)]
        public string Code { get; set; }
        [JsonProperty(PropertyName = "msg", Order = 1)]
        public string Message { get; set; }
    }
}
