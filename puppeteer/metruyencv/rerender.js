const inputBookUrl = document.getElementById("input-book-url");
const selectFileExtension = document.getElementById("select-file-extension");

const btnScratch = document.getElementById("btn-scratch");

btnScratch.addEventListener("click", () => {
  const bookUrl = inputBookUrl.value;
  const fileExtension = selectFileExtension.value;

  window.electronAPI.scratchBook({ bookUrl, fileExtension });

  inputBookUrl.value = "";
});
