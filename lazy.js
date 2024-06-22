const exec = require("child_process").exec;

class FlaqueInstall {

	constructor() {

		console.log("flaque lazy install");

		this.runInstall();

	}

	async runInstall() {

		if(!await this.checkPython()) {

			console.log("please install python 3.11");

			return;

		}

		await this.installQobuz();

		await this.installTidal();

		await this.installDeps();

	}

	async checkPython() {

		console.log("check python");

		let pyCheck = await this.runCmd("python --version");

		// console.log(pyCheck);

		return /python \d\.\d+/gi
		.test(pyCheck.stdout);

	}

	async installQobuz() {

		console.log("install qobuz");

		if(process.platform === "win32") 
			await this.runCmd("pip3 install windows-curses");

		await this.runCmd("pip3 install --upgrade qobuz-dl");

	}

	async installTidal() {

		console.log("install tidal");

		await this.runCmd("pip install --upgrade tidal-dl-ng");

	}

	async installDeps() {

		console.log("install dependencies");

		await this.runCmd("npm install");

	}

	runCmd(cmd) {

		return new Promise(
			resolve => 
				exec(
					cmd, 
					{}, 
					(err, stdout, stderr) => {
	
						if(err) 
							resolve({

								stdout: stdout, 

								stderr: stderr

							});
						else resolve({
	
							stdout: stdout
							.trim(), 
							
							stderr: stderr
							.trim()
	
						});
	
					}
				)
		);

	}

}

new FlaqueInstall();
