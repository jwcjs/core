import fs from "node:fs";
import path from "node:path";
import minimist from "minimist";
import prompts from "prompts";
import { cyan, green, red, reset } from "kolorist";
import { fileURLToPath } from "node:url";

const cwd = process.cwd();
const argv = minimist<{
	t?: string;
	template?: string;
}>(process.argv.slice(2), { string: ["_"] });

const TEMPLATES = [
	{
		name: "starter-vite-ts",
		display: "Starter (Vite + TypeScript)",
		color: cyan,
	},
	// {
	// 	name: "starter-vite-js",
	// 	display: "Starter (Vite + JavaScript)",
	// 	color: blue,
	// },
];

function formatTargetDir(targetDir: string | undefined) {
	return targetDir?.trim().replace(/\/+$/g, "");
}

function copy(src: string, dest: string) {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
}

function isValidPackageName(projectName: string) {
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
		projectName
	);
}

function toValidPackageName(projectName: string) {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z\d\-~]+/g, "-");
}

function copyDir(srcDir: string, destDir: string) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
}

function isEmpty(path: string) {
	const files = fs.readdirSync(path);
	return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function emptyDir(dir: string) {
	if (!fs.existsSync(dir)) {
		return;
	}
	for (const file of fs.readdirSync(dir)) {
		if (file === ".git") {
			continue;
		}
		fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
	}
}

function pkgFromUserAgent(userAgent: string | undefined) {
	if (!userAgent) return undefined;
	const pkgSpec = userAgent.split(" ")[0];
	const pkgSpecArr = pkgSpec.split("/");
	return {
		name: pkgSpecArr[0],
		version: pkgSpecArr[1],
	};
}

const defaultTargetDir = "my-jwc-app";

const renameFiles: Record<string, string | undefined> = {
	_gitignore: ".gitignore",
};

async function init() {
	let dir = formatTargetDir(argv._[0]);
	const getProjectName = () =>
		dir === "." ? path.basename(path.resolve()) : dir;
	const template = argv.t || argv.template;
	let result;
	try {
		result = await prompts(
			[
				{
					type: dir ? null : "text",
					name: "projectName",
					message: reset("Project name:"),
					initial: defaultTargetDir,
					onState: (state) => {
						dir = formatTargetDir(state.value) || defaultTargetDir;
					},
				},
				{
					type: () =>
						!fs.existsSync(dir) || isEmpty(dir) ? null : "confirm",
					name: "overwrite",
					message: () =>
						`Target directory ${dir} is not empty. Remove existing files and continue?`,
				},
				{
					type: (_, { overwrite }) => {
						if (overwrite === false)
							throw new Error(`${red("✖")} Operation cancelled`);
						return null;
					},
					name: "overwrite-confirm",
				},
				{
					type: () =>
						isValidPackageName(getProjectName()) ? null : "text",
					name: "packageName",
					message: reset("Project name:"),
					initial: () => toValidPackageName(getProjectName()),
					validate: (name) =>
						isValidPackageName(name)
							? true
							: "Invalid project name",
				},
				{
					type:
						template && TEMPLATES.find((t) => t.name === template)
							? null
							: "select",
					name: "template",
					message: reset(
						typeof template === "string" &&
							!TEMPLATES.find((t) => t.name === template)
							? `Template ${template} not found. Please choose a template:`
							: "Select a template:"
					),
					initial: 0,
					choices: TEMPLATES.map((t) => {
						return {
							title: t.color(t.display || t.name),
							value: t,
						};
					}),
				},
			],
			{
				onCancel: () => {
					throw new Error(red("✖") + " Operation cancelled");
				},
			}
		);
	} catch (err: any) {
		console.error(err.message);
		process.exit(1);
	}

	const { template: userTemplate, overwrite, packageName } = result;
	const root = path.join(cwd, dir);

	if (overwrite) {
		emptyDir(root);
	} else if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true });
	}

	const pkginfo = pkgFromUserAgent(process.env.npm_config_user_agent);
	const manager = pkginfo ? pkginfo.name : "npm";

	const templateDir = path.resolve(
		fileURLToPath(import.meta.url),
		"../../",
		userTemplate.name
	);

	const write = (file: string, content?: string) => {
		const targetPath = path.join(root, renameFiles[file] ?? file);
		if (content) {
			fs.writeFileSync(targetPath, content);
		} else {
			copy(path.join(templateDir, file), targetPath);
		}
	};
	const files = fs.readdirSync(templateDir);
	for (const file of files.filter((f) => f !== "package.json")) {
		write(file);
	}
	const pkg = JSON.parse(
		fs.readFileSync(path.join(templateDir, "package.json"), "utf-8")
	);
	pkg.name = packageName || getProjectName();
	write("package.json", JSON.stringify(pkg, null, 2));
	console.log(`\n${green("✔")} Created project in ${root}.`);
	if (root !== cwd) {
		console.log(`\n${green("✔")} To get started:`);
		console.log(`\n  cd ${root}`);
	}
	switch (manager) {
		case "yarn":
			console.log(`  yarn`);
			console.log(`  yarn dev`);
			break;
		default:
			console.log(`  ${manager} install`);
			console.log(`  ${manager} run dev`);
			break;
	}
	console.log();
}

init().catch((e) => {
	console.error(e);
});
