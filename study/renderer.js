const btnChooseFile = document.getElementById("btn-choose-file");
const btnCreateFile = document.getElementById("btn-create-file");

const inputFileName = document.getElementById("input-file-name");
const selectFileExtension = document.getElementById("select-file-extension");
const dataFileCreate = document.getElementById("data-file-create");

const dataFileSelect = document.getElementById("data-file-select");
const fileChoose = document.getElementById("file-choose");
const btnEditFile = document.getElementById("btn-edit-file");

const btnChooseFolder = document.getElementById("btn-choose-folder");
const folderChoose = document.getElementById("folder-choose");
const dataFolderSelect = document.getElementById("data-folder-choose");
const btnDeleteFile = document.getElementById("btn-delete-file-in-folder");

btnChooseFile.addEventListener("click", () => {
  window.electronAPI.readFile();
});

btnChooseFolder.addEventListener("click", () => {
  window.electronAPI.readFolder();
});

window.electronAPI.onFileData((result) => {
  if (result.error) {
    console.log(`Error: ${result.error}`);
  } else {
    fileChoose.value = result.filePath;
    dataFileSelect.value = result.data;
  }
});

window.electronAPI.onFolderData((result) => {
  if (result.error) {
    console.log(`Error: ${result.error}`);
  } else {
    folderChoose.value = result.filePath;

    dataFolderSelect.innerHTML = "";

    result.data.forEach((data) => {
      const option = document.createElement("option");

      option.value = data;
      option.textContent = data;
      dataFolderSelect.appendChild(option);
    });
  }
});

btnCreateFile.addEventListener("click", () => {
  const fileName = inputFileName.value;
  const fileExtension = selectFileExtension.value;
  const fileData = dataFileCreate.value;

  const filePath = `./file/${fileName}.${fileExtension}`;

  window.electronAPI.writeFile(filePath, fileData);
});

window.electronAPI.onWriteStatus((status) => {
  if (status.success) {
    console.log("Created and Edited");
  } else {
    console.log(`Error: ${status.error}`);
  }
});

window.electronAPI.onDeleteStatus((status) => {
  if (status.success) {
    console.log("Deleted!!!");
  } else {
    console.log(`Error: ${status.error}`);
  }
});

btnEditFile.addEventListener("click", () => {
  const fileData = dataFileSelect.value;
  const filePath = fileChoose.value;

  window.electronAPI.writeFile(filePath, fileData);
});

btnDeleteFile.addEventListener("click", () => {
  const folderPath = folderChoose.value;
  const option = dataFolderSelect.value;

  const filePath = folderPath + "\\" + option;

  window.electronAPI.deleteFile(filePath);
});
