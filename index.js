const http	 = require("http");
const path	 = require("path");
const fs	 = require("fs");

global.DEBUG = true;

const Flaque = require("./flaque.js");

/**
 * @class Server : lazy, not safe, testing only
 */
class LazyServer {

	constructor() {

		this.flaque = new Flaque();

		this.indx = fs
		.readFileSync(
			path
			.join(
				__dirname, 
				"index.html"
			)
		);

		this.routes = {

			"ask": this.ask, 
			"get": this.get

		};

		this.server = http
		.createServer(
			(req, res) => 
				this.handle(
					req, res
				)
		);
		
		this.server
		.listen(80);

		console.log("drops incoming");
	}

	handle(req, res) {

		let frags = req.url
		.split("/")
		.filter(Boolean);

		if(frags.length) {

			let method = frags
			.shift();

			if(this.routes[method]) 
				this.routes[method]
				.bind(this)(
					req, res, 
					...frags
				);
			else 
				this.oops(
					req, res
				);

		}		
		else 
			this.front(
				req, res
			);

	}

	front(req, res) {

		// console.log("index");

		res
		.writeHead(
			200, 
			{
				"Content-Type": "text/html"
			}
		)
		.end(
			this.indx
		);

	}

	ask(req, res) {

		// console.log("order");

		if(req.method == "POST") {

			let postBuf = "";
	
			req
			.on(
				"data", 
				dat => {

					postBuf += dat;

				}
			)
			.on(
				"end", 
				() => {

					let orderData = JSON
					.parse(postBuf);

					if(orderData["lnk"] && orderData["box"]) {

						let order = this.flaque
						.please(
							orderData["lnk"], 
							orderData["box"]
						);

						res
						.writeHead(
							200, 
							{
								"Content-Type": "text/json"
							}
						)
						.end(
							JSON
							.stringify({
								"msg": order["msg"]
							})
						);

					}
					else 
						this.oops(
							req, res
						);

				}
			);
		}
		else 
			this.oops(
				req, res
			);
		
	}

	async get(req, res, order) {

		// console.log("deliver", order);

		let filepath = path
		.join(
			"orders", 
			order + ".zip"
		);

		if(!fs.existsSync(filepath)) 
			return this.oops(
				req, res
			);

		let filename = path
			.basename(filepath), 

			stat = await fs.promises
			.stat(filepath);
		
		res
		.writeHead(200, {
			"Content-Type": "application/octet-stream", 
			"Content-Disposition": "attachment; filename=\"" + encodeURI(filename) + "\"", 
			"Content-Length": stat.size.toString()
		});

		let stream = fs
		.createReadStream(filepath)
		.on(
			"open", 
			() => 
				stream 
				&& stream
				.pipe(res)
		)
		.on("error", 
			err => {

				console.error(err);
				
				res
				.end(err);

			}
		);
		
		res
		.on(
			"close", 
			() => {

				stream = null;

				// console.log("delivered", filename);

			}
		);

	}

	oops(req, res) {

		// console.log("oops");

		res
		.writeHead(
			404, 
			{
				"Content-Type": "text/plain"
			}
		)
		.end(
			"oops"
		);

	}

}

new LazyServer();