#!/usr/bin/env node
// Usage: node scripts/hash.js "ANTWORT"
// Prints the SHA-256 hex hash used for solutionHash in js/levels.js.
// The engine normalizes input as trim() + toUpperCase() before hashing,
// so pass the answer in uppercase here to match exactly what a correct
// user submission will hash to.

const crypto = require("crypto");

const raw = process.argv.slice(2).join(" ");
if (!raw) {
  console.error('Usage: node scripts/hash.js "ANTWORT"');
  process.exit(1);
}

const normalized = raw.trim().toUpperCase();
const hash = crypto.createHash("sha256").update(normalized).digest("hex");

console.log(`Answer (normalized): ${normalized}`);
console.log(`solutionHash:        ${hash}`);
