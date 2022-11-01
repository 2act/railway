'use strict';

const puppeteer = require('puppeteer');

async function stealth(page) {
	page.setDefaultNavigationTimeout(60000);
	await page.setViewport({ width: 1050, height: 682 });
	await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36");
	await page.evaluateOnNewDocument(() => {
		// 反爬虫检测
		Object.defineProperty(navigator, 'webdriver', {
			get: () => false,
		});
		Object.defineProperty(navigator, 'plugins', {
			get: () => [
				{
					0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format", enabledPlugin: Plugin},
					description: "Portable Document Format",
					filename: "internal-pdf-viewer",
					length: 1,
					name: "Chrome PDF Plugin"
				},
				{
					0: {type: "application/pdf", suffixes: "pdf", description: "", enabledPlugin: Plugin},
					description: "",
					filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
					length: 1,
					name: "Chrome PDF Viewer"
				},
				{
					0: {type: "application/x-nacl", suffixes: "", description: "Native Client Executable", enabledPlugin: Plugin},
					1: {type: "application/x-pnacl", suffixes: "", description: "Portable Native Client Executable", enabledPlugin: Plugin},
					description: "",
					filename: "internal-nacl-plugin",
					length: 2,
					name: "Native Client"
				}
			],
		});
		window.navigator.chrome = {
			runtime: {},
			loadTimes: function() {},
			csi: function() {},
			app: {}
		};
	});

}

async function sleep(ms) {
	return new Promise((resolve => setTimeout(()=>resolve(), ms)));
}

async function login_github(page, username, password) {
	var url = "https://github.com/login";
	console.log("opening " + url + "...");
	await page.goto(url, { waitUntil: "networkidle2" });
	var name = await page.$("#login_field");
	if(name) {
		console.log("github needs to login");
		await name.type(username);
		await page.type("#password", password);
		await page.click("input[name='commit']");
	}
	else {
		console.log("github already logged in");
		await page.close();
	}
}

async function login_railway(page) {
	var url = "https://railway.app/";  // set your service url here!
	console.log("opening " + url + "...");
	await page.goto(url, { waitUntil: "networkidle2" });
	var [button] = await page.$x("//button[contains(., 'Login')]");
	if(button) {
		console.log("railway needs to login");
		await button.click();
		var [button] = await page.$x("//span[contains(., 'GitHub')]");
		if(button) {
			console.log("login ...");
			await button.click();
			// 等待登录成功
			await page.waitForSelector("a[name='Account Settings']");
			await page.goto(url, { waitUntil: "networkidle2" });	
		}
	}
	else
		console.log("railway already logged in");
}

async function main(action) {
	// set up browser object
	const browser = await puppeteer.launch( { 
		headless: !process.env.GNOME_TERMINAL_SCREEN,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		userDataDir: "./chromeData"
	} );

	console.log("browser started.");

	//*
	var [page] = await browser.pages();
	await stealth(page);
	//* login to github
	var username = "";    // set your username here!
	var password = "";    // set your password here!
	await login_github(page, username, password)
	//*/

	//*
	var page = await browser.newPage();
	await stealth(page);
	//* login to railway
	await login_railway(page);
	//*

	// 设置选择器
	var s_svg = ".metro-pane-content ul:nth-child(1) svg";
	var s_remove = "div[role='menu'][data-state='open'] div:nth-of-type(4)";
	var s_rollback = "div[role='menu'][data-state='open'] div:nth-child(1)";
	var s_confirm = "button.confirm[color='red'] span";

	if(action == "down") {
		var svg = await page.$(s_svg);
		if(svg) {
			console.log("click svg:" + JSON.stringify(svg));
			await svg.click();
			await page.waitForSelector(s_remove);
			console.log("click remove.");
			await page.click(s_remove);
			await page.waitForSelector(s_confirm);
			console.log("click confirm.");
			await page.click(s_confirm);
			await page.waitForNetworkIdle("networkidle2");
			console.log("down ok");
		}
	}
	else if (action == "up") {
		var svg = await page.$(s_svg);
		if(svg) {
			console.log("click svg:" + JSON.stringify(svg));
			await svg.click();
			await page.waitForSelector(s_rollback);
			console.log("click rollback.");
			await page.click(s_rollback);
			await page.waitForSelector(s_confirm);
			console.log("click confirm.");
			await page.click(s_confirm);
			await page.waitForNetworkIdle("networkidle2");
			console.log("up ok");
		}
	}
	//*/

	await browser.close();
}

let action = process.argv.splice(2)[0];
main(action);

