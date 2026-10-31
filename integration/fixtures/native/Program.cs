using System.Windows.Forms;
namespace InfiAutomationFixture;
static class Program {
  [STAThread] static void Main(string[] args) {
    ApplicationConfiguration.Initialize();
    if (args.Contains("--cover")) {
      var cover = new Form {Text="InfiAutomation occlusion fixture",Width=920,Height=680,StartPosition=FormStartPosition.CenterScreen,TopMost=true};
      cover.Controls.Add(new Label {Text="Owned test window covering the target",Dock=DockStyle.Fill,TextAlign=System.Drawing.ContentAlignment.MiddleCenter});
      cover.Shown += (s,e)=>{Console.WriteLine("cover-ready");Console.Out.Flush();};
      Application.Run(cover);return;
    }
    var form=new Form {Text="InfiAutomation Native Lab",Width=740,Height=540,StartPosition=FormStartPosition.CenterScreen};
    Label? feedback = null;
    var menu=new MenuStrip {Name="MainMenu",AccessibleName="Main menu"};
    var file=new ToolStripMenuItem("File");var export=new ToolStripMenuItem("Export");
    export.DropDownItems.Add(new ToolStripMenuItem("Export JSON",null,(s,e)=>{if(feedback!=null)feedback.Text="Export ready";}));file.DropDownItems.Add(export);file.DropDownItems.Add("Open");menu.Items.Add(file);form.MainMenuStrip=menu;form.Controls.Add(menu);
    var field=new TextBox {Name="ProjectName",AccessibleName="Project name",Left=40,Top=80,Width=300};
    var check=new CheckBox {Name="Notifications",AccessibleName="Enable notifications",Text="Enable notifications",Left=40,Top=130,Width=250};
    var status=new Label {Name="Status",Text="Ready",Left=40,Top=240,Width=500};
    feedback = status;
    var save=new Button {Name="SaveProject",AccessibleName="Save project",Text="Save project",Left=40,Top=185,Width=160,Height=36};
    save.Click+=(s,e)=>status.Text="Saved "+field.Text;
    var slider=new TrackBar {Name="Volume",AccessibleName="Volume",Left=40,Top=300,Width=300,Minimum=0,Maximum=100};
    form.Controls.AddRange([field,check,status,save,slider]);Application.Run(form);
  }
}
