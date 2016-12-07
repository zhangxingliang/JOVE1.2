using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HiveENetSDK
{
    public class QueryCondition
    {
        public List<FieldCondition> fieldConditions { get; set; }
        
        public string keyWord { get; set; }

        public int page { get; set; }

        public int size { get; set; }

        public List<SortBy> sortBys { get; set; }
    }
}
