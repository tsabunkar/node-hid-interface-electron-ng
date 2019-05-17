// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const HID = require('node-hid');
const url = require('url');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


let duplicatedevices = HID.devices();

// console.log(duplicatedevices); // Array of object, Each object is a device connected, We can identify a device
// by productId and vendorId

let sendDataFromMainProcessToRendereProcess = () => {
  let jabraDeviceFound;

  let devices = duplicatedevices.filter((device, index, self) =>
    index === self.findIndex((t) => (
      t.productId === device.productId && t.vendorId === device.vendorId
    ))
  );
  // console.log(devices);


  // Opening the path 'In order to perform R&W Operation with the device'
  devices.forEach(device => {

    console.log(device);
    if (device.product === 'Jabra EVOLVE 20 MS') {
      var jabraDevice = new HID.HID(device.vendorId, device.productId);
      console.log(jabraDevice);
      console.log('Reading from the deivce....');

      jabraDeviceFound = {
        jabraDevice,
        productName: device.product,
        productManufacturer: device.manufacturer
      };

    }

  });

  return jabraDeviceFound;

}






function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // without that we cannot use node_modules
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/../', '/dist/ng-electron/', 'index.html'),
      protocol: 'file',
      slashes: true
    })
  )

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Loading is finished !!');
    let deviceObject = sendDataFromMainProcessToRendereProcess();
    console.log('+++', deviceObject);
    mainWindow.webContents.send('jabraDeviceData', deviceObject); // Passing data frm (MainProcess) app.js to index.html (Renderer Process)

  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

