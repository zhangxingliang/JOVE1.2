using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Net;
namespace NunitCore
{
    public class ApiClient
    {

        public ApiClient()
        {
        }

        public static TResponse Post<TResponse>(string url, object body, string method, NameValueCollection queryString)
            where TResponse : ResponseMessage, new()
        {
            TResponse response = null;
            try
            {
               Trace.TraceInformation(String.Format("请求：{0}", url));

                WebClient client = new WebClient();
                if (queryString != null)
                {
                    foreach (string key in queryString.AllKeys)
                    {

                        client.QueryString.Add(key, queryString[key]);
                    }
                }
                if (String.IsNullOrEmpty(method))
                {
                    method = "POST";
                }

                string rJson = String.Empty;
                byte[] strData;
                if (body is string)
                {
                    Trace.TraceInformation(String.Format("POST请求数据:{0}", body.ToString()));
                    strData = Encoding.UTF8.GetBytes(body.ToString());
                }

                else
                {
                    string json = SerializerHelper.JsonSerialize(body);
                    Trace.TraceInformation(String.Format("POST请求数据:{0}", json));
                    strData = Encoding.UTF8.GetBytes(json);
                }

                byte[] rData = client.UploadData(url, method, strData);
                rJson = Encoding.UTF8.GetString(rData);


                Trace.TraceInformation(String.Format("应答：\r\n{0}", rJson));

                response = SerializerHelper.JsonDeserialize<TResponse>(rJson);


                return response;
            }
            catch (WebException e)
            {
                TResponse r = new TResponse();
                r.Code = e.Status.ToString();
                r.Message = e.Message;
                Trace.TraceError(String.Format("请求异常：\r\n{0}", e.ToString()));
                return r;
            }
            catch (Exception e)
            {
                TResponse r = new TResponse();
                r.Code = "500";
                r.Message = e.Message;
                Trace.TraceError(String.Format("请求异常：\r\n{0}", e.ToString()));
                return r;
            }

            return response;
        }

 

        public static TResponse Get<TResponse>(string url, NameValueCollection queryString)
                    where TResponse : ResponseMessage, new()
        {
            TResponse response = null;
            WebClient client = null;
            try
            {
                Trace.TraceInformation(String.Format("请求：{0}", url));
                client = new WebClient();
                if (queryString != null)
                {

                    foreach (string key in queryString.AllKeys)
                    {

                        client.QueryString.Add(key, queryString[key]);
                    }
                }



                byte[] rData = client.DownloadData(url);

                string rJson = Encoding.UTF8.GetString(rData);
                Trace.TraceInformation(String.Format("应答：\r\n{0}", rJson));
                response = SerializerHelper.JsonDeserialize<TResponse>(rJson);

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
                r.Code = e.Status.ToString();
                r.Message = e.Message;
                Trace.TraceError(String.Format("请求异常：\r\n{0}", e.ToString()));
                return r;
            }
            catch (Exception e)
            {
                if (client != null)
                {
                    client.Dispose();
                }
                TResponse r = new TResponse();
                r.Code = "500";
                r.Message = e.Message;
                Trace.TraceError(String.Format("请求异常：\r\n{0}", e.ToString()));
                return r;
            }

            return response;
        }
    }
}
