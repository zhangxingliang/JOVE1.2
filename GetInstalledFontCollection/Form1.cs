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
	/// Form1 ��ժҪ˵����
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
		/// ����������������
		/// </summary>
		private System.ComponentModel.Container components = null;

		public Form1()
		{
			//
			// Windows ���������֧���������
			//
			InitializeComponent();

			//
			// TODO: �� InitializeComponent ���ú�����κι��캯������
			//
		}

		/// <summary>
		/// ������������ʹ�õ���Դ��
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

		#region Windows ������������ɵĴ���
		/// <summary>
		/// �����֧������ķ��� - ��Ҫʹ�ô���༭���޸�
		/// �˷��������ݡ�
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
            this.label1.Text = "ѡ�����壺";
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
            this.label2.Text = "ѡ�����ͣ�";
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
            this.label3.Text = "ѡ���ֺţ�";
            // 
            // label4
            // 
            this.label4.Location = new System.Drawing.Point(8, 32);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(72, 16);
            this.label4.TabIndex = 6;
            this.label4.Text = "ѡ����ɫ��";
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
            this.textBox1.Text = "����ʵ��";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(72, 60);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(144, 23);
            this.button1.TabIndex = 11;
            this.button1.Text = "��ȡ��������";
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
            this.Text = "��ʾ��ȡϵͳ�Ѿ���װ������";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

		}
		#endregion

		/// <summary>
		/// Ӧ�ó��������ڵ㡣
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

			//��ȡϵͳ�Ѿ���װ������
			InstalledFontCollection MyFont=new InstalledFontCollection();
			FontFamily[] MyFontFamilies=MyFont.Families;
			int Count=MyFontFamilies.Length;
			for(int i=0;i<Count;i++)
			{
				string FontName=MyFontFamilies[i].Name;
				this.comboBox1.Items.Add(FontName);
			}
			//�����������б�
			string []MyStyle=new string[]{"�Ӵ�","��б","����","ɾ����","�»���"};
			for(int i=0;i<5;i++)
			{
				string StyleName=MyStyle[i];
				this.comboBox2.Items.Add(StyleName);
			}	
			//���������С�б�
			float []MySize=new float[]{1,2,4,6,8,10,12,16,18,20,22,24,32,36,48,64,72};
			foreach(float f in MySize)
			{
				this.comboBox3.Items.Add(f);
			}
			//������ɫ�б�ֵ
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
			this.comboBox1.Text="����";
			this.comboBox2.Text="����";
			this.comboBox3.Text="32";			
			Font NewFont=new Font("����",32,FontStyle.Regular);
			this.textBox1.Font=NewFont;
			this.textBox1.ForeColor=Color.Black;
		}
		private void comboBox4_MeasureItem(object sender, System.Windows.Forms.MeasureItemEventArgs e)
		{//�����б����
			e.ItemHeight=this.comboBox4.ItemHeight-2;		
		}
		private void comboBox4_DrawItem(object sender, System.Windows.Forms.DrawItemEventArgs e)
		{//�����б���
			ComboBox MyCombox=(ComboBox)sender;
			if(e.Index==-1)
				return;
			if(sender==null)
				return;
			SolidBrush MyBrush=(SolidBrush)MyCombox.Items[e.Index];
			Graphics g=e.Graphics;
			//����Ѿ�����ѡ���������ȷ�ı�����ɫ�;ۼ���
			e.DrawBackground();
			e.DrawFocusRectangle();
			//������ɫ��Ԥ����
			Rectangle MyRect=e.Bounds;
			MyRect.Offset(2,2);
			MyRect.Width=50;
			MyRect.Height-=4;
			g.DrawRectangle(new Pen(e.ForeColor),MyRect);
			//��ȡѡ����ɫ����Ӧ��ˢ���󣬲����Ԥ����
			MyRect.Offset(1,1);
			MyRect.Width-=2;
			MyRect.Height-=2;
			g.FillRectangle(MyBrush,MyRect);
			//����ѡ����ɫ������
			g.DrawString(MyBrush.Color.Name.ToString(),Font,
				new SolidBrush(e.ForeColor),e.Bounds.X+60,e.Bounds.Y+1);		
		}

		private void comboBox1_SelectedIndexChanged(object sender, System.EventArgs e)
		{//�ı�����������ʾ���
			if(this.comboBox4.SelectedIndex>=0)
			{
				SolidBrush MyBrush=(SolidBrush)(this.comboBox4.SelectedItem);
			    this.textBox1.ForeColor=MyBrush.Color;			
			}
            FontStyle MyFontStyle=FontStyle.Regular;
			if(this.comboBox2.Text=="�Ӵ�")
				MyFontStyle=FontStyle.Bold;
			else if(this.comboBox2.Text=="��б")
				MyFontStyle=FontStyle.Italic;
			else if(this.comboBox2.Text=="����")
				MyFontStyle=FontStyle.Regular;
			else if(this.comboBox2.Text=="ɾ����")
				MyFontStyle=FontStyle.Strikeout;
			else if(this.comboBox2.Text=="�»���")
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
