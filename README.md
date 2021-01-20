# Koca JS Console

insert console.log with file path and line.

---

## Usage

With selection:

* Highlight a variable (or really any text)
* Press Cmd+Shift+L
* The output (on a new line) will be: `console.log(\`Koca: /path/target.js, line 2:  ${variable}\`)`;

Without selection:

* Press Cmd+Shift+L
* The output (on the same line) will be:  `console.log(\`Koca: /path/target.js, line 2\`)`;

---

## Release Notes

### 0.0.1

Added support for:

* Insert `console.log` with file path and line
* Sync line number before save