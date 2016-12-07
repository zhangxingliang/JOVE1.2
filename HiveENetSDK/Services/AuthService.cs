using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sobey.Core.Log;

namespace HiveENetSDK.Services
{
    public class AuthService : ServiceBase
    {
        protected ILogger Logger = LoggerManager.GetLogger("CmService");
        public AuthService(ApiContext context)
            : base(context)
        {
        }
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<UserInfo> Login(LoginRequst requst)
        {
            string url = ApiContext.ApiUrl + "/basic/account/login";
            return ApiContext.Client.Post<ResponseMessage<UserInfo>>(url, requst, "POST", null);
        }

        /// <summary>
        /// 登出
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<UserStorageInfo> GetUserStorage(string usertoken, string loginname)
        {
            ResponseMessage<UserStorageInfo> r = new ResponseMessage<UserStorageInfo>();
            string url = ApiContext.ApiUrl + "/basic/account/getuserstoragebyname";
            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            q.Add("loginName", loginname);
            r = ApiContext.Client.Get<ResponseMessage<UserStorageInfo>>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url, r.Code, r.Msg);
            return r;
        }

        /// <summary>
        /// 心跳
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage CheckLogin(string loginInfoID)
        {
            ResponseMessage r = new ResponseMessage();
            string url = ApiContext.ApiUrl + "/basic/account/heatbeat";
            NameValueCollection q = new NameValueCollection();
            q.Add("loginInfoID", loginInfoID);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url, r.Code, r.Msg);
            r = ApiContext.Client.Get<ResponseMessage>(url, q);
            return r;
        }


        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<UserInfo> GetUserInfo(string usertoken)
        {
            ResponseMessage<UserInfo> r = new ResponseMessage<UserInfo>();
            string url = ApiContext.ApiUrl + "/basic/account/getcurrentuserinfo";//接口参数变更

            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            r = ApiContext.Client.Get<ResponseMessage<UserInfo>>(url, q);
          //  Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url, r.Code, r.Msg);
            return r;
        }
    }
}
