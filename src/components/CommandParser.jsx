import machines from "../data/machines.js";

function getService(port) {
  const services = {
    22: "ssh",
    80: "http",
    443: "https",
    3306: "mysql",
    445: "microsoft-ds",
    3389: "ms-wbt-server",
    548: "afp"
  };
  return services[port] || "unknown";
}

export default function CommandParser({
  command,
  cwd,
  setCwd,
  currentMachine,
  setCurrentMachine,
  settings,
  setSettings
}) {
  function getDir(path) {
    let dir = machines[currentMachine].filesystem;
    for (const part of path) {
      if (dir[part] && typeof dir[part] === "object") dir = dir[part];
      else return null;
    }
    return dir;
  }

  const [cmd, ...args] = command.trim().split(" ");
  let output = "";

  switch (cmd) {
    case "help":
      output =
        "Available commands: help, ls, cd, cat, clear, pwd, echo, whoami, date, mkdir, touch, ifconfig, ip, nmap, ping, uname, man, sudo, exit, ssh, settings";
      break;
    case "ls": {
      const dir = getDir(cwd);
      if (dir && typeof dir === "object") {
        output = Object.keys(dir).join("    ");
      } else {
        output = "Directory not found.";
      }
      break;
    }
    case "cd": {
      if (!args[0]) {
        output = "Usage: cd <directory>";
        break;
      }
      if (args[0] === "..") {
        if (cwd.length > 1) setCwd(cwd.slice(0, -1));
        output = "";
        break;
      }
      const dir = getDir([...cwd, args[0]]);
      if (dir && typeof dir === "object") {
        setCwd([...cwd, args[0]]);
        output = "";
      } else {
        output = "No such directory.";
      }
      break;
    }
    case "cat": {
      if (!args[0]) {
        output = "Usage: cat <file>";
        break;
      }
      const dir = getDir(cwd);
      if (dir && dir[args[0]] && typeof dir[args[0]] === "string") {
        output = dir[args[0]];
      } else {
        output = "File not found.";
      }
      break;
    }
    case "pwd": {
      output = "/" + cwd.join("/");
      break;
    }
    case "echo": {
      output = args.join(" ");
      break;
    }
    case "whoami": {
      output = "hacker";
      break;
    }
    case "date": {
      output = new Date().toString();
      break;
    }
    case "mkdir": {
      output = "mkdir is not implemented in this simulation.";
      break;
    }
    case "touch": {
      output = "touch is not implemented in this simulation.";
      break;
    }
    case "ifconfig":
    case "ip": {
      output = "eth0: inet 192.168.1.100 netmask 255.255.255.0 ...";
      break;
    }
    case "nmap": {
      const target = args[0];
      if (!target) {
        output = "Usage: nmap <ip>";
        break;
      }
      const host = machines[target];
      if (!host) {
        output = `Nmap scan report for ${target}\nHost is down or not found.`;
        break;
      }
      output = `Nmap scan report for ${target} (${host.hostname})
Host is up (0.0010s latency).
PORT     STATE SERVICE
${(host.ports || []).map(port => `${port}/tcp  open  ${getService(port)}`).join("\n")}
`;
      break;
    }
    case "ssh": {
      const target = args[0];
      if (!target || !machines[target]) {
        output = "Usage: ssh <ip> (machine not found)";
        break;
      }
      setCurrentMachine(target);
      if (machines[target].os === "Windows 10") setCwd(["C:", "Users", "Admin"]);
      else if (machines[target].os === "macOS") setCwd(["Users", "alice"]);
      else setCwd(["home", "hacker"]);
      output = `Connected to ${target} (${machines[target].hostname})`;
      break;
    }
    case "ping": {
      output = `PING ${args[0] || "localhost"}: Not a real ping in this simulation.`;
      break;
    }
    case "uname": {
      output = "Linux kali-sim 5.10.0-9-amd64 x86_64 GNU/Linux";
      break;
    }
    case "man": {
      output = "Manual pages are not available in this simulation.";
      break;
    }
    case "sudo": {
      output = "You are already root in this simulation.";
      break;
    }
    case "exit": {
      output = "exit";
      break;
    }
    case "settings": {
      if (!args[0]) {
        output = `Settings:
- history: ${settings.history}
- autocomplete: ${settings.autocomplete}
- promptStyle: ${settings.promptStyle}
- theme: ${settings.theme || "default"}

Usage:
settings history on|off
settings autocomplete on|off
settings prompt <style>
settings theme <default|matrix|light|solarized>`;
        break;
      }
      if (args[0] === "history" && (args[1] === "on" || args[1] === "off")) {
        setSettings({ ...settings, history: args[1] === "on" });
        output = `Command history ${args[1] === "on" ? "enabled" : "disabled"}.`;
        break;
      }
      if (args[0] === "autocomplete" && (args[1] === "on" || args[1] === "off")) {
        setSettings({ ...settings, autocomplete: args[1] === "on" });
        output = `Autocomplete ${args[1] === "on" ? "enabled" : "disabled"}.`;
        break;
      }
      if (args[0] === "prompt" && args[1]) {
        setSettings({ ...settings, promptStyle: args.slice(1).join(" ") });
        output = `Prompt style set to: ${args.slice(1).join(" ")}`;
        break;
      }
      if (args[0] === "theme" && args[1]) {
        const themes = ["default", "matrix", "light", "solarized"];
        if (themes.includes(args[1])) {
          setSettings({ ...settings, theme: args[1] });
          output = `Theme set to: ${args[1]}`;
        } else {
          output = `Unknown theme. Available: ${themes.join(", ")}`;
        }
        break;
      }
      output = "Invalid settings command. Type 'settings' for usage.";
      break;
    }
    case "clear":
      output = "__CLEAR__";
      break;
    case "": 
     
  
    
  
    
      output = "";
      break;
    default:
      output = `Unknown command: ${cmd}`;
  }

  return output;
}