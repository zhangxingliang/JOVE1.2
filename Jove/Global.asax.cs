using Sobey.Core.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Jove
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        private ILogger Logger = LoggerManager.GetLogger("App_Data");

        protected void Application_Start()
        {
            this.Error += MvcApplication_Error;


            AreaRegistration.RegisterAllAreas();


            string path = Server.MapPath(@"Logs");
            LogLevels logLevel = LogLevels.Info;
            if (ConfigurationManager.AppSettings["Debug"] == "true")
            {
                logLevel = LogLevels.All;
            }
            LoggerManager.InitLogger(new LogConfig()
            {
                LogBaseDir = path,
                LogFileTemplate = LogFileTemplates.PerDayDirAndLogger,
                LogContentTemplate = LogLayoutTemplates.SimpleLayout,
                LogLevels = logLevel
            });

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            JOVEConfig.initConfig(Server.MapPath("."));

            //这里初始化SDK上下文
            new AppContext(JOVEConfig.ServiceAddress ?? "", JOVEConfig.GetFileFormatInfoAddress ?? "");


           


        }

        void MvcApplication_Error(object sender, EventArgs e)
        {
            Logger.Error("未处理的异常：\r\n{0}", Server.GetLastError().ToString());
        }

    }
}