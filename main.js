const { app, BrowserWindow } = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) app.quit()

function createWindow() {
	const gotTheLock = app.requestSingleInstanceLock()

	if (!gotTheLock) {
		app.quit()
	} else {
		app.on('second-instance', (event, commandLine, workingDirectory) => {
			// Someone tried to run a second instance, we should focus our window.
			if (win) {
				if (win.isMinimized()) win.restore()
				win.focus()
			}
		})
	}
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		icon: 'resources/Icon.ico',

		webPreferences: {
			// devTools: true,
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	win.loadFile('index.html')
	win.setMenu(null)
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
