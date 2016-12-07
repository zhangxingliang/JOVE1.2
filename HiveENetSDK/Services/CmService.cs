using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sobey.Core.Log;

namespace HiveENetSDK.Services
{
    public class CmService : ServiceBase
    {
        protected ILogger Logger = LoggerManager.GetLogger("App_Data");
     
        public CmService(ApiContext context)
            : base(context)
        {
        }
        ///// <summary>
        ///// 全文检索
        ///// </summary>
        ///// <param name="requst"></param>
        ///// <returns></returns>
        //public ResponseMessage<List<ObjectInfo>> SearchClips(string userToken, string keyWord)
        //{
        //    ResponseMessage<List<ObjectInfo>> r = new ResponseMessage<List<ObjectInfo>>();
        //    string url = ApiContext.ApiUrl + "/entity/object/entityindexserch";
        //    NameValueCollection q = new NameValueCollection();
        //    q.Add("userToken", userToken);
        //    SearchRequst requst = new SearchRequst()
        //    {
        //        queryCondition = new QueryCondition()
        //        {
        //            keyWord = keyWord,
        //            page = 1,
        //            size = 50,
        //            sortBys = new List<SortBy>() { new SortBy() { fieldName = "createTime", isdesc = false } }
        //        },
        //        resourceName = "entity"
        //    };
        //    r = ApiContext.Client.Post<ResponseMessage<List<ObjectInfo>>>(url, requst, "Post", q);
        //    Logger.Trace("执行结果：url:{0},code:{1},msg{2},json:{3}\n", url, r.Code, r.Msg, JsonHelper.ToJson(r.Ext));
        //    return r;
          
        //}


        /// <summary>
        /// 获取文件列表
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<List<ObjectInfo>> GetClipList(string userToken, string path)
        {
            ResponseMessage<List<ObjectInfo>> r = new ResponseMessage<List<ObjectInfo>>();
            string url = ApiContext.ApiUrl + "/entity/object/getchildobjects";//参数调整 待确认
            NameValueCollection q = new NameValueCollection();
            q.Add("userToken", userToken);
            q.Add("path", path);
            q.Add("pathtype", "http"); 
            r = ApiContext.Client.Get<ResponseMessage<List<ObjectInfo>>>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2},json:{3}\n", url, r.Code, r.Msg, JsonHelper.ToJson(r.Ext));
            return r;
        }

        /// <summary>
        /// 获取文件信息
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<ObjectInfo> GetClipInfo(string usertoken, string contentid, string objecttype, string pathtype)
        {
            ResponseMessage<ObjectInfo> r = new ResponseMessage<ObjectInfo>();
            string url = ApiContext.ApiUrl + "/entity/object/getobjectinfo";
            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            q.Add("contentid", contentid);
            q.Add("objecttype", objecttype);
            if (!string.IsNullOrEmpty(pathtype))
            {
                q.Add("pathtype", pathtype);
            }
            r = ApiContext.Client.Get<ResponseMessage<ObjectInfo>>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2},json:{3}\n", url, r.Code, r.Msg, JsonHelper.ToJson(r.Ext));
            return r;
        }


        /// <summary>
        /// 获取目录列表
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<List<FolderInfo>> GeFolderList(string usertoken, string path)
        {
            ResponseMessage<List<FolderInfo>> r = new ResponseMessage<List<FolderInfo>>();
            string url = ApiContext.ApiUrl + "/entity/folder/getsimplefolderinfo";//参数变更
            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            q.Add("path", path);
            q.Add("isCreate", "false");
            r = ApiContext.Client.Get<ResponseMessage<List<FolderInfo>>>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2},response:{3}\n", url, r.Code, r.Msg,JsonHelper.ToJson(r.Ext));
            return r;
        }

        /// <summary>
        /// 保存时间线
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<SaveClipResponse> SaveTimeLine(string usertoken, string path, string title, string contentid, EditorMediaJson requst)
        {
            ResponseMessage<SaveClipResponse> res = new ResponseMessage<SaveClipResponse>();
            string url = ApiContext.RenderApiUrl + "/entity/object/saveobjectinfo";
            if (requst != null && requst.tracks != null && requst.tracks.Count > 0)
            {
                foreach (var i in requst.tracks)
                {
                    if (i.trackEvents == null)
                    {
                        i.trackEvents = new List<TrackEvent>();
                    }
                }
            }
            SaveClipRequst r = new SaveClipRequst()
            {
                version = 0,
                type = "biz_sobey_program",
                @object = new ClipObject()
                {
                    metadata = null,
                    additionalinfo = null,
                    fileformatinfo = null,
                }
            };
            if (requst.resources != null && requst.resources.Count > 0)
            {
                r.@object.entity = new Entity()
                {
                    id = "",
                    guid = contentid,
                    type = "64",
                    subtype = 3,
                    folderid = requst.resources[0].FolderID,
                    folderpath = path,
                    cdid = "0",
                    keyword = "",
                    iconframe = requst.resources[0].IconFrame,
                    iconfilename = requst.resources[0].IconFileName,
                    creator = null,
                    modifier = null,
                    menber = null,
                    Delater = null,
                    createdate = DateTime.UtcNow.ToString(),
                    modifydate = DateTime.UtcNow.ToString(),
                    accessdate = DateTime.UtcNow.ToString(),
                    deletedate = DateTime.UtcNow.ToString(),
                    column = null,
                    status = "0",
                    usedflag = "0",
                    lockflag = "0",
                    rights = "",
                    journallist = "",
                    note = "",
                    editterminal = "",
                    modifyterminal = "",
                    deviceid = "00000000000000000000000000000000",
                    markin = "-1",
                    markout = "-1",
                    colorspace = null,
                    name = title,
                    Item = new Item()
                    {
                        fcpxml = "",
                        projectdata = JsonHelper.ToJson(requst),
                        Destination = 0,
                        SubPgmguid = 0,
                        audiochannel = 8,
                        audioformatid = 79,
                        audiotrack = 4,
                        backpath = "",
                        backtrack = 0,
                        clippath = "",
                        dubstatus = 0,
                        edittime = 0,
                        editversion = 0,
                        filepath = "",
                        forcerefreshflag = 0,
                        graphtrack = 1,
                        length = 0,
                        markpoints = null,
                        savestate = 0,
                        sysversion = 6,
                        tlblock = 0,
                        trimin = 0,
                        trimout = 0,
                        undopath = "",
                        videoformatid = 79,
                        videotrack = 1,
                        vtrin = 0,
                        vtrout = 0
                    }
                };
            }
            else
            {
                r.@object.entity = new Entity()
                    {
                        id = null,
                        guid = contentid,
                        type = "64",
                        subtype = 3,
                        folderid = null,
                        folderpath = path,
                        cdid = "0",
                        keyword = "",
                        iconframe = null,
                        iconfilename = null,
                        creator = null,
                        modifier = null,
                        menber = null,
                        Delater = null,
                        createdate = DateTime.UtcNow.ToString(),
                        modifydate = DateTime.UtcNow.ToString(),
                        accessdate = DateTime.UtcNow.ToString(),
                        deletedate = DateTime.UtcNow.ToString(),
                        column = null,
                        status = "0",
                        usedflag = "0",
                        lockflag = "0",
                        rights = "",
                        journallist = "",
                        note = "",
                        editterminal = "",
                        modifyterminal = "",
                        deviceid = "00000000000000000000000000000000",
                        markin = "-1",
                        markout = "-1",
                        colorspace = null,
                        name = title,
                        Item = new Item()
                        {
                            fcpxml = "",
                            projectdata = JsonHelper.ToJson(requst),
                            Destination = 0,
                            SubPgmguid = 0,
                            audiochannel = 8,
                            audioformatid = 79,
                            audiotrack = 4,
                            backpath = "",
                            backtrack = 0,
                            clippath = "",
                            dubstatus = 0,
                            edittime = 0,
                            editversion = 0,
                            filepath = "",
                            forcerefreshflag = 0,
                            graphtrack = 1,
                            length = 0,
                            markpoints = null,
                            savestate = 0,
                            sysversion = 6,
                            tlblock = 0,
                            trimin = 0,
                            trimout = 0,
                            undopath = "",
                            videoformatid = 79,
                            videotrack = 1,
                            vtrin = 0,
                            vtrout = 0
                        }
                    };
            }
            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);

            res = ApiContext.Client.Post<ResponseMessage<SaveClipResponse>>(url, r, "Post", q);
            Logger.Trace("执行结果：url:{0},code:{1},msg:{2},json:{3}\n", url, res.Code, res.Msg,JsonHelper.ToJson(r));
            return res;
        }

        /// <summary>
        /// 发起合成
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage SendToRender(string usertoken, string PEFSourcePath, string entityName, string objecttype, string folderPath, EditorMediaJson requst, string transCodeType = "")
        {
            ResponseMessage r = new ResponseMessage();
            string url = ApiContext.RenderApiUrl + "/entity/program/SubmitRender";
            
            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            q.Add("PEFSourcePath", PEFSourcePath);
            q.Add("entityName", entityName);
            q.Add("objecttype", objecttype);
            q.Add("folderPath", folderPath);
            q.Add("transCodeType", transCodeType);
            r =  ApiContext.Client.Post<ResponseMessage>(url, JsonHelper.ToJson(requst), "Post", q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url,r.Code,r.Msg);
            return r;
        }

        /// <summary>
        /// 是否有format信息
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage HasFormatInfo(string usertoken, string contentid)
        {
            ResponseMessage r = new ResponseMessage();
            string url = ApiContext.ApiUrl + "/entity/program/getfileformatbycontentid";//接口参数变更

            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            q.Add("contentid", contentid);
            r = ApiContext.Client.Get<ResponseMessage>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url, r.Code, r.Msg);
            return r;
        }
        

            /// <summary>
        /// 获取收藏夹素材
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<List<ObjectInfo>> GetFavoriteObject(string usertoken, string usercode)
        {
            ResponseMessage<List<ObjectInfo>> r = new ResponseMessage<List<ObjectInfo>>();
            string url = ApiContext.ApiUrl + "/entity/object/getfavoritesobjects";//参数调整 待确认
            NameValueCollection q = new NameValueCollection();
            q.Add("usertoken", usertoken);
            q.Add("usercode", usercode);
            q.Add("pathtype", "http");
            r = ApiContext.Client.Get<ResponseMessage<List<ObjectInfo>>>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2},json:{3}\n", url, r.Code, r.Msg, JsonHelper.ToJson(r.Ext));
            return r;
        }
        /// <summary>
        /// 生成PEF
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<RenderPefResponse> RenderPEF(string usertoken, string title, EditorMediaJson requst)
        {
            ResponseMessage<RenderPefResponse> r = new ResponseMessage<RenderPefResponse>();
            string url = ApiContext.RenderApiUrl + "/entity/program/renderpef";//接口参数变更

            NameValueCollection q = new NameValueCollection();
            q.Add("userToken", usertoken);
            q.Add("pefName", title);
            r = ApiContext.Client.Post<ResponseMessage<RenderPefResponse>>(url, JsonHelper.ToJson(requst), "Post", q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url, r.Code, r.Msg);
            return r;
        }

        /// <summary>
        /// 获取格式信息
        /// </summary>
        /// <param name="requst"></param>
        /// <returns></returns>
        public ResponseMessage<FileFormat> GetFileFormat(string formatID)
        {
            ResponseMessage<FileFormat> r = new ResponseMessage<FileFormat>();
            string url = ApiContext.ApiUrl + "/entity/clip/getmediaformatdefbyid";//接口参数变更

            NameValueCollection q = new NameValueCollection();
            q.Add("lformatid", formatID);
            r = ApiContext.Client.Get<ResponseMessage<FileFormat>>(url, q);
            Logger.Trace("执行结果：url:{0},code:{1},msg{2}\n", url, r.Code, r.Msg);
            return r;
        }
    }
}

