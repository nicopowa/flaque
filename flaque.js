const fs		 = require("fs");
const path		 = require("path");
const exec		 = require("child_process").exec;
const AdmZip 	 = require("adm-zip");
const NodeMailer = require("nodemailer");
const FFmpeg	 = require("@ffmpeg-installer/ffmpeg");

class Flaque {

	constructor() {

		console.log("flaque");

		this.expires = setInterval(
			() => 
				this.clearOrders(), 
			30000
		);

		this.conf = JSON
		.parse(
			fs
			.readFileSync(
				path
				.join(
					__dirname, 
					"flaque.json"
				)
			)
		);

		// console.log(this.conf);

		this.working = false;
		this.queue = [];
		this.current = null;

		this.ordersDir = path
		.resolve(
			__dirname, 
			this.conf["opts"]["storage"]
		);

		this.runners = {

			"qobuz": this.runQobuz, 
			"tidal": this.runTidal, 

			// beatport
			// bandcamp
			// soundcloud
			// ...

		};

		this.starters = {

			"qobuz": this.initQobuz, 
			"tidal": this.initTidal

		};

		this.checkers = {

			// track

			// album
			"qobuz": "play\\.(qobuz)\\.com\\/album\\/([a-z0-9]+)", 
			"tidal": "listen\\.(tidal)\\.com\/album\\/(\\d+)", 
			
			// artist

			// label

			// playlist

		};

		Object
		.keys(this.starters)
		.forEach(
			www => 
				this.starters[www]
				.bind(this)()
		);

	}

	please(lnk, box) {

		let pleaseWait = this.checkQueue(box);

		if(pleaseWait.length >= this.conf["opts"]["orderMax"]) {

			if(DEBUG) console.log("flaque order later");

			return {
				"ok": false, 
				"msg": "come back later"
			};

		}

		let checkedURL = this.checkURL(lnk);

		if(!checkedURL) {

			if(DEBUG) console.log("flaque invalid url", lnk);

			return {
				"ok": false, 
				"msg": "invalid url"
			};

		}

		let orderId = Math
			.random()
			.toString(36)
			.slice(-6), 

			www = checkedURL[1], 

			itm = checkedURL[2];

		let order = {
			id: orderId, 
			www: www, 
			url: itm, 
			mail: box, 
			dir: path
			.join(
				this.ordersDir, 
				www, 
				orderId
			)
		};

		console.log("flaque order", order.www, order.id);

		this.queue
		.push(order);

		setTimeout(
			() => 
				this.processQueue(), 
			33
		);

		return {
			"ok": true, 
			"msg": "order " + order.id
		};

	}

	checkURL(lnk) {

		let portal = Object
		.keys(this.checkers)
		.find(
			checking => 
				new RegExp(this.checkers[checking], "gi")
				.test(lnk)
		);

		if(portal) 
			return new RegExp(
				this.checkers[portal], 
				"gi"
			)
			.exec(lnk);
			
		return null;
		

	}

	checkQueue(box) {

		return this.queue
		.filter(
			queued => 
				queued.mail === box
		);

	}

	processQueue() {

		if(this.working) {

			if(DEBUG) console.log("flaque busy ...");

			return;

		}

		this.working = true;

		if(this.queue.length) {

			this.current = this.queue
			.shift();

			this.processOrder();

		}
		else {

			if(DEBUG) console.log("flaque idle");

			this.working = false;

		}

	}

	processOrder() {

		if(DEBUG) console.log("flaque process", this.current.www, this.current.id);

		if(this.runners.hasOwnProperty(this.current.www)) 
			this.runners[this.current.www]
			.bind(this)();

	}

	async initQobuz() {

		// https://github.com/vitiko98/qobuz-dl

		// console.log("flaque init qobuz");

	}

	async runQobuz() {

		try {

			// PURGE
			// qobuz-dl -p

			let runDownloader = await this.runCmd(
				[
					"qobuz-dl", 
					// album download link
					"dl", "https://play.qobuz.com/album/" + this.current.url, 
					// output directory
					"-d", "\"" + this.current.dir + "\"", 
					// output quality
					// 5 = 320, 6 = lossless, 7 = 24B<=96kHz, 27 = 24B>96kHz
					"-q", "7", 
					// disable database
					"--no-db"
				]
				.join(" ")
			);

			// console.log(runDownloader);

			this.compressOrder();

		}
		catch(err) {

			console.log("flaque fail", this.current.www, this.current.id);

			console.error(err);

		}

	}

	async initTidal() {

		// https://github.com/exislow/tidal-dl-ng

		// console.log("flaque init tidal");

		// enable lossless audio
		let setLossless = await this.runCmd(
			[
				"tidal-dl-ng", 
				"cfg", 
				"quality_audio", 
				"HI_RES_LOSSLESS"
			]
			.join(" ")
		);

		// console.log(setLossless);

		// set ffmpeg path
		let locateFFmpeg = await this.runCmd(
			[
				"tidal-dl-ng", 
				"cfg", 
				"path_binary_ffmpeg", 
				FFmpeg["path"]
			]
			.join(" ")
		);

		// console.log(locateFFmpeg);

	}

	async runTidal() {

		try {

			// set output directory
			let setOutputDir = await this.runCmd(
				[
					"tidal-dl-ng", 
					"cfg", 
					"download_base_path", 
					"\"" + this.current.dir + "\""
				]
				.join(" ")
			);

			// console.log(setOutputDir);

			// run downloader
			let runDownloader = await this.runCmd(
				[
					"tidal-dl-ng", 
					"dl", 
					"https://listen.tidal.com/album/" + this.current.url
				]
				.join(" ")
			);

			// console.log(runDownloader);

			this.compressOrder();

		}
		catch(err) {

			console.log("flaque fail", this.current.www, this.current.id);

			console.error(err);

		}

	}

	compressOrder() {

		console.log("flaque zip", this.current.id);

		// start next download now
		// or wait compress ?

		let zip = new AdmZip(), 
			zippedDir = this.current.dir;

		if(this.current.www === "tidal") {

			// Albums dir

			zippedDir = path
			.join(
				this.current.dir, 
				"Albums"
			);

		}

		zip
		.addLocalFolder(
			zippedDir
		);

		zip
		.writeZip(
			path
			.resolve(
				this.ordersDir, 
				this.current.id + ".zip"
			)
		);

		this.mailOrder();

	}

	async mailOrder() {

		// await sendMail and rmDir ?
		// too lazy to wait

		this.sendMail(this.conf["opts"]["url"] + "/get/" + this.current.id);

		fs.promises
		.rm(
			this.current.dir, 
			{
				recursive: true
			}
		);

		this.nextOrder();

	}

	nextOrder() {

		this.current = null;

		this.working = false;

		this.processQueue();

	}

	clearOrders() {

		// console.log("flaque clear");

		fs
		.readdir(
			this.ordersDir, 
			(err, files) => {

				files
				.forEach(
					file => {

						let fullPath = path
						.join(
							this.ordersDir, 
							file
						);

						fs
						.stat(
							fullPath, 
							(err, stat) => {

								if(stat.isFile() && file.endsWith("zip")) {

									let lifeTime = Math
									.round(
										(
											Date
											.now() 
											- stat.birthtimeMs
										) 
										/ 1000
									);

									if(lifeTime > this.conf["opts"]["orderTime"]) {

										console.log("flaque delete", file);

										fs
										.unlink(
											fullPath, 
											err => {

												// if(err)

											}
										);

									}

								}

							}
						);

					}
				);

			}
		);

	}

	runCmd(cmd) {

		return new Promise(
			(resolve, reject) => 
				exec(
					cmd, 
					{}, 
					(err, stdout, stderr) => {
	
						if(err) 
							reject(err);
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

	async sendMail(lnk) {

		console.log("flaque mail", this.current.id);

		let mailStatus = await NodeMailer
		.createTransport({
			host: this.conf["mail"]["smtp"], 
			port: this.conf["mail"]["port"], 
			secure: this.conf["mail"]["port"] == 465, 
			auth: {
				user: this.conf["mail"]["user"], 
				pass: this.conf["mail"]["pass"]
			}
		})
		.sendMail({
			from: this.conf["mail"]["from"], 
			to: this.current.mail, 
			subject: "good vibes", 
			text: lnk, 
			html: "<a href=\"" + lnk + "\">download</a>"
		
		});

		if(mailStatus.accepted.length) {

			if(!mailStatus.messageId) 
				console.log("flaque mail error", mailStatus);

		}
		else if(mailStatus.rejected.length) 
			console.log("flaque mail rejected", mailStatus.rejected);

	}

}

module.exports = Flaque;