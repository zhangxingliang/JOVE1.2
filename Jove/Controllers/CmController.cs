using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using HiveENetSDK;
using Sobey.Core.Log;

namespace Jove.Controllers
{
    public class CmController : Controller
    {
        protected ILogger Logger = LoggerManager.GetLogger("App_Data");

        /// <summary>
        /// 获取文件列表
        /// </summary>
        /// <param name="loginInfoID"></param>
        /// <returns></returns>
        [HttpPost]
        [OutputCache(Duration = 0, VaryByParam = "None", VaryByCustom = "browser")]
        public ActionResult GetClipList(GetClipListRequest request)
        {
            ResponseMessage<List<ObjectInfo>> r = new ResponseMessage<List<ObjectInfo>>();

            Logger.Trace("获取素材列表:usertoken={0},path={1}\n", request.userToken, request.path);
            r = AppContext.Current.FolderService.GetClipList(request.userToken, GetPathUrlCode(request.path));
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r.Ext, JsonRequestBehavior.AllowGet);
        }

        //[HttpGet]
        //public ActionResult SearchClips(string usertoken, string keyword)
        //{
        //    ResponseMessage<List<ObjectInfo>> r = new ResponseMessage<List<ObjectInfo>>();

        //    Logger.Trace("搜索素材:usertoken={0},keyword={1}\n", usertoken, keyword);
        //    r = AppContext.Current.FolderService.SearchClips(usertoken, keyword);
        //    Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
        //    return Json(ObjectToClip(r.Ext, ""), JsonRequestBehavior.AllowGet);
        //}

        public List<ClipInfo> ObjectToClip(List<ObjectInfo> obj)
        {
            List<ClipInfo> temp = new List<ClipInfo>();
            if (obj != null && obj.Count > 0)
            {
                foreach (var i in obj)
                {
                    var item = new ClipInfo()
                    {
                        iconfilename = i.entity.iconfilename,
                        guid = i.entity.guid,
                        name = i.entity.name,
                        path = i.entity.type == 16 ? i.entity.folderpath + "/" + i.entity.name : null,
                        id = i.entity.id,
                        createdate = i.entity.createdate,
                        subtype = i.entity.subtype,
                        iconframe = i.entity.iconframe,
                        type = i.entity.type,
                        typetemp = i.entity.type,
                        folderpath = i.entity.folderpath
                    };
                    if (i.entity.item != null)
                    {
                        item.duration = i.entity.item.length;
                        item.filestatus = i.entity.item.filestatus;
                        item.dbestreamchannel = i.entity.item.dbestreamchannel;
                        item.capturestatus = i.entity.item.capturestatus;
                        item.videostandard = i.entity.item.videostandard;
                        item.hasItem = true;
                    }
                    else
                    {
                        item.hasItem =false ;
                    }
                    temp.Add(item);
                }
            }
            return temp;
        }

        /// <summary>
        /// 获取文件信息
        /// </summary>
        /// <param name="loginInfoID"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetClipInfo(string usertoken, string contentid, string objecttype)
        {
            ResponseMessage<ObjectInfo> r = new ResponseMessage<ObjectInfo>();

            Logger.Trace("获取素材信息:usertoken={0},contentid={1}，objecttype={2}\n", usertoken, contentid, objecttype);
            r = AppContext.Current.FolderService.GetClipInfo(usertoken, contentid, objecttype, "http");
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDragedClipInfo(string usertoken, string contentid, string objecttype)
        {
            ResponseMessage<EditedObjectInfo> r = new ResponseMessage<EditedObjectInfo>();

            Logger.Trace("获取拖拽的素材信息:usertoken={0},contentid={1}，objecttype={2}\n", usertoken, contentid, objecttype);
            var temp = AppContext.Current.FolderService.GetClipInfo(usertoken, contentid, objecttype, "");
            r.Code = temp.Code;
            r.Msg = temp.Msg;
            r.Ext = ObjectInfoToDraged(temp.Ext);
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r, JsonRequestBehavior.AllowGet);
        }

        public EditedObjectInfo ObjectInfoToDraged(ObjectInfo obj)
        {
            EditedObjectInfo eObj;
            if (obj == null)
            {
                eObj = new EditedObjectInfo();
                return eObj;
            }
            else
            {
                eObj = new EditedObjectInfo()
                {
                    Length = obj.entity.item.length.ToString() ?? "",
                    __id = obj.entity.guid ?? "",
                    CreateDate = obj.entity.createdate.ToString() ?? "",
                    CreatorID = obj.entity.creator ?? "",
                    FolderID = obj.entity.foldid.ToString() ?? "",
                    IconFileName = obj.entity.iconfilename ?? "",
                    IconFrame = obj.entity.iconframe.ToString() ?? "",
                    ObjectGUID = obj.entity.guid ?? "",
                    ObjectID = obj.entity.id.ToString() ?? "",
                    ObjectName = obj.entity.name ?? "",
                    ObjectType = obj.entity.type.ToString() ?? "",
                    SubType = obj.entity.subtype.ToString() ?? "",
                    TrimIn = obj.entity.item.trimin.ToString() ?? "",
                    TrimOut = obj.entity.item.trimout.ToString() ?? "",
                    Files = new List<EditedClipFile>()
                };
                if ((eObj.Length == "0" || eObj.Length == "") && obj.entity.item.clipfile != null && obj.entity.item.clipfile.Count > 0)
                {
                    eObj.Length = (obj.entity.item.clipfile[0].length).ToString();
                }
                if (obj.entity.item != null && obj.entity.item.clipfile != null && obj.entity.item.clipfile.Count > 0)
                {
                    Dictionary<string, string> formatDic = new Dictionary<string, string>();
                    eObj.VideoStandard = obj.entity.item.videostandard;
                    foreach (var i in obj.entity.item.clipfile)
                    {
                        eObj.Files.Add(new EditedClipFile()
                        {
                            ClipClass = i.clipclass,
                            ClipID = obj.entity.id,
                            ClipIn = i.clipin,
                            ClipOut = i.clipout,
                            FileFormat = "",
                            FileIn = i.filein,
                            FileOut = i.fileout,
                            FilePath = i.filename.ToString() ?? "",
                            FileSize = i.filesize.ToString() ?? "",
                            FormatID = i.formatid.ToString() ?? "",
                            Length = i.length.ToString() ?? "",
                            MediaChannel = i.mediachannel.ToString() ?? "",
                            QualityType = i.qualitytype

                        });
                        if(!formatDic.ContainsKey(i.formatid.ToString()))
                        {
                            var res = AppContext.Current.FolderService.GetFileFormat(i.formatid.ToString());
                            if (res.Code == "0" && res.Ext != null)
                            {
                                formatDic.Add(i.formatid.ToString(), res.Ext.nleformat);
                            }
                        }
                    }
                    foreach (var j in eObj.Files)
                    {
                        if (!string.IsNullOrEmpty(j.FormatID) && formatDic.ContainsKey(j.FormatID)) 
                        { 
                            j.FileFormat = formatDic[j.FormatID];
                        }
                    }
                }

                if (obj.entity.item != null && obj.entity.item.markpoints != null && obj.entity.item.markpoints.Count > 0)
                {
                    eObj.Markers = obj.entity.item.markpoints;
                }
                return eObj;
            }

        }

        /// <summary>
        /// 获取目录列表
        /// </summary>
        /// <param name="loginInfoID"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult GetFolderList(GetFolderRequst requst)
        {
            ResponseMessage<List<FolderInfo>> r = new ResponseMessage<List<FolderInfo>>();

            Logger.Trace("获取目录列表:requst={0}\n", JsonHelper.ToJson(requst));
            r = AppContext.Current.FolderService.GeFolderList(requst.usertoken, GetPathUrlCode(requst.path));
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);

            var folderList = r.Ext;

            List<Tree> TreeList = new List<Tree>();
            TreeList = ObjectToTree(folderList, requst);
            return Json(TreeList, JsonRequestBehavior.AllowGet); ;
        }
        public static string GetPathUrlCode(string path)
        {
            string[] paths = path.Split('/');

            Regex reg = new Regex("[&!@#$%^*_+]");

            string pa = "";
            foreach (var p in paths)
            {

                if (reg.Match(p).Success)
                {
                    if (string.IsNullOrEmpty(pa))
                    {
                        pa = System.Web.HttpUtility.UrlEncode(p);
                    }

                    else
                    {
                        pa = string.Format("{0}/{1}", pa, pa = System.Web.HttpUtility.UrlEncode(p));
                    }
                }
                else
                {
                    if (string.IsNullOrEmpty(pa))
                    {
                        pa = p;
                    }

                    else
                    {
                        pa = string.Format("{0}/{1}", pa, p);
                    }
                }

            }
            return pa;
        }

        public List<Tree> ObjectToTree(List<FolderInfo> obj, GetFolderRequst requst)
        {
            int count = 0;
            count = requst.parentcount + 1;
            string guid = "86023a7e3f2646a2bbee8a9fec7e6bcb";
            if (requst.guid != null)
            {
                guid = requst.guid;
            }
            List<Tree> temp = new List<Tree>();
            if (obj != null && obj.Count > 0)
            {
                foreach (var i in obj)
                {
                    if (i != null && i.entity != null)
                    {
                        temp.Add(new Tree()
                        {
                            guid = i.entity.guid,
                            name = i.entity.name,
                            path = requst.path + "/" + i.entity.name,
                            parentcount = count,
                            fatherGuid = guid,
                            createdate = i.entity.createdate,
                            nodes = new List<Tree>()
                        });
                    }
                }
            }
            return temp;
        }
        public Tree GetTreeNode(List<Tree> TreeList, string path)
        {
            if (TreeList == null)
            {
                return null;
            }
            Tree temp = TreeList.Find(x => x.path == path);
            if (temp != null)
            {
                return temp;
            }
            else
            {
                foreach (var i in TreeList)
                {
                    if (i.nodes != null && i.nodes.Count > 0)
                    {
                        temp = GetTreeNode(i.nodes, path);
                        if (temp != null)
                        {
                            return temp;
                        }
                    }
                }
            }
            return null;
        }

        /// <summary>
        /// 保存时间线
        /// </summary>
        /// <param name="loginInfoID"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SaveTimeLine(RenderPEFRequest requst, string usertoken, string contentid)
        {
            string lastPefPath = "";
            string path = "" ;
            ResponseMessage<SaveClipResponse> r = new ResponseMessage<SaveClipResponse>();
            requst.json.videostandard = JOVEConfig.GetHivevideoStandard(usertoken);
            if (contentid == "")
            {
                contentid = Guid.NewGuid().ToString("N").ToLower();
            }
            else 
            {
                 var info = AppContext.Current.FolderService.GetClipInfo(usertoken, contentid, "64", "http");
                 if (info.Code == "0")
                 {
                     lastPefPath = info.Ext.entity.item.filepath;
                     Logger.Trace("pef:{0}", lastPefPath);
                     var bz = ConfigurationManager.AppSettings["z"];
                     Logger.Trace("z:{0}", bz);
                     var index = lastPefPath.IndexOf("bucket-z") + "bucket-z/".Length;
                     Logger.Trace("index:{0}", index);
                     path = bz + lastPefPath.Substring(index);
                     Logger.Trace("pefpath:{0}", path);
                 }
            }
            Logger.Trace("获取素材信息:usertoken={0},path={1}，title={2},contentid={3},requst={4}\n", usertoken, requst.folderPath, requst.title, contentid, JsonHelper.ToJson(requst));
            r = AppContext.Current.FolderService.SaveTimeLine(usertoken,requst.folderPath, requst.title, contentid, requst.json);
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            try
            {
                if (r.Code == "0" && !string.IsNullOrEmpty(path) && System.IO.File.Exists(path))
                {
                    Logger.Trace("执行删除");
                    System.IO.File.Delete(path);
                    if (!System.IO.File.Exists(path))
                    {
                        Logger.Trace("delete {0} succuss", path);
                    }
                    else
                    {
                        Logger.Trace("delete {0} failed", path);
                    }
                }
               
            }
            catch (Exception e) {
                Logger.Trace("delete failed! path:{0} {1}", path, e.Message);
            }
            return Json(r, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取时间线
        /// </summary>
        /// <param name="loginInfoID"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetTimeLine(string usertoken, string guid)
        {
            ResponseMessage<ObjectInfo> r = new ResponseMessage<ObjectInfo>();
            EditorMediaJson response = new EditorMediaJson();

            r = AppContext.Current.FolderService.GetClipInfo(usertoken, guid, "64", "http");
            Logger.Trace("获取素材信息:usertoken={0},guid={1}\n", usertoken, guid);
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 发起合成
        /// </summary>
        /// <param name="loginInfoID"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult SendToRender(string usertoken,string objecttype,  RenderPEFRequest requst,string transCodeType="")
        {
            ResponseMessage r = new ResponseMessage();
            Logger.Trace("获取素材信息:usertoken={0},PEFSourcePath={1}，folderPath={2},objecttype={3}\n", usertoken, requst.pefFilePath, requst.folderPath, objecttype);
            r = AppContext.Current.FolderService.SendToRender(usertoken, GetPathUrlCode(requst.pefFilePath), requst.title, objecttype, GetPathUrlCode(requst.folderPath), requst.json, transCodeType);
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r, JsonRequestBehavior.AllowGet);
        }

        ///// <summary>
        /////是否有format信息
        ///// </summary>
        ///// <param name="loginInfoID"></param>
        ///// <returns></returns>
        //[HttpGet]
        //public ActionResult HasFormatInfo(string usertoken, string contentid)
        //{
        //    ResponseMessage r = new ResponseMessage();
        //    Logger.Trace("获取素材信息:usertoken={0},contentid={1}\n", usertoken, contentid);
        //    r = AppContext.Current.FolderService.HasFormatInfo(usertoken, contentid);
        //    Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
        //    return Json(r, JsonRequestBehavior.AllowGet);
        //}

        [HttpGet]
        public ActionResult Login(string usertoken)
        {
            ResponseMessage<UserInfo> r = new ResponseMessage<UserInfo>();
            r = AppContext.Current.AuthService.GetUserInfo(usertoken);
            return Json(r, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetFavoriteObject(string usertoken, string usercode)
        {
            ResponseMessage<List<ObjectInfo>> r = new ResponseMessage<List<ObjectInfo>>();
            Logger.Trace("获取收藏夹素材列表:usertoken={0}\n", usertoken);
            r = AppContext.Current.FolderService.GetFavoriteObject(usertoken, usercode);
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r.Ext, JsonRequestBehavior.AllowGet);
        }
        //[HttpGet]
        //public ActionResult GetUserStorage(string usertoken, string loginname)
        //{
        //    ResponseMessage<UserStorageInfo> r = new ResponseMessage<UserStorageInfo>();
        //    r = AppContext.Current.AuthService.GetUserStorage(usertoken, loginname);
        //    return Json(r, JsonRequestBehavior.AllowGet);
        //}

        //[HttpGet]
        //public ResponseMessage CheckLogin(string loginInfoID)
        //{
        //    return AppContext.Current.AuthService.CheckLogin(loginInfoID);
        //}

        [HttpPost]
        public ActionResult RenderPEF(RenderPEFRequest request, string usertoken)
        {
            ResponseMessage<RenderPefResponse> r = new ResponseMessage<RenderPefResponse>();
            request.json.videostandard = JOVEConfig.GetHivevideoStandard(usertoken);
            Logger.Trace("获取素材信息:usertoken={0},title={1},requst={2}\n", usertoken, request.title, JsonHelper.ToJson(request.json));
            r = AppContext.Current.FolderService.RenderPEF(usertoken, request.title, request.json);
            Logger.Trace("执行结果：code:{0},msg:{1}\n", r.Code, r.Msg);
            return Json(r, JsonRequestBehavior.AllowGet);
        }
    }
}