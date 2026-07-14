import { runApiRuntimeConfigDoctor } from "./runtime-config-doctor";

const result = runApiRuntimeConfigDoctor(process.env);

console.log(JSON.stringify(result, null, 2));

if (result.status === "fail") {
  process.exitCode = 1;
}
