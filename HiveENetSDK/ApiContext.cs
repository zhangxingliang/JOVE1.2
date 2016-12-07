using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HiveENetSDK.Services;

namespace HiveENetSDK
{
    public class ApiContext
    {
        public String ApiUrl { get; private set; }

        public String RenderApiUrl { get; private set; }

        public String PrivateToken { get; private set; }

        public String SiteCode { get; private set; }

        public ApiClient Client { get; protected set; }

        public CmService FolderService { get; protected set; }

        public AuthService AuthService { get; protected set; }

        public ApiContext(string apiUrl, string renderApiUrl, string privateToken = "", string siteCode = "")
        {
            Uri u = new Uri(apiUrl);

            apiUrl = u.ToString();
            if (apiUrl.EndsWith("/"))
            {
                apiUrl = apiUrl.Substring(0, apiUrl.Length - 1);
            }

            Uri r = new Uri(renderApiUrl);

            renderApiUrl = r.ToString();
            if (renderApiUrl.EndsWith("/"))
            {
                renderApiUrl = renderApiUrl.Substring(0, renderApiUrl.Length - 1);
            }
            ApiUrl = apiUrl;

            RenderApiUrl = renderApiUrl;
            if (!String.IsNullOrEmpty(privateToken)) PrivateToken = privateToken;
            if (!String.IsNullOrEmpty(siteCode)) SiteCode = siteCode;

            Client = new ApiClient();

            FolderService = new CmService(this);
            AuthService = new AuthService(this);
          
        }


         
    }
}
