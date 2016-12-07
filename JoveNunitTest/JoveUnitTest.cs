using System;
using NUnit.Framework;
using HiveENetSDK;
using HiveENetSDK.Services;
using System.Collections.Generic;

namespace JoveNunitTest
{
    [TestFixture]
    public class JoveNunitTest
    {
        ApiContext apiContext;
        JoveConfig config;
        string userToken;
        string path;

        public JoveNunitTest()
        {
            config = new JoveConfig().Get() as JoveConfig;
            apiContext = new ApiContext(config.ServiceAddress, config.ServiceAddress);
            userToken = config.UserToken;
            path = config.Path;
        }

        [Test]
        public void Login()
        {
            LoginRequst request = new LoginRequst();

            request.LOGINNAME = "admin";
            request.LOGINPWD = "21232f297a57a5a743894a0e4a801fc3";
            request.LOGINSUBSYSTEM = Guid.NewGuid().ToString();
            //wfg added
            request.LOGINIP = "127.0.0.1";
            

            AuthService auth = new AuthService(apiContext);
            ResponseMessage<UserInfo> response =  auth.Login(request);
            Assert.IsTrue(response.Code == "0");
        }


        //[Test]
        //public void SearchClips()
        //{
        //    CmService cm = new CmService(apiContext);
        //    ResponseMessage<List<ObjectInfo>> r = cm.SearchClips(userToken, "");
        //    Assert.IsTrue(r.Code == "0");
        //}

        [Test]
        public void GetClipList()
        {
            CmService cm = new CmService(apiContext);
            ResponseMessage<List<ObjectInfo>> r = cm.GetClipList(userToken, path);
            Assert.IsTrue(r.Code == "0");
        }

        [Test]
        public void GetClipInfo()
        {
            CmService cm = new CmService(apiContext);
            ResponseMessage<ObjectInfo> r = cm.GetClipInfo(userToken, "6a350b570ecf40549016b3c434eb0c18", "32", "http");
            Assert.IsTrue(r.Code == "0");
        }

        [Test]
        public void GeFolderList()
        {
            CmService cm = new CmService(apiContext);
            ResponseMessage<List<FolderInfo>> r = cm.GeFolderList(userToken, path);
            Assert.IsTrue(r.Code == "0");
        }

        [Test]
        public void SaveTimeLine()
        {
            CmService cm = new CmService(apiContext);
            ResponseMessage<SaveClipResponse> r = cm.SaveTimeLine(userToken, path, "title", "conentid", JsonHelper.ToObject<EditorMediaJson>(""));
            Assert.IsTrue(r.Code == "0");
        }

        [Test]
        public void SendToRender()
        {
            CmService cm = new CmService(apiContext);
           // ResponseMessage r = cm.SendToRender(userToken, "6a350b570ecf40549016b3c434eb0c18", "global_sobey_defaultclass / MaterialList", "32");
            //Assert.IsTrue(r.Code == "0");
        }

        [Test]
        public void HasFormatInfo()
        {
            CmService cm = new CmService(apiContext);
            ResponseMessage r = cm.HasFormatInfo(userToken, "c4da6a8cc56f4b5599754ba2d0d3e86b");
            Assert.IsTrue(r.Code == "0");
        }
    }
}
