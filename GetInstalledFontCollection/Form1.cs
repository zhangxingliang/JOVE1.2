using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using System.Data;
using System.Drawing.Text;
using System.IO;
//Download by http://www.codefans.net
namespace System
{
	/// <summary>
	/// Form1 的摘要说明。
	/// </summary>
	public class Form1 : System.Windows.Forms.Form
	{
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.ComboBox comboBox1;
		private System.Windows.Forms.ComboBox comboBox2;
		private System.Windows.Forms.Label label2;
		private System.Windows.Forms.ComboBox comboBox3;
		private System.Windows.Forms.Label label3;
		private System.Windows.Forms.Label label4;
		private System.Windows.Forms.ComboBox comboBox4;
		private System.Windows.Forms.TextBox textBox1;
        private Button button1;
		/// <summary>
		/// 必需的设计器变量。
		/// </summary>
		private System.ComponentModel.Container components = null;

		public Form1()
		{
			//
			// Windows 窗体设计器支持所必需的
			//
			InitializeComponent();

			//
			// TODO: 在 InitializeComponent 调用后添加任何构造函数代码
			//
		}

		/// <summary>
		/// 清理所有正在使用的资源。
		/// </summary>
		protected override void Dispose( bool disposing )
		{
			if( disposing )
			{
				if (components != null) 
				{
					components.Dispose();
				}
			}
			base.Dispose( disposing );
		}

		#region Windows 窗体设计器生成的代码
		/// <summary>
		/// 设计器支持所需的方法 - 不要使用代码编辑器修改
		/// 此方法的内容。
		/// </summary>
		private void InitializeComponent()
		{
            this.label1 = new System.Windows.Forms.Label();
            this.comboBox1 = new System.Windows.Forms.ComboBox();
            this.comboBox2 = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.comboBox3 = new System.Windows.Forms.ComboBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.comboBox4 = new System.Windows.Forms.ComboBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.Location = new System.Drawing.Point(8, 8);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(72, 16);
            this.label1.TabIndex = 0;
            this.label1.Text = "选择字体：";
            // 
            // comboBox1
            // 
            this.comboBox1.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBox1.Location = new System.Drawing.Point(72, 8);
            this.comboBox1.Name = "comboBox1";
            this.comboBox1.Size = new System.Drawing.Size(144, 20);
            this.comboBox1.TabIndex = 1;
            this.comboBox1.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // comboBox2
            // 
            this.comboBox2.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBox2.Location = new System.Drawing.Point(288, 8);
            this.comboBox2.Name = "comboBox2";
            this.comboBox2.Size = new System.Drawing.Size(64, 20);
            this.comboBox2.TabIndex = 3;
            this.comboBox2.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.Location = new System.Drawing.Point(224, 8);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(72, 16);
            this.label2.TabIndex = 2;
            this.label2.Text = "选择字型：";
            // 
            // comboBox3
            // 
            this.comboBox3.Location = new System.Drawing.Point(288, 32);
            this.comboBox3.Name = "comboBox3";
            this.comboBox3.Size = new System.Drawing.Size(64, 20);
            this.comboBox3.TabIndex = 5;
            this.comboBox3.TextChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // label3
            // 
            this.label3.Location = new System.Drawing.Point(224, 32);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(72, 16);
            this.label3.TabIndex = 4;
            this.label3.Text = "选择字号：";
            // 
            // label4
            // 
            this.label4.Location = new System.Drawing.Point(8, 32);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(72, 16);
            this.label4.TabIndex = 6;
            this.label4.Text = "选择颜色：";
            // 
            // comboBox4
            // 
            this.comboBox4.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.comboBox4.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBox4.Location = new System.Drawing.Point(72, 32);
            this.comboBox4.Name = "comboBox4";
            this.comboBox4.Size = new System.Drawing.Size(144, 22);
            this.comboBox4.TabIndex = 9;
            this.comboBox4.DrawItem += new System.Windows.Forms.DrawItemEventHandler(this.comboBox4_DrawItem);
            this.comboBox4.MeasureItem += new System.Windows.Forms.MeasureItemEventHandler(this.comboBox4_MeasureItem);
            this.comboBox4.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(10, 106);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.textBox1.Size = new System.Drawing.Size(344, 136);
            this.textBox1.TabIndex = 10;
            this.textBox1.Text = "字体实例";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(72, 60);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(144, 23);
            this.button1.TabIndex = 11;
            this.button1.Text = "获取所有字体";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // Form1
            // 
            this.AutoScaleBaseSize = new System.Drawing.Size(6, 14);
            this.ClientSize = new System.Drawing.Size(360, 300);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.comboBox4);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.comboBox3);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.comboBox2);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.comboBox1);
            this.Controls.Add(this.label1);
            this.MaximizeBox = false;
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "演示获取系统已经安装的字体";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

		}
		#endregion

		/// <summary>
		/// 应用程序的主入口点。
		/// </summary>
		[STAThread]
		static void Main() 
		{
			Application.Run(new Form1());
		}

		private void Form1_Load(object sender, System.EventArgs e)
		{
            try
            {
                String[] files = Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "InstalledFont_*.txt", SearchOption.TopDirectoryOnly);
                foreach (var file in files)
                {
                    File.Delete(file);
                }

            }
            catch (Exception)
            {

            }

			//获取系统已经安装的字体
			InstalledFontCollection MyFont=new InstalledFontCollection();
			FontFamily[] MyFontFamilies=MyFont.Families;
			int Count=MyFontFamilies.Length;
			for(int i=0;i<Count;i++)
			{
				string FontName=MyFontFamilies[i].Name;
				this.comboBox1.Items.Add(FontName);
			}
			//设置字体风格列表
			string []MyStyle=new string[]{"加粗","倾斜","正常","删除线","下划线"};
			for(int i=0;i<5;i++)
			{
				string StyleName=MyStyle[i];
				this.comboBox2.Items.Add(StyleName);
			}	
			//设置字体大小列表
			float []MySize=new float[]{1,2,4,6,8,10,12,16,18,20,22,24,32,36,48,64,72};
			foreach(float f in MySize)
			{
				this.comboBox3.Items.Add(f);
			}
			//设置颜色列表值
			this.comboBox4.DisplayMember="Color";
			this.comboBox4.Items.Add(Brushes.Cyan);
			this.comboBox4.Items.Add(Brushes.DarkSalmon);
			this.comboBox4.Items.Add(Brushes.Gray);
			this.comboBox4.Items.Add(Brushes.Green);
			this.comboBox4.Items.Add(Brushes.AliceBlue);
			this.comboBox4.Items.Add(Brushes.Black);
			this.comboBox4.Items.Add(Brushes.Blue);
			this.comboBox4.Items.Add(Brushes.Chocolate);
			this.comboBox4.Items.Add(Brushes.Pink);
			this.comboBox4.Items.Add(Brushes.Red);
			this.comboBox4.Items.Add(Brushes.LightBlue);
			this.comboBox4.Items.Add(Brushes.Brown);
			this.comboBox4.Items.Add(Brushes.DodgerBlue);
			this.comboBox4.Items.Add(Brushes.MediumPurple);
			this.comboBox4.Items.Add(Brushes.White);
			this.comboBox4.Items.Add(Brushes.Yellow);	
			this.comboBox1.Text="宋体";
			this.comboBox2.Text="正常";
			this.comboBox3.Text="32";			
			Font NewFont=new Font("宋体",32,FontStyle.Regular);
			this.textBox1.Font=NewFont;
			this.textBox1.ForeColor=Color.Black;
		}
		private void comboBox4_MeasureItem(object sender, System.Windows.Forms.MeasureItemEventArgs e)
		{//设置列表项宽
			e.ItemHeight=this.comboBox4.ItemHeight-2;		
		}
		private void comboBox4_DrawItem(object sender, System.Windows.Forms.DrawItemEventArgs e)
		{//绘制列表项
			ComboBox MyCombox=(ComboBox)sender;
			if(e.Index==-1)
				return;
			if(sender==null)
				return;
			SolidBrush MyBrush=(SolidBrush)MyCombox.Items[e.Index];
			Graphics g=e.Graphics;
			//如果已经进行选择，则绘制正确的背景颜色和聚集框
			e.DrawBackground();
			e.DrawFocusRectangle();
			//绘制颜色的预览框
			Rectangle MyRect=e.Bounds;
			MyRect.Offset(2,2);
			MyRect.Width=50;
			MyRect.Height-=4;
			g.DrawRectangle(new Pen(e.ForeColor),MyRect);
			//获取选定颜色的相应画刷对象，并填充预览框
			MyRect.Offset(1,1);
			MyRect.Width-=2;
			MyRect.Height-=2;
			g.FillRectangle(MyBrush,MyRect);
			//绘制选定颜色的名称
			g.DrawString(MyBrush.Color.Name.ToString(),Font,
				new SolidBrush(e.ForeColor),e.Bounds.X+60,e.Bounds.Y+1);		
		}

		private void comboBox1_SelectedIndexChanged(object sender, System.EventArgs e)
		{//改变样例文字显示风格
			if(this.comboBox4.SelectedIndex>=0)
			{
				SolidBrush MyBrush=(SolidBrush)(this.comboBox4.SelectedItem);
			    this.textBox1.ForeColor=MyBrush.Color;			
			}
            FontStyle MyFontStyle=FontStyle.Regular;
			if(this.comboBox2.Text=="加粗")
				MyFontStyle=FontStyle.Bold;
			else if(this.comboBox2.Text=="倾斜")
				MyFontStyle=FontStyle.Italic;
			else if(this.comboBox2.Text=="正常")
				MyFontStyle=FontStyle.Regular;
			else if(this.comboBox2.Text=="删除线")
				MyFontStyle=FontStyle.Strikeout;
			else if(this.comboBox2.Text=="下划线")
				MyFontStyle=FontStyle.Underline;		
			int MySize=32;
			if(this.comboBox3.Text.Length>1)
			{
				MySize=Convert.ToInt32(this.comboBox3.Text);
			}			
			Font NewFont=new Font(this.comboBox1.Text,MySize,MyFontStyle);
			this.textBox1.Font=NewFont;			
		}

        private void button1_Click(object sender, EventArgs e)
        {
            string str = "";
            foreach (object obj in comboBox1.Items)
            {
                str += obj.ToString() + ";";
            }

            MessageBox.Show("Save InstalledFont Success!");
            System.IO.File.WriteAllText(String.Format("{0}/InstalledFont_{1}.txt",AppDomain.CurrentDomain.BaseDirectory,DateTime.Now.ToString("yyyyMMddHHmmfff")), str.Substring(0,str.Length-1));
        }
	}
}
