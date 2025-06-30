import React, { useState, useRef, useEffect } from "react";
import CommandParser from "./CommandParser.jsx";
import machines from "../data/machines.js";
import missions from "../data/missions.js";

export default function Terminal() {
  const [lines, setLines] = useState([
    <span key={0}>Welcome to Hacker Sim!</span>,
    <span key={1}>Type 'help' to see available commands.</span>,
    <span key={2}></span>
  ]);
  const [input, setInput] = useState("");
  const [currentMachine, setCurrentMachine] = useState("192.168.1.100"); // Start on Kali
  const [cwd, setCwd] = useState(["home", "hacker"]); // Start in /home/hacker
  const [currentMission, setCurrentMission] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([]);
  const inputRef = useRef(null);
  const [settings, setSettings] = useState({
    history: true,
    autocomplete: true,
    promptStyle: "[{hostname}] {cwd}> "
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  function handleCommand(cmd) {
    let output = CommandParser({
      command: cmd,
      cwd,
      setCwd,
      currentMachine,
      setCurrentMachine,
      settings,
      setSettings
    });

    // Mission completion check (only for 'cat' command)
    const mission = missions[currentMission];
    if (
      mission &&
      cmd.startsWith("cat ") &&
      currentMachine === mission.targetMachine &&
      cwd.join("/") === mission.flagPath.slice(0, -1).join("/") &&
      cmd.split(" ")[1] === mission.flagPath[mission.flagPath.length - 1] &&
      output === mission.flagValue
    ) {
      setCompletedMissions([...completedMissions, currentMission]);
      setCurrentMission(currentMission + 1);
      output += `\n\n🎉 Mission Complete: ${mission.title}!\nType 'help' for your next objective.`;
    }

    if (output === "__CLEAR__") {
      setLines([]);
      return;
    }
    setLines((prev) => [
      ...prev,
      <span key={prev.length}>&gt; {cmd}</span>,
      <span key={prev.length + 1}>{output}</span>,
      <span key={prev.length + 2}></span>
    ]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  }

  // Show hostname and cwd in prompt, using customizable prompt style
  const hostname = machines[currentMachine]?.hostname || currentMachine;
  const cwdStr = cwd.join("/");
  const prompt = settings.promptStyle
    .replace("{hostname}", hostname)
    .replace("{cwd}", cwdStr);

  // Mission panel
  const mission = missions[currentMission];
  return (
    <div>
      {/* Mission panel above the terminal frame */}
      <div className="mission-panel" style={{ background: "#222", color: "#fff", padding: "1em", margin: "40px auto 24px auto", borderRadius: "8px", maxWidth: 740 }}>
        {mission ? (
          <>
            <h3>Mission: {mission.title}</h3>
            <p>{mission.description}</p>
            <ul>
              {mission.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </>
        ) : (
          <h3>All missions complete! 🎉</h3>
        )}
      </div>
      <div className="terminal-frame">
        <div className="terminal-titlebar">
          <div className="window-buttons">
            <span className="window-btn close"></span>
            <span className="window-btn min"></span>
            <span className="window-btn max"></span>
          </div>
          <span className="terminal-title">kali@kali: ~</span>
        </div>
        <div
          className={`terminal theme-${settings.theme || "default"}`}
          tabIndex={0}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <span>
              {prompt}
              <span className="terminal-input-fake">
                {input}
                <span className="terminal-cursor">&nbsp;</span>
              </span>
            </span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              autoComplete="off"
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
              }}
              tabIndex={-1}
            />
          </form>
        </div>
      </div>
    </div>
  );
}