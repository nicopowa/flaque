# flaque

**good vibes delivered straight to your mailbox**

- choose album or track
- copy share link or page url
- go to flaque page
- paste link and type your email
- place order
- wait for delivery
- download and play


## installation


### getting started

- install nodejs
- install python ⚠️ 3.11
- clone flaque repository
- open terminal inside flaque directory


### lazy install

⚠️ experimental


- run autoinstall script

	```npm run lazy```


### manual install

- [install qobuz-dl](https://github.com/vitiko98/qobuz-dl?tab=readme-ov-file#getting-started)
- [install tidal-dl-ng](https://github.com/exislow/tidal-dl-ng?tab=readme-ov-file#-installation--upgrade)
- install node dependencies

	```npm install```


## set-up

- connect trial or premium accounts
	- qobuz

	```qobuz-dl```

	- tidal

	```tidal-dl-ng login```

- edit flaque.json
	- mail : mail account settings
		- smtp : mail server url
		- port : mail server port
		- from : mail from field
		- user : mail account username
		- pass : mail account password
	- opts : flaque options
		- url : domain name including http(s) and no trailing slash
		- storage : orders storage directory path, relative to project root
		- orderMax : maximum orders per email address
		- orderTime : download links expiration time in seconds
			- cleaning task runs every 30 seconds
- run flaque server

	```npm start```

- navigate to flaque page


## credits

- [nodejs](https://nodejs.org/)
- [adm-zip](https://github.com/cthackers/adm-zip)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [ffmpeg](https://ffmpeg.org/download.html) / [node-ffmpeg](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg)
- [python](https://www.python.org/downloads/release/python-3119/)
- [qobuz-dl](https://github.com/vitiko98/qobuz-dl)
- [tidal-dl-ng](https://github.com/exislow/tidal-dl-ng)


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


## coffee

black coffee with peggy lee

[qobuz](https://open.qobuz.com/track/3870194) / [tidal](https://tidal.com/browse/track/1603283)


[buy me a coffee](https://buymeacoffee.com/nicopowa)