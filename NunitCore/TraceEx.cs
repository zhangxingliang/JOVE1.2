using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace NunitCore
{
    public class TraceEx : System.Diagnostics.TraceListener
    {

        public string dirPath;

        StreamWriter writer;
        public TraceEx()
        {
            dirPath = "NunitTest";

            if (!Directory.Exists(dirPath))
                Directory.CreateDirectory(dirPath);

            string path = System.IO.Path.Combine(dirPath, string.Format("{0}.log", DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss")));
            writer = new StreamWriter(path, true, Encoding.Default);
            writer.AutoFlush = true;
        }

        private void ClearLog()
        {
            string[] files = System.IO.Directory.GetFiles(dirPath);
            foreach (var item in files)
            {
                try
                {
                    FileInfo file = new FileInfo(item);
                    if (string.Compare(file.Extension, ".log", true) == 0)
                    {
                        if (file.CreationTime < DateTime.Now.AddDays(-7))
                        {
                            file.Delete();
                        }
                    }
                }
                catch (Exception ex)
                {
                    Trace.TraceWarning(ex.ToString());
                }

            }
        }

        public override void Write(string message)
        {
            string msg = string.Format("{0} {1} {2}", DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss-fff"), System.Threading.Thread.CurrentThread.ManagedThreadId, message);
            writer.Write(msg);
        }
        public override void WriteLine(string message)
        {
            MethodBase method = new StackFrame(4).GetMethod();
            if (method == null)
            {
                method = new StackFrame(1).GetMethod();
            }

            string methodName = string.Format("[{0}::{1}]", method.DeclaringType.Name, method.Name).PadRight(40);
            writer.WriteLine(methodName + message);
        }
        public override void Close()
        {
            base.Close();
            writer.Close();
        }
    }
}
