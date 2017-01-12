using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using Sobey.Core.Log;
using System.Reflection;

namespace HiveENetSDK
{
    public class ApiClient
    {
        ILogger Logger = LoggerManager.GetLogger("ApiClient");
        public ApiClient()
        {
        }

        public TResponse Post<TResponse>(string url, object body, string method, NameValueCollection queryString)
            where TResponse : class, new()
        {
            TResponse response = null;
            try
            {
                //Logger.Debug("请求：{0}", url);
                string json = JsonHelper.ToJson(body);
                string siteCode = "S1";

                StringBuilder sb = new StringBuilder();

                WebClient client = new WebClient();
                if (queryString != null)
                {
                    foreach (string key in queryString.AllKeys)
                    {
                        sb.AppendFormat("&{0}={1}", key, queryString[key]);

                        if (key.ToUpper() == "SITECODE" && !String.IsNullOrEmpty(queryString[key]))
                        {
                            siteCode = queryString[key];
                            continue;
                        }
                        client.QueryString.Add(key, queryString[key]);
                    }
                }

                Logger.Debug("请求：{0}?{1}", url, sb.ToString());

                if (String.IsNullOrEmpty(method))
                {
                    method = "POST";
                }
                client.Headers.Add("sobeyhive-http-system", "JOVE");
                client.Headers.Add("sobeyhive-http-site", siteCode);
                client.Headers.Add("sobeyhive-http-tool", "JOVE");
                byte[] strData = Encoding.UTF8.GetBytes(json);

                byte[] rData = client.UploadData(url, method, strData);

                string rJson = Encoding.UTF8.GetString(rData);

                Logger.Debug("应答：\r\n{0}", rJson);

                response = JsonHelper.ToObject<TResponse>(rJson);


                return response;
            }
            catch (WebException e)
            {
                TResponse r = new TResponse();
                Logger.Error("请求异常：\r\n{0}", e.ToString());
                return r;
            }
            catch (Exception e)
            {
                TResponse r = new TResponse();
                Logger.Error("请求异常：\r\n{0}", e.ToString());
                return r;
            }

            return response;
        }

        public TResponse Get<TResponse>(string url, NameValueCollection queryString)
                    where TResponse : class, new()
        {
            TResponse response = null;
            WebClient client = null;
            try
            {
                //Logger.Debug("请求：{0}", url);
                client = new WebClient();
                string siteCode = "S1";

                StringBuilder sb = new StringBuilder();

                if (queryString != null)
                {

                    foreach (string key in queryString.AllKeys)
                    {
                        sb.AppendFormat("&{0}={1}", key, queryString[key]);

                        if (key.ToUpper() == "SITECODE" && !String.IsNullOrEmpty(queryString[key]))
                        {
                            siteCode = queryString[key];
                            continue;
                        }
                        client.QueryString.Add(key, queryString[key]);
                    }
                }

                Logger.Debug("请求：{0}?{1}", url, sb.ToString());


                client.Headers.Add("sobeyhive-http-system", "JOVE");
                client.Headers.Add("sobeyhive-http-site", siteCode);
                client.Headers.Add("sobeyhive-http-tool", "JOVE");
                byte[] rData = client.DownloadData(url);

                string rJson = Encoding.UTF8.GetString(rData);
                Logger.Debug("应答：\r\n{0}", rJson);
                response = JsonHelper.ToObject<TResponse>(rJson);

                client.Dispose();
                return response;
            }
            catch (WebException e)
            {
                if (client != null)
                {
                    client.Dispose();
                }
                TResponse r = new TResponse();
                Logger.Error("请求异常：\r\n{0}", e.ToString());
                return r;
            }
            catch (Exception e)
            {
                if (client != null)
                {
                    client.Dispose();
                }
                TResponse r = new TResponse();
                Logger.Error("请求异常：\r\n{0}", e.ToString());
                return r;
            }

            return response;
        }
    }
}
