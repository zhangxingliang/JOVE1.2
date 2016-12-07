﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Jove.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        //20161116 wfg modify ,chage the usertoken to token 国内项目需要，CM也要同步修改
        public ActionResult Index(string token = "", string userCode = "")
        {

            ViewBag.PageTitle = ConfigurationManager.AppSettings["PageTitle"];
            Session["a"] = "b";
            Session["usertoken"] = token;
            Session["usercode"] = userCode;
            Session.Timeout = 120;
            return View();
        }

        public ActionResult Par()
        {
            ViewBag.PageTitle = ConfigurationManager.AppSettings["PageTitle"];
            ViewBag.UserToken = Session["usertoken"];
            ViewBag.UserCode = Session["usercode"];
            ViewBag.ResourceUrl = JOVEConfig.PreviewAddress;
            ViewBag.RootPath = ConfigurationManager.AppSettings["RootPath"];
            ViewBag.PreviewPath = JOVEConfig.CMPriviewAddress;
            ViewBag.TaskMonitorWebAddress = JOVEConfig.TaskMonitorWebAddress;
            if (!string.IsNullOrEmpty(ViewBag.UserToken))
            {
                ViewBag.SocketServer = JOVEConfig.GetSocketServer(ViewBag.UserToken);
                ViewBag.InstalledFontCollection = JOVEConfig.GetInstalledFontCollection(ViewBag.UserToken);
                ViewBag.GetET_LANGUAGE = JOVEConfig.GetET_LANGUAGE(ViewBag.UserToken);
                ViewBag.transCodeTemplate = JOVEConfig.GettransCodeTemplate(ViewBag.UserToken);
            }
            if (string.IsNullOrEmpty(ViewBag.SocketServer))
            {
                ViewBag.SocketServer = "ws://172.16.134.40:3130";
            }
            return View();
        }


    }
}
