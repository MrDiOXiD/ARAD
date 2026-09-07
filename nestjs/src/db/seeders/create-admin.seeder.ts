/**
 * Admin user seeder — CLI only, never exposed via HTTP.
 *
 * Usage:  npm run seed:admin
 *
 * Security measures:
 * - Credentials are typed interactively; password input is masked and
 *   never written to a file, .env, or shell history.
 * - Same password strength policy as normal signup (enforced here
 *   independently, since this script doesn't go through the DTO layer).
 * - Password confirmation prompt — a typo here would otherwise create
 *   an admin account with an unknown password.
 * - bcrypt cost factor 12 — identical to UserService.hashPassword(),
 *   so this account isn't weaker than a normal signup.
 * - Checks for existing username/email conflicts before insert and
 *   fails with a clear message rather than a raw Postgres error or a
 *   silent overwrite.
 * - In production (NODE_ENV=production), requires typing the literal
 *   confirmation phrase below — this is deliberately annoying, so
 *   nobody creates a prod admin by muscle-memory-hitting Enter.
 * - Never logs or re-prints the password after it's hashed.
 */
import 'reflect-metadata';
import { hash } from 'bcrypt';
import * as readline from 'readline';
import AppDataSource from '../data-source';
import { UserEntity } from '@/users/entities/user.entity';
import { Roles } from '@/utils/common/Roles.enum';

const PROD_CONFIRM_PHRASE = 'CREATE ADMIN IN PRODUCTION';

const PASSWORD_RULES: { test: (v: string) => boolean; message: string }[] = [
  { test: (v) => v.length >= 8, message: 'at least 8 characters' },
  { test: (v) => /[a-z]/.test(v), message: 'a lowercase letter' },
  { test: (v) => /[A-Z]/.test(v), message: 'an uppercase letter' },
  { test: (v) => /[0-9]/.test(v), message: 'a digit' },
  { test: (v) => /[^A-Za-z0-9]/.test(v), message: 'a special character' },
];

const USERNAME_RE = /^[a-zA-Z0-9_]{4,20}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

// ── Prompt helpers ─────────────────────────────────────────────────────
function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); }));
}

/** Masked input — echoes nothing as the user types, standard practice for password prompts. */
function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const stdin = process.stdin;
    let value = '';

    process.stdout.write(question);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = (char: string) => {
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode?.(false);
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        rl.close();
        resolve(value);
        return;
      }
      if (char === '\u0003') process.exit(1); // Ctrl+C
      if (char === '\u007f') { value = value.slice(0, -1); return; } // backspace
      value += char;
    };

    stdin.on('data', onData);
  });
}

function validatePassword(pw: string): string[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(pw)).map((rule) => rule.message);
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.log('\n⚠️  NODE_ENV=production — this will create an admin in your PRODUCTION database.');
    const confirm = await ask(`Type "${PROD_CONFIRM_PHRASE}" to continue, anything else to abort: `);
    if (confirm !== PROD_CONFIRM_PHRASE) {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  console.log('\n=== Create Admin User ===\n');

  let username = '';
  while (!USERNAME_RE.test(username)) {
    username = await ask('Username (4-20 chars, letters/digits/underscore): ');
    if (!USERNAME_RE.test(username)) console.log('  Invalid format, try again.');
  }

  let email = '';
  while (!EMAIL_RE.test(email)) {
    email = await ask('Email: ');
    if (!EMAIL_RE.test(email)) console.log('  Invalid email, try again.');
  }

  // phoneNumber intentionally skipped — schema allows null; wire this
  // in once OTP auth exists and phone becomes meaningful to collect.

  let password = '';
  for (;;) {
    password = await askHidden('Password: ');
    const errors = validatePassword(password);
    if (errors.length > 0) {
      console.log(`  Password needs: ${errors.join(', ')}.`);
      continue;
    }
    const confirmPw = await askHidden('Confirm password: ');
    if (confirmPw !== password) {
      console.log('  Passwords do not match, try again.');
      continue;
    }
    break;
  }

  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(UserEntity);

  const existing = await userRepo.findOne({
    where: [{ username }, { email }],
  });
  if (existing) {
    console.error(
      `\n✗ A user with this ${existing.username === username ? 'username' : 'email'} already exists (id ${existing.id}).`,
    );
    await AppDataSource.destroy();
    process.exit(1);
  }

  const hashed = await hash(password, 12); // same cost factor as UserService.hashPassword()

  const admin = userRepo.create({
    username,
    email,
    phoneNumber: undefined,
    password: hashed,
    roles: [Roles.ADMIN],
  });

  try {
    const saved = await userRepo.save(admin);
    console.log(`\n✓ Admin created: id=${saved.id}, username=${saved.username}, email=${saved.email}`);
    console.log('Password was not stored or logged anywhere by this script — only you know it.');
  } catch (error: unknown) {
    const pgCode = (error as { code?: string })?.code;
    if (pgCode === '23505') {
      console.error('\n✗ A user with this username/email/phone already exists (race with another process?).');
    } else {
      console.error('\n✗ Failed to create admin:', error);
    }
    process.exitCode = 1;
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
