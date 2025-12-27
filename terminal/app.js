document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  let inputEl = document.querySelector(".input");
  let input = "";
// hhhhhhh
const allCommands = {
  help: {
    locked: false,
    description: "Usage: help (command)",
    action: (args) => {
      if (args.length === 0) {
        const available = Object.entries(allCommands)
          .filter(([name, cmd]) => {
            // Show all normal unlocked commands
            if (!cmd.locked && !name.includes("?")) return true;
            // Show "?" commands only while locked
            if (name.includes("?") && cmd.locked) return true;
            return false;
          })
          .map(([name]) => name)
          .join(", ");
        return `Available commands: ${available}`;
      } else {
        const cmdName = args[0];
        if (allCommands[cmdName] && !allCommands[cmdName].locked) {
          return `${cmdName}: ${allCommands[cmdName].description}`;
        } else {
          return `No such command: ${cmdName}`;
        }
      }
    }
  },

  // Normal commands
  test: {
    locked: false,
    description: "test commands?? why???",
    action: (args) => {
      if (args[0]) unlockCommand(args[0]);
      return args[0] ? `${args[0]} works...` : "Usage: test (your guess of a command)";
    }
  },

  whoami: {
    locked: true,
    description: "who are you/",
    action: () => localStorage.getItem("name") || "guest"
  },

  set: {
    locked: true,
    description: "set stuff, like a name",
    action: (args) => {
      if (args.length >= 2) {
        localStorage.setItem(args[0], args.slice(1).join(" "));
        return `${args[0]} set to ${args.slice(1).join(" ")}`;
      }
      return "Usage: set <key> <value>";
    }
  },


  "is?r??": { locked: false, description: "what could this possibly mean?" },
  "ne?t?n?a??": { locked: false, description: "what could this possibly mean?" },
  "ki?r?": { locked: false, description: "what could this possibly mean?" },
  "s?t": { locked: false, description: "what could this possibly mean?" },


  kirk: { locked: true, description: "the neck/" },
  netanyahu: { locked: true, description: "the neck/" },
  israel: { locked: true, description: "the neck/" }
};

  // unlock commands
  const unlocked = JSON.parse(localStorage.getItem("unlocked")) || [];
  unlocked.forEach(cmd => {
    if (allCommands[cmd]) allCommands[cmd].locked = false;
  });

  // key input (fml)
  document.addEventListener("keydown", (e) => {
    if (e.key === " ") e.preventDefault();

    if (e.key === "Backspace") {
      input = input.slice(0, -1);
    } else if (e.key === "Enter") {
      executeCommand(input.trim());
      input = "";
      newLine();
    } else if (e.key.length === 1) {
      input += e.key;
    }

    inputEl.textContent = input;
  });

  // take a guess
  function newLine() {
  const oldCursors = terminal.querySelectorAll(".cursor");
  oldCursors.forEach(c => c.remove());

  // guess
  const line = document.createElement("div");
  line.className = "line";
  line.innerHTML = `
    <span class="prompt">$</span>
    <span class="input"></span>
    <span class="cursor"></span>
  `;

  terminal.appendChild(line);
  inputEl = line.querySelector(".input");
  terminal.scrollTop = terminal.scrollHeight;
}

  // command shit idfk
  function executeCommand(cmd) {
    const output = document.createElement("div");
    const parts = cmd.split(" ");
    const base = parts[0];
    const args = parts.slice(1);

    if (base === "test" && args[0]) {
      const toUnlock = args[0];
      unlockCommand(toUnlock);
      output.textContent = `Tested and unlocked: ${toUnlock}`;
    }
    else if (allCommands[base]) {
      if (allCommands[base].locked) {
        output.textContent = `command not found: ${base}`;
      } else {
        output.textContent = allCommands[base].action(args);
      }
    } else {
      output.textContent = `command not found: ${cmd}`;
    }

    terminal.appendChild(output);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function unlockCommand(name) {
    if (allCommands[name] && allCommands[name].locked) {
      allCommands[name].locked = false;
      if (!unlocked.includes(name)) {
        unlocked.push(name);
        localStorage.setItem("unlocked", JSON.stringify(unlocked));
      }
    }
  }
});
