using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Diagnostics;
using System.Xml;
using System.Reflection;

namespace NunitCore
{
    public class ConfigBase
    {

        private const String ConfigPath = @"Config.xml";

        public String UserToken
        {
            get;
            set;
        }
        public String Path { get; set; }
        public String ServiceAddress { get; set; }

        static ConfigBase()
        {
            //添加日志输出
            System.Diagnostics.ConsoleTraceListener ctl = new ConsoleTraceListener();

            System.Diagnostics.Trace.Listeners.Add(new TraceEx());
            System.Diagnostics.Trace.Listeners.Add(ctl);
        }

        public Object Get()
        {
            //从配置当中读取属性
            Type type = this.GetType();
            Object obj = Activator.CreateInstance(type);

            try
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(ConfigPath);

                PropertyInfo[] propertyInfos = type.GetProperties();
                foreach (var propertyInfo in propertyInfos)
                {
                    XmlNode xmlNode = doc.SelectSingleNode(String.Format("Config/{0}", propertyInfo.Name));
                    if (xmlNode != null)
                    {
                        propertyInfo.SetValue(obj, xmlNode.InnerText);
                    }
                    else
                    {
                        Trace.TraceError(String.Format("{0} not find in xml", propertyInfo.Name));
                    }
                }           
            }
            catch (Exception ex)
            {
                Trace.TraceError(ex.ToString());
            }
            return obj;
        }

        public override string ToString()
        {
            return SerializerHelper.Serialize(this);
        }
    }
}
