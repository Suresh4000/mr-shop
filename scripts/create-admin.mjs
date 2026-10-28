import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// Load .env.local manually if running via node
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      env[key.trim()] = rest.join("=").trim();
    }
  }
  return env;
}

const env = loadEnvLocal();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2];
const password = process.argv[3];

if (!email) {
  console.log(`
Usage:
  node scripts/create-admin.mjs <email> [password]

Example:
  node scripts/create-admin.mjs admin@mrshop.com AdminPassword123!

Note:
  Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
  If you do not have the service role key, you can add an admin in Supabase SQL Editor:

  INSERT INTO public.admin_users (user_id)
  SELECT id FROM auth.users WHERE email = '${email || "admin@mrshop.com"}'
  ON CONFLICT DO NOTHING;
`);
  process.exit(1);
}

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes("your-service-role-key")) {
  console.error("\n❌ SUPABASE_SERVICE_ROLE_KEY is missing or set to placeholder in .env.local.");
  console.log(`
To grant admin permissions without service-role key, run this in Supabase SQL Editor:
-------------------------------------------------------------------------------------
-- 1. Create the user under Authentication -> Users in Supabase dashboard.
-- 2. Then run:
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = '${email}'
ON CONFLICT DO NOTHING;
-------------------------------------------------------------------------------------
`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`\nSetting up administrator for: ${email}...`);

  let userId = null;

  // Check if user already exists in auth.users
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const existingUser = listData.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existingUser) {
    userId = existingUser.id;
    console.log(`✓ Found existing user in Supabase Auth (ID: ${userId})`);
  } else {
    if (!password) {
      console.error(
        "❌ User does not exist yet. Please provide a password as the second argument.",
      );
      process.exit(1);
    }
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error("❌ Failed to create user:", createError.message);
      process.exit(1);
    }
    userId = newUser.user.id;
    console.log(`✓ Created new confirmed user in Supabase Auth (ID: ${userId})`);
  }

  // Insert into public.admin_users
  const { error: adminError } = await supabase
    .from("admin_users")
    .upsert({ user_id: userId }, { onConflict: "user_id" });

  if (adminError) {
    console.error("❌ Failed to grant admin rights in admin_users:", adminError.message);
    process.exit(1);
  }

  console.log(`🎉 Success! ${email} is now an authorized administrator.`);
  console.log(`You can now log in at http://localhost:3000/admin/login\n`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
