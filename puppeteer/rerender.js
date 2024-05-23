const btnFb = document.getElementById("btn-fb");
const btnCloseFb = document.getElementById("btn-close-fb");
const btnCloseBrowser = document.getElementById("btn-close-browser");
const btnScreenshotFb = document.getElementById("btn-screenshot");
const btnBaseAccount = document.getElementById("btn-base-account");

const fbEmail = document.getElementById("fb-email");
const fbPass = document.getElementById("fb-pass");
const hack = document.getElementById("hack");

btnFb.addEventListener("click", () => {
  window.electronAPI.openFacebook();
});

btnBaseAccount.addEventListener("click", () => {
  window.electronAPI.baseAccountFacebook();
});

btnCloseFb.addEventListener("click", () => {
  window.electronAPI.closeFacebook();
});

btnCloseBrowser.addEventListener("click", () => {
  window.electronAPI.closeBrowser();
});

btnScreenshotFb.addEventListener("click", () => {
  window.electronAPI.screenshotFacebook();
});

window.electronAPI.accountFacebook((result) => {
  fbEmail.value = result.email;
  fbPass.value = result.pass;

  if (result.email && result.pass)
    hack.innerText = "Bạn đã bị mất tài khoản facebook";
});
