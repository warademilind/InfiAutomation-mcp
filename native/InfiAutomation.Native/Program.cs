using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.Json;
using FlaUI.Core;
using FlaUI.Core.AutomationElements;
using FlaUI.Core.Definitions;
using FlaUI.Core.Input;
using FlaUI.Core.WindowsAPI;
using FlaUI.UIA3;

namespace InfiAutomation.Native;

internal static class Program
{
    static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    static UIA3Automation Uia = null!;
    static readonly HashSet<int> Owned = new();
    sealed class MissingElement(string message) : Exception(message);
    [STAThread]
    static void Main()
    {
        using var desktopLease = new Mutex(false, "Local\\InfiAutomation.DesktopAutomation.v1");
        try { if (!desktopLease.WaitOne(0)) { Console.Error.WriteLine("Another InfiAutomation native session owns this desktop. Close it before opening a new session."); return; } } catch (AbandonedMutexException) { }
        Console.InputEncoding = System.Text.Encoding.UTF8;
        Console.OutputEncoding = new System.Text.UTF8Encoding(false);
        if (Environment.GetEnvironmentVariable("INFIAUTOMATION_DEBUG_NATIVE") == "1") Console.Error.WriteLine("Initializing UIA3");
        using var uia = new UIA3Automation(); Uia = uia;
        if (Environment.GetEnvironmentVariable("INFIAUTOMATION_DEBUG_NATIVE") == "1") Console.Error.WriteLine("Worker ready");
        string? line;
        while ((line = Console.ReadLine()) != null)
        {
            int id = 0;
            try
            {
                using var document = JsonDocument.Parse(line);
                var request = document.RootElement; id = Int(request, "id"); if (Environment.GetEnvironmentVariable("INFIAUTOMATION_DEBUG_NATIVE") == "1") Console.Error.WriteLine("Request " + id + ": " + Str(request,"command"));
                object? data = Handle(request);
                Console.WriteLine(JsonSerializer.Serialize(new { id, ok = true, data }, JsonOptions));
            }
            catch (Exception ex)
            {
                Console.WriteLine(JsonSerializer.Serialize(new { id, ok = false, error = ex.Message, code = ex is MissingElement ? "LOCATOR_NOT_FOUND" : "NATIVE_ERROR" }, JsonOptions));
            }
        }
    }
    static string? Str(JsonElement j, string key) => j.TryGetProperty(key, out var v) && v.ValueKind != JsonValueKind.Null ? v.ValueKind == JsonValueKind.String ? v.GetString() : v.ToString() : null;
    static int Int(JsonElement j, string key, int fallback = 0) => j.TryGetProperty(key, out var v) && v.ValueKind == JsonValueKind.Number ? v.GetInt32() : fallback;
    static bool Bool(JsonElement j, string key, bool fallback = false) => j.TryGetProperty(key, out var v) ? v.ValueKind == JsonValueKind.True || (v.ValueKind != JsonValueKind.False && fallback) : fallback;
    static T Safe<T>(Func<T> get, T fallback) { try { return get(); } catch { return fallback; } }
    static string Name(AutomationElement e) => Safe(() => e.Name, "");
    static string Type(AutomationElement e) => Safe(() => e.ControlType.ToString(), "");
    static AutomationElement[] Windows(int pid) => Uia.GetDesktop().FindAllChildren(cf => cf.ByProcessId(pid).And(cf.ByControlType(ControlType.Window)));
    static AutomationElement Root(JsonElement r)
    {
        var pid = Int(r, "pid");
        var title = Str(r, "windowTitle");
        var windows = pid > 0 ? Windows(pid) : Uia.GetDesktop().FindAllChildren().Where(e => Type(e) == "Window").ToArray();
        if (!string.IsNullOrEmpty(title))
        {
            var matches = windows.Where(w => Name(w).Contains(title, StringComparison.OrdinalIgnoreCase)).ToArray();
            if (matches.Length != 1) throw new Exception("Window title must identify exactly one window; matched " + matches.Length);
            return matches[0];
        }
        if (windows.Length == 0) throw new Exception("Application has no accessible window. Check PID, interactive desktop, and app privileges.");
        return windows.OrderByDescending(w => Safe(() => w.BoundingRectangle.Width * w.BoundingRectangle.Height, 0.0)).First();
    }
    static object Handle(JsonElement r)
    {
        var command = Str(r, "command");
        if (command == "start") return Start(r);
        if (command == "close")
        {
            int pid = Int(r, "pid");
            if (Bool(r, "owned") && Owned.Remove(pid))
            {
                var process = Process.GetProcessById(pid);
                process.CloseMainWindow();
                // Never kill an attached process or a whole process tree.
                if (!process.WaitForExit(2500)) process.Kill();
            }
            return new { closed = true };
        }
        var root = Root(r);
        if (command == "focusWindow") { root.Focus(); return new { title = Name(root) }; }
        if (command == "snapshot") return Snapshot(r, root);
        if (command == "screenshot")
        {
            var rect = root.BoundingRectangle;
            if (rect.Width <= 0 || rect.Height <= 0) throw new Exception("Window is minimized or has no screenshot bounds");
            var path = Str(r, "path") ?? throw new Exception("Missing screenshot path");
            root.Focus(); Thread.Sleep(100);
            using var bitmap = new Bitmap((int)rect.Width, (int)rect.Height);
            using var graphics = Graphics.FromImage(bitmap);
            graphics.CopyFromScreen((int)rect.Left, (int)rect.Top, 0, 0, bitmap.Size);
            bitmap.Save(path, ImageFormat.Png); return new { path };
        }
        if (command == "menus") return DiscoverMenus(r, root);
        if (command == "action") return Action(r, root, r.GetProperty("step"));
        throw new Exception("Unknown command: " + command);
    }
    static object Start(JsonElement r)
    {
        int pid = Int(r, "pid"); bool owned = false;
        string? executable = Str(r, "executable");
        if (!string.IsNullOrEmpty(executable))
        {
            var start = new ProcessStartInfo(executable) { UseShellExecute = true };
            var cwd = Str(r, "cwd"); if (!string.IsNullOrEmpty(cwd)) start.WorkingDirectory = cwd;
            if (r.TryGetProperty("args", out var args)) foreach (var arg in args.EnumerateArray()) start.ArgumentList.Add(arg.GetString()!);
            var process = Process.Start(start) ?? throw new Exception("Could not launch application");
            pid = process.Id; owned = true;
            var watch = Stopwatch.StartNew();
            var processName = Path.GetFileNameWithoutExtension(executable);
            while (watch.ElapsedMilliseconds < Int(r, "timeoutMs", 10000))
            {
                if (Windows(pid).Length > 0) break;
                if (processName.Equals("calc", StringComparison.OrdinalIgnoreCase))
                {
                    var candidates = Process.GetProcesses().Where(p => p.ProcessName.Contains("Calculator", StringComparison.OrdinalIgnoreCase) && Windows(p.Id).Length > 0).ToArray();
                    if (candidates.Length == 1) { pid = candidates[0].Id; owned = false; break; }
                }
                Thread.Sleep(200);
            }
            if (Windows(pid).Length == 0) throw new Exception("Launched process has no accessible window; attach using the actual UI PID or window title");
            if (owned) Owned.Add(pid);
        }
        else if (pid == 0)
        {
            var root = Root(r); pid = root.Properties.ProcessId.Value;
        }
        return new { pid, owned, windows = Windows(pid).Select(w => new { title = Name(w), handle = Safe(() => w.Properties.NativeWindowHandle.Value.ToInt64(), 0L) }) };
    }
    static List<AutomationElement> Elements(AutomationElement root, int maxNodes = 3000)
    {
        var result = new List<AutomationElement>();
        void Walk(AutomationElement e, int depth)
        {
            if (result.Count >= maxNodes || depth > 32) return;
            result.Add(e);
            foreach (var child in Safe(() => e.FindAllChildren(), Array.Empty<AutomationElement>())) Walk(child, depth + 1);
        }
        Walk(root, 0); return result;
    }
    static bool Matches(AutomationElement e, JsonElement loc)
    {
        bool Eq(string key, string actual) => Str(loc, key) is not { } expected || expected == actual;
        return Eq("name", Name(e)) && Eq("text", Name(e)) && Eq("automationId", Safe(() => e.AutomationId, ""))
            && Eq("controlType", Type(e)) && Eq("role", Type(e).ToLowerInvariant()) && Eq("className", Safe(() => e.ClassName, ""));
    }
    static AutomationElement Find(JsonElement r, AutomationElement root, JsonElement loc, int timeout)
    {
        var title = Str(loc, "windowTitle");
        if (!string.IsNullOrEmpty(title))
        {
            var matches = Windows(Int(r, "pid")).Where(w => Name(w).Contains(title, StringComparison.OrdinalIgnoreCase)).ToArray();
            if (matches.Length != 1) throw new Exception("Locator windowTitle must match exactly one window");
            root = matches[0];
        }
        var watch = Stopwatch.StartNew();
        do
        {
            var matches = Elements(root).Where(e => Matches(e, loc)).ToArray();
            if (matches.Length == 1) return matches[0];
            if (matches.Length > 1) throw new Exception("Ambiguous locator matched " + matches.Length + " controls");
            Thread.Sleep(100);
        } while (watch.ElapsedMilliseconds < timeout);
        throw new MissingElement("Locator matched no native control: " + loc);
    }
    static object Snapshot(JsonElement r, AutomationElement root)
    {
        int max = Math.Clamp(Int(r, "maxNodes", 500), 1, 5000), depth = Math.Clamp(Int(r, "depth", 8), 1, 32);
        var nodes = new List<object>(); bool truncated = false;
        void Walk(AutomationElement e, int d, string path)
        {
            if (nodes.Count >= max) { truncated = true; return; }
            nodes.Add(new { name = Name(e), role = Type(e).ToLowerInvariant(), controlType = Type(e), automationId = Safe(() => e.AutomationId, ""), className = Safe(() => e.ClassName, ""), enabled = Safe(() => e.IsEnabled, false), visible = !Safe(() => e.IsOffscreen, true), value = Safe(() => e.Patterns.Value.Pattern.Value.Value, ""), depth = d, path });
            var children = Safe(() => e.FindAllChildren(), Array.Empty<AutomationElement>());
            if (d >= depth) { if (children.Length > 0) truncated = true; return; }
            for (int i = 0; i < children.Length; i++) Walk(children[i], d + 1, path + "/" + i);
        }
        foreach (var window in Windows(Int(r, "pid"))) Walk(window, 0, Name(window));
        return new { title = Name(root), nodes, truncated, windows = Windows(Int(r, "pid")).Select(w => new { title = Name(w) }) };
    }
    static void Press(string value)
    {
        var aliases = new Dictionary<string, VirtualKeyShort>(StringComparer.OrdinalIgnoreCase) {
            ["Control"] = VirtualKeyShort.CONTROL, ["Ctrl"] = VirtualKeyShort.CONTROL, ["Alt"] = VirtualKeyShort.ALT,
            ["Shift"] = VirtualKeyShort.SHIFT, ["Meta"] = VirtualKeyShort.LWIN, ["Enter"] = VirtualKeyShort.RETURN,
            ["Escape"] = VirtualKeyShort.ESCAPE, ["ArrowDown"] = VirtualKeyShort.DOWN, ["ArrowUp"] = VirtualKeyShort.UP,
            ["ArrowRight"] = VirtualKeyShort.RIGHT, ["ArrowLeft"] = VirtualKeyShort.LEFT, ["Space"] = VirtualKeyShort.SPACE,
            ["Backspace"] = VirtualKeyShort.BACK, ["Delete"] = VirtualKeyShort.DELETE, ["Tab"] = VirtualKeyShort.TAB
        };
        var parts = value.Split('+');
        var keys = parts.Select(p => aliases.TryGetValue(p, out var key) ? key :
            Enum.TryParse<VirtualKeyShort>(p.Length == 1 && char.IsLetterOrDigit(p[0]) ? "KEY_" + p.ToUpperInvariant() : p.ToUpperInvariant(), out var parsed) ? parsed : throw new Exception("Unknown key: " + p)).ToArray();
        Keyboard.TypeSimultaneously(keys);
    }
    static object Action(JsonElement r, AutomationElement root, JsonElement step)
    {
        string action = Str(step, "action") ?? "";
        string value = Str(step, "value") ?? "";
        int timeout = Int(step, "timeoutMs", Int(r, "timeoutMs", 10000));
        bool contains = Bool(step, "contains");
        if (action == "navigate") throw new Exception("navigate is supported for web/Electron targets");
        if (action == "focusWindow") { root.Focus(); return new { focused = true }; }
        if (action == "assertTitle") { Assert(Name(root), value, contains); return new { actual = Name(root) }; }
        if (action == "menu")
        {
            foreach (var part in step.GetProperty("menuPath").EnumerateArray())
            {
                // Search only the target process, including transient popup windows.
                var menus = Windows(Int(r, "pid")).SelectMany(w => Elements(w)).Where(e => Type(e) == "MenuItem" && Name(e).Replace("&", "") == part.GetString()).ToArray();
                if (menus.Length != 1) throw new MissingElement("Menu path item must match exactly one live item: " + part.GetString());
                menus[0].Click(); Thread.Sleep(120);
            }
            return new { selected = true };
        }
        if (action == "press" && !step.TryGetProperty("locator", out _)) { root.Focus(); Press(value); return new { pressed = true }; }
        var loc = step.GetProperty("locator");
        if (action == "assertCount") { var count = Elements(root).Count(e => Matches(e, loc)); Assert(count.ToString(), value, false); return new { actual = count }; }
        if (action == "assertVisible" && value == "False") {
            var visible = Elements(root).Any(e => Matches(e, loc) && !Safe(() => e.IsOffscreen, true));
            Assert(visible.ToString(), "False", false); return new { actual = visible };
        }
        var element = Find(r, root, loc, timeout);
        if (action.StartsWith("assert") || action == "waitFor")
        {
            var watch = Stopwatch.StartNew(); string actual;
            do {
                actual = action switch {
                    "assertText" => Name(element),
                    "assertValue" => element.Patterns.Value.IsSupported ? element.Patterns.Value.Pattern.Value.Value : element.Patterns.RangeValue.IsSupported ? element.Patterns.RangeValue.Pattern.Value.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : Name(element),
                    "assertEnabled" => element.IsEnabled.ToString(),
                    "assertChecked" => (element.Patterns.Toggle.Pattern.ToggleState.Value == ToggleState.On).ToString(),
                    "assertVisible" or "waitFor" => (!element.IsOffscreen).ToString(),
                    _ => throw new Exception("Unsupported assertion: " + action)
                };
                var expected = action == "waitFor" || ((action is "assertVisible" or "assertEnabled" or "assertChecked") && value == "") ? "True" : value;
                if (actual.Equals(expected, StringComparison.Ordinal) || (contains && actual.Contains(expected, StringComparison.Ordinal))) return new { actual };
                Thread.Sleep(100);
            } while (watch.ElapsedMilliseconds < timeout);
            throw new Exception("Assertion failed: expected " + value + ", received " + actual);
        }
        switch (action)
        {
            case "click": element.Click(); break;
            case "doubleClick": element.DoubleClick(); break;
            case "hover": Mouse.MoveTo(new Point((int)(element.BoundingRectangle.Left + element.BoundingRectangle.Width / 2), (int)(element.BoundingRectangle.Top + element.BoundingRectangle.Height / 2))); break;
            case "fill":
                if (element.Patterns.Value.IsSupported) element.Patterns.Value.Pattern.SetValue(value);
                else { element.Focus(); Keyboard.TypeSimultaneously(VirtualKeyShort.CONTROL, VirtualKeyShort.KEY_A); Keyboard.Type(value); }
                break;
            case "press": element.Focus(); Press(value); break;
            case "select": element.AsComboBox().Select(value); break;
            case "setRange": element.AsSlider().Value = double.Parse(value, System.Globalization.CultureInfo.InvariantCulture); break;
            case "check": case "uncheck":
                var toggle = element.Patterns.Toggle.Pattern; var desired = action == "check" ? ToggleState.On : ToggleState.Off;
                if (toggle.ToggleState.Value != desired) toggle.Toggle();
                if (toggle.ToggleState.Value != desired) throw new Exception("Control did not reach desired toggle state");
                break;
            default: throw new Exception("Unsupported native action: " + action);
        }
        return new { completed = true };
    }
    static void Assert(string actual, string expected, bool contains)
    {
        if (!(contains ? actual.Contains(expected, StringComparison.Ordinal) : actual == expected)) throw new Exception("Assertion failed: expected " + expected + ", received " + actual);
    }
    static object DiscoverMenus(JsonElement r, AutomationElement root)
    {
        int depth = Math.Clamp(Int(r, "depth", 6), 1, 12), max = Math.Clamp(Int(r, "maxNodes", 1500), 1, 3000), count = 0;
        var errors = new List<string>();
        var visited = new HashSet<string>();
        List<object> Read(AutomationElement parent, int d, string path)
        {
            var result = new List<object>();
            if (d > depth) return result;
            foreach (var e in Safe(() => parent.FindAllChildren(), Array.Empty<AutomationElement>()))
            {
                if (count >= max) break;
                string type = Type(e), name = Name(e);
                if (type is not ("Menu" or "MenuBar" or "MenuItem")) { result.AddRange(Read(e, d + 1, path)); continue; }
                count++; string key = path + "/" + name;
                if (!visited.Add(key)) continue;
                bool expandedByUs = false;
                try {
                    if (e.Patterns.ExpandCollapse.IsSupported && e.Patterns.ExpandCollapse.Pattern.ExpandCollapseState.Value == ExpandCollapseState.Collapsed) {
                        e.Patterns.ExpandCollapse.Pattern.Expand(); expandedByUs = true; Thread.Sleep(100);
                    }
                    result.Add(new { name, controlType = type, enabled = Safe(() => e.IsEnabled, false), path = key, children = Read(e, d + 1, key) });
                } catch (Exception ex) { errors.Add(key + ": " + ex.Message); }
                finally { if (expandedByUs) try { e.Patterns.ExpandCollapse.Pattern.Collapse(); } catch { } }
            }
            return result;
        }
        return new { source = "live-windows-uia", items = Read(root, 0, ""), count, truncated = count >= max, errors, note = "Only real UI Automation nodes. ExpandCollapse used when supported; leaf commands are never invoked. Use ui_action menu paths for lazy or non-UIA menus." };
    }
}
