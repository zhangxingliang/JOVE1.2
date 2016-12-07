using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using System.Web.Script.Serialization;
namespace NunitCore
{
    public class SerializerHelper
    {

        #region XML序列化/反序列化辅助类

        /// <summary>
        /// XML反序列化指定字符串
        /// </summary>
        /// <param name="strXml">字符串</param>
        /// <param name="type">对象类型</param>
        /// <returns>返回反序列化后的对象</returns>
        public static object Deserialize(string strXml, Type type)
        {
            XmlSerializer ser = new XmlSerializer(type);
            object obj = null;
            try
            {
                obj = ser.Deserialize(new StringReader(strXml));
            }
            catch (Exception e)
            {
                string error = string.Format("XML Deserialize Exception:{0}\r\nxmlString={1}", e.Message, strXml);
            }
            return obj;
        }

        /// <summary>
        /// XML反序列化指定字符串
        /// </summary>
        /// <typeparam name="T">泛型类型</typeparam>
        /// <param name="strXml">字符串</param>
        /// <returns>返回反序列化后的对象</returns>
        public static T Deserialize<T>(string strXml) where T : class
        {
            XmlSerializer ser = new XmlSerializer(typeof(T));
            T local = default(T);
            try
            {
                local = (T)ser.Deserialize(new StringReader(strXml));

            }
            catch (Exception e)
            {
                string error = string.Format("XML Deserialize Exception:{0}\r\nxmlString={1}", e.Message, strXml);

            }
            return local;
        }

        /// <summary>
        /// XML序列化指定对象
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns>返回序列化后的字符串</returns>
        public static string Serialize(object obj)
        {
            if (obj == null) return "obj is null";
            try
            {
                XmlSerializer ser = new XmlSerializer(obj.GetType());
                StringWriter sw = new StringWriter();
                ser.Serialize(sw, obj);
                return sw.ToString();
            }
            catch (Exception e)
            {
                string msg = string.Format("ObjectToXml is error:{0}", e.Message);
                return msg;
            }
        }

        /// <summary>
        /// XML序列化指定对象
        /// </summary>
        /// <typeparam name="T">泛型类型</typeparam>
        /// <param name="data">被序列化的对象</param>
        /// <returns>返回序列化后的字符串</returns>
        public static string Serialize<T>(T data) where T : class
        {
            if (data == null) return "data is null";
            try
            {
                using (StringUTF8Writer sw = new StringUTF8Writer())
                {
                    XmlSerializer ser = new XmlSerializer(typeof(T));
                    ser.Serialize(sw, data);
                    return sw.ToString();
                }

            }
            catch (Exception e)
            {
                string msg = string.Format("ObjectToXml is error:{0}", e.Message);
                return msg;
            }
        }

        public class StringUTF8Writer : System.IO.StringWriter
        {
            public override Encoding Encoding
            {
                get { return Encoding.UTF8; }
            }
        }

        /// <summary>
        /// 加载XML文件
        /// </summary>
        /// <typeparam name="T">反序列化的类型</typeparam>
        /// <param name="fileName">XML文件名称</param>
        /// <returns>返回反序列化后的对象</returns>
        public static T LoadFromXml<T>(string fileName) where T : class
        {
            FileStream stream = null;
            T local = default(T);
            try
            {
                XmlSerializer serializer = new XmlSerializer(typeof(T));
                stream = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                local = (T)serializer.Deserialize(stream);
            }
            finally
            {
                if (stream != null)
                {
                    stream.Close();
                }
            }
            return local;
        }

        /// <summary>
        /// 保存数据到XML文件
        /// </summary>
        /// <typeparam name="T">序列化的类型</typeparam>
        /// <param name="fileName">XML文件名称</param>
        /// <param name="data">保存的数据</param>
        /// <returns>true：保存成功；false：保存失败</returns>
        public static bool SaveToXml<T>(string fileName, T data) where T : class
        {

            bool result = false;
            FileStream stream = null;
            try
            {
                XmlSerializer serializer = new XmlSerializer(typeof(T));
                stream = new FileStream(fileName, FileMode.Create, FileAccess.Write);
                serializer.Serialize((Stream)stream, data);
                result = true;

            }
            catch (Exception ex)
            {

            }
            finally
            {
                if (stream != null)
                {
                    stream.Close();
                }
            }
            return result;


        }

        #endregion
        /// <summary>
        /// Json序列化指定对象
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns>返回序列化后的字符串</returns>
        //public static string JsonSerialize(object obj)
        //{
        //    JavaScriptSerializer serializer = new JavaScriptSerializer();
        //    return serializer.Serialize(obj);
        //}

        public static String JsonSerialize(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        /// <summary>
        /// Json反序列化指定字符串
        /// </summary>
        /// <typeparam name="T">反序列化的类型</typeparam>
        /// <param name="jsonString">json字符串</param>
        /// <returns>返回反序列化后的对象</returns>
        //public static T JsonDeserialize<T>(string jsonString)
        //{
        //    T result = default(T);
        //    JavaScriptSerializer serializer = new JavaScriptSerializer();
        //    result = serializer.Deserialize<T>(jsonString);
        //    return result;
        //}

        public static T JsonDeserialize<T>(string jsonString)
        {
            T result = default(T);
            result = JsonConvert.DeserializeObject<T>(jsonString);
            return result;
        }

        /// <summary>
        /// 加载Json文件
        /// </summary>
        /// <typeparam name="T">泛型类型</typeparam>
        /// <param name="filePath">文件路径</param>
        /// <returns>返回反序列化后的对象</returns>
        public static T LoadFromJsonFile<T>(string filePath) where T : class
        {
            T obj = default(T);
            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.ReadWrite, FileShare.ReadWrite))
            {
                string fileData = string.Empty;
                byte[] bytes = new byte[fs.Length];
                int length = fs.Read(bytes, 0, bytes.Length);
                if (length == bytes.Length)
                    fileData = Encoding.Default.GetString(bytes);
                if (filePath != string.Empty)
                    obj = JsonDeserialize<T>(fileData);
            }
            return obj;
        }

        /// <summary>
        /// 保存数据到Json文件
        /// </summary>
        /// <typeparam name="T">泛型类型</typeparam>
        /// <param name="obj">保存的数据</param>
        /// <param name="filePath">文件路径</param>
        public static void SaveAsJsonFile<T>(T obj, string filePath) where T : class
        {
            string fileData = JsonSerialize(obj);
            File.WriteAllText(filePath, fileData);
        }

        /// <summary>
        /// Json序列化指定对象（深度限制）
        /// </summary>
        /// <param name="obj">对象</param>
        /// <param name="recursionDepth">序列化深度</param>
        /// <returns>返回序列化后的字符串</returns>
        public static string JsonSerialize(object obj, int recursionDepth)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.RecursionLimit = recursionDepth;
            return serializer.Serialize(obj);
        }

        #region  Binary序列化/反序列化辅助类

        /// <summary>
        /// Binary序列化对象
        /// </summary>
        /// <param name="obj">对象</param>
        /// <returns>返回序列化后的流</returns>
        public static Stream BinarySerialize(object obj)
        {
            IFormatter formatter = new BinaryFormatter();
            Stream stream = new MemoryStream();
            formatter.Serialize(stream, obj);
            stream.Position = 0;
            return stream;
        }

        /// <summary>
        /// Binary反序列化流
        /// </summary>
        /// <typeparam name="T">反序列化的类型</typeparam>
        /// <param name="stream">流</param>
        /// <returns>返回反序列化后的对象</returns>
        public static T BinaryDeserialize<T>(Stream stream) where T : class
        {
            stream.Position = 0;
            IFormatter formatter = new BinaryFormatter();
            return (T)formatter.Deserialize(stream);
        }

        /// <summary>
        /// Binary反序列化流
        /// </summary>
        /// <typeparam name="T">反序列化的类型</typeparam>
        /// <param name="stream">流</param>
        /// <returns>返回反序列化后的对象</returns>
        public static T BinaryDeserialize<T>(byte[] bytes) where T : class
        {
            Stream stream = new MemoryStream(bytes, true);
            return BinaryDeserialize<T>(stream);
        }

        /// <summary>
        /// 加载二进制文件
        /// </summary>
        /// <typeparam name="T">泛型类型</typeparam>
        /// <param name="filePath">文件路径</param>
        /// <returns>返回反序列化后的对象</returns>
        public static T LoadFromBinaryFile<T>(string filePath) where T : class
        {
            T obj = default(T);
            FileStream fs = null;
            IFormatter formatter = new BinaryFormatter();
            using (fs = new FileStream(filePath, FileMode.Open, FileAccess.ReadWrite))
                obj = (T)formatter.Deserialize(fs);
            return obj;
        }

        /// <summary>
        /// 保存数据到二进制文件
        /// </summary>
        /// <typeparam name="T">泛型类型</typeparam>
        /// <param name="obj">保存的数据</param>
        /// <param name="filePath">文件路径</param>
        public static void SaveAsBinaryFile<T>(T obj, string filePath) where T : class
        {
            FileStream fs = null;
            try
            {
                IFormatter formatter = new BinaryFormatter();
                fs = new FileStream(filePath, FileMode.Create, FileAccess.ReadWrite);
                formatter.Serialize(fs, obj);
                fs.Flush();
            }
            finally
            {
                if (fs != null)
                {
                    fs.Close();
                    fs.Dispose();
                }
            }
        }

        #endregion
    }
}
