const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");

//check that argv is defined
if (process.argv[2] === undefined) {
  throw new Error("Please provide an arguments as the package name!");
}

//check for yarn
const usesYarn =
  (process.env.npm_config_user_agent || "").indexOf("yarn") === 0;

//create install command
const installCommand = usesYarn ? "yarn install" : "npm install";

//get name from argv
const packageName = process.argv[2].toLowerCase();

//get root path of package
const packagePath = path.join(__dirname, "..", packageName);

//get example path of package
const examplePath = path.join(packagePath, "example");

//get path of template folder
const templatePath = path.join(__dirname, "_template");

//create new folder
fs.mkdirSync(packagePath);

//copy files from template
fs.cpSync(templatePath, packagePath, { recursive: true });

//replace the name
replace.sync({
  files: [
    path.join(packagePath, "package.json"),
    path.join(examplePath, "package.json"),
  ],
  from: /__NAME__/g,
  to: packageName,
});

//run install command
child_process.execSync(`cd ${packagePath} && ${installCommand}`);
child_process.execSync(`cd ${examplePath} && ${installCommand}`);
