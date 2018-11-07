import dashify from "lodash.kebabcase";
import Generator = require("yeoman-generator");
import uniq from "arr-union";
import gitignore from "./gitignore";
import packageJson from "./package-json";
import { tsconfigDummy, tsconfigBuildExtend } from "./tsconfig-template";

module.exports = class extends Generator {
  answers: {
    name: string;
    copyright: string;
    description: string;
  } = {} as any;
  async prompting() {
    this.answers = (await this.prompt([
      {
        type: "string",
        name: "name",
        message: "Name",
        default: dashify(this.appname)
      },
      {
        type: "string",
        name: "description",
        message: "Description"
      },
      {
        type: "string",
        name: "copyright",
        message: "Copyright"
      }
    ])) as any;
  }
  writting() {
    this.extendJSON("tsconfig.json", tsconfigDummy());
    this.extendJSON("tsconfig-build.json", tsconfigBuildExtend());
    this.extendJSON(
      "package.json",
      packageJson(this.answers.name, this.answers.description)
    );
    this.extendList(".gitignore", gitignore());
    this.copyTpl("README.md");
    this.copyTpl("LICENSE");
    this.copyTpl("src/index.ts");
    this.copyTpl("src/index.test.ts");
  }
  extendList = (fileRef: string, content: string) => {
    const file = this.destinationPath(fileRef);
    if (!this.fs.exists(file)) return this.write(fileRef, content);
    const templateLines = content.split("\n");
    const fileLines = this.fs.read(file).split("\n");
    const newLines = uniq(templateLines, fileLines);
    this.updateFile(file, newLines.join("\n"));
  };
  updateFile = (file: string, content: string) => {
    this.fs.delete(file);
    this.fs.write(file, content);
  };
  write = (file: string, content: string) => {
    if (this.fs.exists(this.templatePath(file))) return;
    this.fs.write(this.destinationPath(file), content);
  };
  extendJSON = (file: string, json: object) => {
    this.fs.extendJSON(this.destinationPath(file), json);
  };
  copyTpl = (file: string) => {
    if (this.fs.exists(this.destinationPath(file))) return;
    this.fs.copyTpl(
      this.templatePath(file),
      this.destinationPath(file),
      this.answers
    );
  };
};
