// import fs from "fs";
// import { execSync } from "child_process";
import { errorHandler } from "../utils/internal/errorHandler.js";
import { getConfig, performSingleOrMultiple } from "../utils/internal/index.js";

const runDev = async () => {
  const { env, config } = await getConfig();

  const testKeys = performSingleOrMultiple(config.dev, (v) => Object.keys(v), {
    strict: true,
  });
  console.log(testKeys);

  // // Cache löschen
  // fs.rmSync("./apps/admin-panel/.next", { recursive: true, force: true });
  // fs.rmSync("./apps/store-front/.next", { recursive: true, force: true });

  // // Env files erstellen
  // fs.writeFileSync(
  //   "./apps/admin-panel/.env",
  //   `BASE_URL=${"http://localhost:1337"}\n
  //   FRONTEND_URL=${"http://localhost:3000"}\n
  //   IMG_URL=${"http://localhost:8000"}\n
  //   MONGODB_URL='mongodb+srv://developer:Test1234@cluster0.6m8hm.mongodb.net/next_ecommerce?retryWrites=true&w=majority'`
  // );

  // fs.writeFileSync(
  //   "./apps/store-front/.env",
  //   `BASE_URL=${"http://localhost:3000"}\n
  //   BACKEND_URL=${"http://localhost:1337"}\n
  //   IMG_URL=${"http://localhost:8000"}\n`
  // );

  // execSync("npm run dev:all", {
  //   stdio: "inherit",
  //   cwd: "./",
  // });
};

runDev().catch(errorHandler);
