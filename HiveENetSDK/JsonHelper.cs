using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace HiveENetSDK
{
    public static class JsonHelper
    {
        public static string ToJson(object obj)
        {
            JsonSerializerSettings jsetting = new JsonSerializerSettings();
            jsetting.NullValueHandling = NullValueHandling.Ignore;
            if (obj == null)
                return "";

            return JsonConvert.SerializeObject(obj, jsetting);
        }

        public static object ToObject(string json, Type type)
        {
           
            if (String.IsNullOrEmpty(json))
            {
                return null;
            }

            return JsonConvert.DeserializeObject(json, type);
        }

        public static TObject ToObject<TObject>(string json)
        {
            return (TObject)ToObject(json, typeof(TObject));
        }
    }
}
