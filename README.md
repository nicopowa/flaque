# flaque

**good vibes delivered straight to your mailbox**

- choose an album
- copy url
- go to flaque web page
- paste url
- type your email
- place order
- wait a little while
- check your mailbox
- download archive
- click play


## prerequisites

- install nodejs
- install python [⚠️ 3.11](https://github.com/exislow/tidal-dl-ng?tab=readme-ov-file#-installation--upgrade)
- clone flaque repository


## installation

### lazy


⚠️ experimental


- open terminal inside flaque directory
- run autoinstall script
	```npm lazy```

### manual

- install qobuz-dl
- install tidal-dl-ng
- open terminal inside flaque directory
- install node dependencies
	```npm install```

## set-up

- connect trial or premium account
	- qobuz
	```qobuz-dl```
	- tidal
	```tidal-dl-ng login```
- edit flaque.json
	- mail : mail account settings
	- params : 
		- url : domain name including http(s) and no trailing slash
		- storage : orders storage directory relative to project root
		- orderMax : maximum orders per email address
		- orderTime : download links expiration time in seconds
			- cleaning task runs every 30 seconds
- run flaque
	```npm start```

## credits

- [nodejs](https://nodejs.org/)
- [adm-zip](https://github.com/cthackers/adm-zip)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [python](https://www.python.org/downloads/release/python-3119/)
- [qobuz-dl](https://github.com/vitiko98/qobuz-dl)
- [tidal-dl-ng](https://github.com/exislow/tidal-dl-ng)
- [ffmpeg](https://ffmpeg.org/download.html) / [node-ffmpeg](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg)


## disclaimer

✅ educational purposes only

🌈 happy coding

🚫 no debugging

🚫 no input validation

🚫 no security

🚫 no error handling

🚫 no liability

🚫 no responsibility

⚠️ use at your own risks