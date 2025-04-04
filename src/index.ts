import { parseArgs, runApplication } from "./cli.ts";

async function init() {
  const parseArgsResult = await parseArgs(process.argv.slice(2));
  switch (parseArgsResult.type) {
    case "success":
      await runApplicationAndDisplayOutput(
        parseArgsResult.csvInputPath,
        parseArgsResult.jsonOutputPath,
      );
      return;
    case "error":
      return displayErrorAndExit(parseArgsResult.error);
    case "help":
      console.log(parseArgsResult.message);
      return;
  }
}

function displayErrorAndExit(error: string) {
  console.error(error);
  process.exit(1);
}

async function runApplicationAndDisplayOutput(
  csvInputPath: string,
  jsonOutputPath: string,
) {
  const applicationResult = await runApplication(csvInputPath, jsonOutputPath);

  if (!applicationResult.success) {
    console.error(applicationResult.error);
    process.exit(1);
  }

  console.log(applicationResult.message);
}

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
