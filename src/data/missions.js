const missions = [
  {
    id: 1,
    title: "Find the Windows Flag",
    description: "Use nmap to find the Windows machine, ssh into it, and read the flag on the Desktop.",
    steps: [
      "Scan the network to find the Windows machine.",
      "Connect to the Windows machine using ssh.",
      "Navigate to C:/Users/Admin/Desktop and read flag.txt."
    ],
    targetMachine: "192.168.1.10",
    flagPath: ["C:", "Users", "Admin", "Desktop", "flag.txt"],
    flagValue: "FLAG{windows_flag}"
  },
  {
    id: 2,
    title: "Get the macOS Flag",
    description: "Find the macOS machine, ssh in, and retrieve the flag from the Desktop.",
    steps: [
      "Scan the network to find the macOS machine.",
      "Connect to the macOS machine using ssh.",
      "Navigate to /Users/alice/Desktop and read flag.txt."
    ],
    targetMachine: "192.168.1.15",
    flagPath: ["Users", "alice", "Desktop", "flag.txt"],
    flagValue: "FLAG{macos_flag}"
  },
  {
    id: 3,
    title: "Capture the Kali Flag",
    description: "Access your own Kali machine and find the flag in your home directory.",
    steps: [
      "Navigate to /home/hacker.",
      "Read flag.txt."
    ],
    targetMachine: "192.168.1.100",
    flagPath: ["home", "hacker", "flag.txt"],
    flagValue: "FLAG{kali_flag}"
  }
];

export default missions;