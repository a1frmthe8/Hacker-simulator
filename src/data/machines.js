// Windows 10 template
const windowsTemplate = {
  "C:": {
    "Users": {
      "Admin": {
        "Desktop": {
          "readme.txt": "Welcome to your Windows desktop!",
          "todo.txt": "1. Update antivirus\n2. Backup files\n3. Check emails"
        },
        "Documents": {
          "work.docx": "Confidential work document.",
          "notes.txt": "Remember to change your password regularly."
        },
        "Downloads": {
          "setup.exe": "Fake installer file.",
          "manual.pdf": "User manual PDF."
        },
        "Pictures": {},
        "Music": {},
        "Videos": {},
        "AppData": {
          "Roaming": {
            "Microsoft": {
              "Windows": {
                "Recent": {
                  "recentfiles.lnk": "Shortcut to recent files"
                }
              }
            }
          },
          "Local": {
            "Temp": {
              "tempfile.tmp": "Temporary file"
            }
          }
        }
      }
    },
    "Windows": {
      "System32": {
        "cmd.exe": "Windows Command Prompt",
        "drivers": {
          "etc": {
            "hosts": "127.0.0.1 localhost\n192.168.1.10 win10-pc"
          }
        },
        "config": {
          "system.ini": "[boot]\nshell=explorer.exe"
        }
      },
      "Temp": {
        "winlog.txt": "Windows log file"
      }
    },
    "Program Files": {
      "Common Files": {},
      "Internet Explorer": {
        "iexplore.exe": "Internet Explorer executable"
      },
      "Windows Defender": {
        "MsMpEng.exe": "Windows Defender engine"
      }
    }
  }
};

// macOS template
const macTemplate = {
  "Users": {
    "alice": {
      "Desktop": {
        "welcome.txt": "Welcome to your Mac desktop!",
        "project.md": "# Project Notes\n- Finish the report\n- Email Bob"
      },
      "Documents": {
        "resume.pdf": "Alice's Resume",
        "ideas.txt": "App ideas:\n- Note taker\n- Budget tracker"
      },
      "Downloads": {
        "installer.pkg": "Fake installer package"
      },
      "Pictures": {},
      "Music": {},
      "Library": {
        "Application Support": {
          "appdata.json": '{"theme":"dark","autosave":true}'
        },
        "Caches": {
          "cache.db": "Cache database"
        }
      }
    }
  },
  "Applications": {
    "Safari.app": "Safari Browser",
    "Mail.app": "Mail"
  },
  "System": {
    "Library": {
      "Preferences": {
        "com.apple.finder.plist": "Finder preferences"
      }
    },
    "bin": {
      "bash": "Bash shell",
      "zsh": "Zsh shell"
    }
  }
};

// Kali Linux template
const kaliTemplate = {
  home: {
    hacker: {
      Desktop: {
        "start-here.txt": "Try scanning the network with nmap.",
        "exploit.py": "#!/usr/bin/python3\nprint('Exploit script')"
      },
      Documents: {
        "pentest-notes.txt": "1. Scan all hosts\n2. Check for open ports\n3. Look for flags"
      },
      Downloads: {
        "exploit-db.txt": "Exploit database dump"
      },
      Pictures: {},
      Music: {},
      ".ssh": {
        "id_rsa": "PRIVATE KEY -- DO NOT SHARE",
        "id_rsa.pub": "PUBLIC KEY"
      }
    }
  },
  etc: {
    passwd: "root:x:0:0:root:/root:/bin/bash\nhacker:x:1000:1000:hacker:/home/hacker:/bin/bash",
    shadow: "root:*:19000:0:99999:7:::"
  },
  var: {
    log: {
      "auth.log": "Authentication logs",
      "syslog": "System log"
    }
  },
  usr: {
    bin: {
      "nmap": "Nmap network scanner",
      "hydra": "Hydra brute force tool"
    },
    share: {
      "man": {
        "man1": {
          "ls.1": "Manual page for ls"
        }
      }
    }
  },
  tmp: {
    "tempfile": "Temporary file"
  }
};

// Utility to deep clone an object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Utility to get all leaf directories in a filesystem object
function getAllLeafDirs(fs, path = []) {
  let leaves = [];
  for (const key in fs) {
    if (typeof fs[key] === "object" && fs[key] !== null) {
      const subLeaves = getAllLeafDirs(fs[key], [...path, key]);
      if (subLeaves.length) leaves.push(...subLeaves);
      else leaves.push([...path, key]);
    }
  }
  return leaves;
}

// Utility to inject a flag into a random leaf directory
function injectFlag(fs, flagValue, flagName = "flag.txt") {
  const leafDirs = getAllLeafDirs(fs);
  const randomDir = leafDirs[Math.floor(Math.random() * leafDirs.length)];
  let dir = fs;
  for (const part of randomDir) {
    dir = dir[part];
  }
  dir[flagName] = flagValue;
  return randomDir.concat(flagName); // Return full flag path
}

// Prepare filesystems and inject flags
const windowsFS = deepClone(windowsTemplate);
const macFS = deepClone(macTemplate);
const kaliFS = deepClone(kaliTemplate);

const winFlagPath = injectFlag(windowsFS, "FLAG{windows_flag}");
const macFlagPath = injectFlag(macFS, "FLAG{macos_flag}");
const kaliFlagPath = injectFlag(kaliFS, "FLAG{kali_flag}");

// Export machines with random flag locations
const machines = {
  "192.168.1.10": {
    hostname: "win10-pc",
    os: "Windows 10",
    filesystem: windowsFS,
    ports: [3389, 445],
    flagPath: winFlagPath
  },
  "192.168.1.15": {
    hostname: "macbook",
    os: "macOS",
    filesystem: macFS,
    ports: [22, 548],
    flagPath: macFlagPath
  },
  "192.168.1.100": {
    hostname: "kali",
    os: "Kali Linux",
    filesystem: kaliFS,
    ports: [22, 80],
    flagPath: kaliFlagPath
  }
};

export default machines;