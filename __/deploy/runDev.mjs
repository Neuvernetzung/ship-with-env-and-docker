import fs from "fs";
import { execSync } from "child_process";
import { generateSecretToken } from "./utils/generateSecretToken.mjs";

const runDev = async () => {
  const REVALIDATION_SECRET = generateSecretToken(32);
  const ACCESS_TOKEN_SECRET = generateSecretToken(32);
  const REFRESH_TOKEN_SECRET = generateSecretToken(32);

  // Cache löschen
  fs.rmSync("./apps/admin-panel/.next", { recursive: true, force: true });
  fs.rmSync("./apps/store-front/.next", { recursive: true, force: true });

  // Env files erstellen
  fs.writeFileSync(
    "./apps/admin-panel/.env",
    `BASE_URL=${"http://localhost:1337"}\n
    FRONTEND_URL=${"http://localhost:3000"}\n
    IMG_URL=${"http://localhost:8000"}\n
    ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}\n
    REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}\n
    REVALIDATION_SECRET=${REVALIDATION_SECRET}\n
    MONGODB_URL='mongodb+srv://developer:Test1234@cluster0.6m8hm.mongodb.net/next_ecommerce?retryWrites=true&w=majority'`
  );

  fs.writeFileSync(
    "./apps/store-front/.env",
    `BASE_URL=${"http://localhost:3000"}\n
    BACKEND_URL=${"http://localhost:1337"}\n
    IMG_URL=${"http://localhost:8000"}\n
    REVALIDATION_SECRET=${REVALIDATION_SECRET}`
  );

  execSync("npm run dev:all", {
    stdio: "inherit",
    cwd: "./",
  });
};

runDev();
