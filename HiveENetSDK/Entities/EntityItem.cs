using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class EntityItem
    {
        public long trimin { get; set; }

        public long trimout { get; set; }

        public ulong length { get; set; }

        public string recorddate { get; set; }

        public string endrecorddate { get; set; }

        public string showdate { get; set; }

        public string archivedate { get; set; }

        public string archiveuser { get; set; }

        public string videostandard { get; set; }

        public string filestatus { get; set; }

        public string capturestatus { get; set; }

        public int imagetype { get; set; }

        public int tobearcivestate { get; set; }

        public int clipsource { get; set; }

        public long vtrin { get; set; }

        public long vtrout { get; set; }

        public long vtrinnext { get; set; }

        public long vtroutnext { get; set; }

        public int keepdays { get; set; }

        public int ingesttaskid { get; set; }

        public string planningguid { get; set; }

        public string version { get; set; }

        public int serialdatasize { get; set; }

        public int adaptetype { get; set; }

        public int showmode { get; set; }

        public int videoposx { get; set; }

        public int videoposy { get; set; }

        public int property { get; set; }

        public List<ClipFile> clipfile { get; set; }

        public int archiveflag { get; set; }

        public int archive3rdflag { get; set; }

        public string dbestreamchannel { get; set; }

        public int ntsctcmode { get; set; }

        public string storyid { get; set; }

        public string projectdata { get; set; }

        public string category { get; set; }

        public int signalsourcetype { get; set; }

        public string programname { get; set; }

        public string itemname { get; set; }

        public int tobearchivestate { get; set; }

        public string mediachannel { get; set; }

        public string filepath { get; set; }

        public List<Mark> markpoints { get; set; }
    }
}
