using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml.Serialization;

namespace Jove
{

    public class config
    {
        private static string serverMapPath;
        static config()
        {
            try
            {
                String[] files = Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "global_*.log", SearchOption.TopDirectoryOnly);
                foreach (var file in files)
                {
                    File.Delete(file);
                }
            }
            catch (Exception)
            {

            }
        }

        public static void WriteLog(string msg)
        {
            File.AppendAllText(Path.Combine(serverMapPath, string.Format("global_{0}.log", DateTime.Now.ToString("yyyyMMdd"))), DateTime.Now.ToString("yyyy MM dd HH:mm:ss.fff") + "\t\t" + msg + "\n");
        }
        // Methods
        public static config Get(string path)
        {
            serverMapPath = path;

            config conf = null;

            try
            {
                string str;

                if ((Environment.OSVersion.Platform == PlatformID.Unix) || (Environment.OSVersion.Platform == PlatformID.MacOSX))
                {
                    str = "/ipconf.xml";
                }
                else
                {
                    str = string.Format(@"{0}\ipconf.xml", path);
                }

                string s = File.ReadAllText(str);
                WriteLog(s);
                XmlSerializer serializer = new XmlSerializer(typeof(config));
                conf = (config)serializer.Deserialize(new StringReader(s));

                conf.CMWEBPORT = conf.CMWEBPORT == 0 ? 9021 : conf.CMWEBPORT;
                conf.PREVIEWPORT = conf.PREVIEWPORT == 0 ? 86 : conf.PREVIEWPORT;
                conf.NEBULAPORT = conf.NEBULAPORT == 0 ? 88 : conf.NEBULAPORT;
                conf.CMAPIPORT = conf.CMAPIPORT == 0 ? 9023 : conf.CMAPIPORT;
                conf.JOVEPORT = conf.JOVEPORT == 0 ? 9027 : conf.JOVEPORT;

                conf.FLHTTPPORT = conf.FLHTTPPORT == 0 ? 9033 : conf.FLHTTPPORT;
                conf.PLAYOUTPORT = conf.PLAYOUTPORT == 0 ? 9035 : conf.PLAYOUTPORT;
                conf.CMSERVERWINPORT = conf.CMSERVERWINPORT == 0 ? 9037 : conf.CMSERVERWINPORT;

                conf.SANGHASERVERPORT = conf.SANGHASERVERPORT == 0 ? 9041 : conf.SANGHASERVERPORT;
                conf.SANGHAWEBPORT = conf.SANGHAWEBPORT == 0 ? 9043 : conf.SANGHAWEBPORT;
                conf.OCTSPORT = conf.OCTSPORT == 0 ? 9045 : conf.OCTSPORT;

                conf.MOSGATEWAYNETPORT = conf.MOSGATEWAYNETPORT == 0 ? 10555 : conf.MOSGATEWAYNETPORT;

                conf.TMWebPort = conf.TMWebPort == 0 ? 9049 : conf.TMWebPort;

            }
            catch (Exception e)
            {
                WriteLog(e.ToString());
            }

            return conf;
        }
        public int TMWebPort { get; set; }
        // Properties
        public string ACTOR_NODES
        {
            get;
            set;
        }
        public string AKSERVER_IP
        {
            get;
            set;
        }
        public string DOMAIN_NAME
        {
            get;
            set;
        }
        public string HIVE_NODES
        {
            get;
            set;
        }
        public string LOCAL_HOSTNAME
        {
            get;
            set;
        }
        public string LOCAL_IP
        {
            get;
            set;
        }
        public string NEBULA_VIP
        {
            get;
            set;
        }

        public int CMAPIPORT
        {
            get;
            set;
        }
        public int CMWEBPORT
        {
            get;
            set;
        }
        public int JOVEPORT
        {
            get;
            set;
        }
        public int PLAYOUTPORT
        {
            get;
            set;
        }
        public int PREVIEWPORT
        {
            get;
            set;
        }

        public int NEBULAPORT
        {
            get;
            set;
        }
        /// <summary>
        /// CM SERVER WINDOWS的端口
        /// </summary>
        public int CMSERVERWINPORT
        {
            get;
            set;
        }
        /// <summary>
        /// oct服务的端口
        /// </summary>
        public int OCTSPORT
        {
            get;
            set;
        }
        /// <summary>
        /// 
        /// </summary>
        public int MOSGATEWAYNETPORT { get; set; }
        /// <summary>
        /// FL HTTP服务接口
        /// </summary>
        public int FLHTTPPORT { get; set; }
        /// <summary>
        /// 千网服务的端口
        /// </summary>
        public int SANGHASERVERPORT { get; set; }
        /// <summary>
        /// 千网TASK MONITOR WEB页面端口
        /// </summary>
        public int SANGHAWEBPORT { get; set; }
    }
    public class Input
    {
        public String system { get; set; }
        public String tool { get; set; }
        public String paramname { get; set; }
    }
    public class Output
    {
        public int code { get; set; }
        public Extention ext { get; set; }

    }
    public class Extention
    {
        public String paramname { get; set; }
        public String paramvalue { get; set; }
        public String paramdescription { get; set; }
    }
    public class JOVEConfig
    {

        private static config conf = null;

        public static void initConfig(String Path)
        {

            conf = config.Get(Path);
        }
        public static String ServiceAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/CMApi/api/", conf.NEBULA_VIP, conf.CMAPIPORT);
            }
        }
        public static String RegisterToOAAddress
        {
            get
            {
                return String.Format("http://{0}:{1}", conf.NEBULA_VIP, conf.PLAYOUTPORT);
            }
        }
        public static String PreviewAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/bucket-", conf.NEBULA_VIP, conf.PREVIEWPORT);
            }
        }
        public static String RoughCutAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/", conf.NEBULA_VIP, conf.JOVEPORT);
            }

        }
        public static String CMPriviewAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/ModulePage/webpreview.html", conf.DOMAIN_NAME, conf.CMWEBPORT);
                //return String.Format("http://localhost:16006/ModulePage/webpreview.html");
            }
        }
        public static String GetFileFormatInfoAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/CMApi/api/", conf.NEBULA_VIP, conf.CMSERVERWINPORT);
                //return "http://172.16.172.17:8999/CMApi/api/";
            }
        }
        public static String GetOTCFileInfoAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/getotc?otcfilename=/otcfile/", conf.NEBULA_VIP, conf.OCTSPORT);
            }
        }
        public static String TaskMonitorWebAddress
        {
            get
            {
                return String.Format("http://{0}:{1}/", conf.NEBULA_VIP, conf.TMWebPort);
            }
        }
        private static String SocketServer;
        public static String GetSocketServer(String userToken = "", string siteCode = "S1")
        {
            //if (String.IsNullOrEmpty(SocketServer))
            {
                Output output = GetSysParamFormHive("SocketServer", userToken,siteCode, "WEBCM");
                if (output.code == 0 && output.ext != null)
                {
                    SocketServer = output.ext.paramvalue;
                }
            }
            return SocketServer;
        }

        private static String HivevideoStandard;

        public static String GetHivevideoStandard(String userToken = "", string siteCode = "S1")
        {
            //if (String.IsNullOrEmpty(HivevideoStandard))
            {
                Output output = GetSysParamFormHive("HivevideoStandard", userToken,siteCode, "JOVE");
                if (output.code == 0 && output.ext != null)
                {
                    HivevideoStandard = output.ext.paramvalue;
                }
            }

            return HivevideoStandard;
        }

        private static String InstalledFontCollection;

        public static String GetInstalledFontCollection(String userToken = "", string siteCode = "S1")
        {
            //if (String.IsNullOrEmpty(InstalledFontCollection))
            {
                Output output = GetSysParamFormHive("InstalledFontCollection", userToken,siteCode, "JOVE");
                if (output.code == 0 && output.ext != null)
                {
                    InstalledFontCollection = output.ext.paramvalue;
                }
            }

            return InstalledFontCollection;
        }

        private static string PreSNSPublishPath;

        public static string GetPreSNSPublishPath(String userToken = "")
        {
            if (String.IsNullOrEmpty(PreSNSPublishPath))
            {
                Output output = GetSysParamFormHive("PreSNSPublishPath", userToken, "MATERIALLIST");
                if (output.code == 0 && output.ext != null)
                {
                    PreSNSPublishPath = output.ext.paramvalue;
                }
            }

            return PreSNSPublishPath;
        }

        private static string SnsTransCodeType;

        public static string GetSnsTransCodeType(String userToken = "")
        {
            if (String.IsNullOrEmpty(SnsTransCodeType))
            {
                Output output = GetSysParamFormHive("snsTransCodeType", userToken, "JOVE");
                if (output.code == 0 && output.ext != null)
                {
                    SnsTransCodeType = output.ext.paramvalue;
                }
            }

            return SnsTransCodeType;
        }

        private static String ET_LANGUAGE;

        public static String GetET_LANGUAGE(String userToken = "", string siteCode = "S1")
        {
            //if (String.IsNullOrEmpty(ET_LANGUAGE))
            {
                Output output = GetSysParamFormHive("ET_LANGUAGE", userToken,siteCode, "MATERIALLIST");
                if (output.code == 0 && output.ext != null)
                {
                    ET_LANGUAGE = output.ext.paramvalue;
                }
            }

            return ET_LANGUAGE;
        }
        
        private static String transCodeTemplate;

        public static String GettransCodeTemplate(String userToken = "", string siteCode = "S1")
        {
            //if (String.IsNullOrEmpty(transCodeTemplate))
            {
                Output output = GetSysParamFormHive("transCodeTemplate", userToken,siteCode, "JOVE");
                if (output.code == 0 && output.ext != null)
                {
                    transCodeTemplate = output.ext.paramvalue;
                }
            }

            return transCodeTemplate;
        }

        public static Output GetSysParamFormHive(string _paramname, String userToken = "", string siteCode="", String _system = "JOVE")
        {
            Output output = new Output();
            try
            {
                config.WriteLog(String.Format("start... = {0}, userToken = {1} ,_system = {2}", _paramname, userToken, _system));

                Input input = new Input { system = _system, tool = "DEFAULT", paramname = _paramname };
                JavaScriptSerializer jss = new JavaScriptSerializer();
                WebClient client = new WebClient();
                if (String.IsNullOrEmpty(siteCode))
                {
                    siteCode = "S1";
                }
                client.Headers.Add("sobeyhive-http-site", siteCode);

                String url = String.Format("{0}basic/config/getsysparam?usertoken={1}", ServiceAddress, userToken);
                String inputData = jss.Serialize(input);

                config.WriteLog(String.Format("url = {0},upload data = {1}", url, inputData));

                byte[] ret = client.UploadData(url, System.Text.Encoding.UTF8.GetBytes(inputData));

                String retData = System.Text.Encoding.UTF8.GetString(ret);

                output = jss.Deserialize<Output>(retData);

                config.WriteLog(String.Format("return data = {0}", retData));
            }
            catch (Exception ex)
            {
                config.WriteLog(ex.ToString());

            }
            return output;
        }
    }


}