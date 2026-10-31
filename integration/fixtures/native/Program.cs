using System.Windows.Forms;
namespace TestWeaveFixture;
static class Program {
  [STAThread] static void Main() {
    ApplicationConfiguration.Initialize();
    var form=new Form {Text="TestWeave Native Lab",Width=740,Height=540,StartPosition=FormStartPosition.CenterScreen};
    var menu=new MenuStrip {Name="MainMenu",AccessibleName="Main menu"};
    var file=new ToolStripMenuItem("File");var export=new ToolStripMenuItem("Export");
    export.DropDownItems.Add(new ToolStripMenuItem("Export JSON"));file.DropDownItems.Add(export);file.DropDownItems.Add("Open");menu.Items.Add(file);form.MainMenuStrip=menu;form.Controls.Add(menu);
    var field=new TextBox {Name="ProjectName",AccessibleName="Project name",Left=40,Top=80,Width=300};
    var check=new CheckBox {Name="Notifications",AccessibleName="Enable notifications",Text="Enable notifications",Left=40,Top=130,Width=250};
    var status=new Label {Name="Status",Text="Ready",Left=40,Top=240,Width=500};
    var save=new Button {Name="SaveProject",AccessibleName="Save project",Text="Save project",Left=40,Top=185,Width=160,Height=36};
    save.Click+=(s,e)=>status.Text="Saved "+field.Text;
    var slider=new TrackBar {Name="Volume",AccessibleName="Volume",Left=40,Top=300,Width=300,Minimum=0,Maximum=100};
    form.Controls.AddRange([field,check,status,save,slider]);Application.Run(form);
  }
}
