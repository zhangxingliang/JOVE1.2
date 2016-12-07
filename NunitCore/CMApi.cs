using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using Newtonsoft.Json;

namespace NunitCore
{
    public class CMApi
    {

        private string apiUrl;

        public string ApiUrl
        {
            get
            {
                if (!String.IsNullOrEmpty(apiUrl))
                {
                    if (apiUrl.EndsWith("/"))
                    {
                        apiUrl = apiUrl.Substring(0, apiUrl.Length - 1);
                    }
                }
                return apiUrl;

            }
            set { apiUrl = value; }
        }

        string userToken = String.Empty;

        public string UserToken
        {
            get
            {
                if (String.IsNullOrEmpty(userToken))
                {
                    Login();
                }

                return userToken;
            }
            set { userToken = value; }
        }
        public static CMApi DefaultInstance = new CMApi();
        private const String LoginUrl = "/Account/login";
        private const String CreateEmptyClipUrl = "/Entity/CreateEmptyClip";
        private const String DeleteObjectsUrl = "/Entity/DeleteObjects";
        private const String ReNameObjectUrl = "/Entity/ReNameObject";
        private const String GetClipMetadataUrl = "/Entity/GetObjectInfo";
        private const string GetUserInfoByUserCodeUrl = "/User/GetUserInfoByUserCode";
        private const string GetMosIDFromClipGUIDUrl = "/Entity/GetMosIDFromClipGUID";

        public CMApi()
        {
           
        }

        public bool Login()
        {
            string result = string.Empty;
            try
            {
                string url = ApiUrl + LoginUrl;

                SmmUserlogininfo logininfo = new SmmUserlogininfo()
                {
                    loginname = "admin",
                    loginpwd = "21232f297a57a5a743894a0e4a801fc3",
                    loginsubsystem = Guid.NewGuid().ToString(),
                    loginip = Guid.NewGuid().ToString()
                };

                ResponseMessage<SmmUserlogininfo> response = ApiClient.Post<ResponseMessage<SmmUserlogininfo>>(url, logininfo, "POST", null);

                if (!String.IsNullOrEmpty(response.Extension.usertoken))
                {
                    this.UserToken = response.Extension.usertoken;
                    return true;
                }

            }
            catch (Exception e)
            {
                Trace.TraceError(String.Format("CMApi异常：\r\n{0}", e.ToString()));
                return false;
            }
            return false;

        }



    }
    public class SmmUserlogininfo
    {
        public SmmUserlogininfo() { }

        public int logininfoid { get; set; }
        public string loginip { get; set; }
        public string loginname { get; set; }
        public string loginpwd { get; set; }
        public string loginsubsystem { get; set; }
        public DateTime logintime { get; set; }
        public DateTime newrefreshtime { get; set; }
        public string pwdchangetime { get; set; }
        public string usercode { get; set; }
        public int userid { get; set; }
        public string usertoken { get; set; }
        public string windowname { get; set; }
    }
    public class ResponseMessage<TEx> : ResponseMessage
    {
        public ResponseMessage() { }

        [JsonProperty(PropertyName = "ext", Order = 2)]
        public TEx Extension { get; set; }
    }
}
