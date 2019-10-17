(function() {
  // DOM Elements
  const DOM = {
    header: getEl("header"),
    sideBar: getEl("#side-bar"),
    previewImg: getEl("#previewImg"),
    panelSizeContainer: getEl("#panel-size-container"),
    panelWidthInput: getEl("#panel-width"),
    panelHeightInput: getEl("#panel-height"),
    panelSizeConfirmButton: getEl("#panel-size-confirm"),
    imageUploadContainer: getEl("#image-upload-container"),
    panelRatioLabel: getEl("#panel-ratio-label"),
    panelPixelRatioLabelDpi40: getEl("#panel-pixel-ratio-label-dpi40"),
    panelPixelRatioLabelDpi55: getEl("#panel-pixel-ratio-label-dpi55"),
    panelPixelRatioLabelDpi70: getEl("#panel-pixel-ratio-label-dpi70"),
    panelPixelRatioLabelDpi100: getEl("#panel-pixel-ratio-label-dpi100"),
    cropperContainer: getEl(".cropper-container"),
    cropper: getEl(".cropper"),
    liveDpi: getEl("#liveDpi"),
    liveResolution: getEl("#liveResolution"),
    cropButton: getEl("#cropButton"),
    cropModal: getEl("#cropModal"),
    cropModalImg: getEl("#cropModalImg"),
    cropModalFileNameInput: getEl("#cropModalFileNameInput"),
    cropModalSaveButton: getEl("#cropModalSaveButton"),
    closeCropModalButton: getEl("#closeCropModalButton"),
    cropperMirrorButtonHorizontal: getEl(".cropper-mirror-button-horizontal"),
    cropperMirrorButtonVertical: getEl(".cropper-mirror-button-vertical"),
    dpiQualityIndicator: getEl("#dpiQualityIndicator")
  };

  let changelog = {
    lastEntry: "13-06-2019"
  };

  if (localStorage.getItem("lastReadChangelog") !== changelog.lastEntry) {
    openChangeLogModal();
  }

  window.onload = () => {
    getEl(".header-title").style["padding-left"] = DOM.sideBar.clientWidth + "px";
    DOM.cropperContainer.style["padding-top"] = DOM.header.clientHeight + 32 + "px";
  };

  // Uploaded image properties
  let uploadedFile = {
    isUploaded: false,
    type: "",
    url: "",
    width: 0,
    height: 0,
    ratio: {
      width: 0,
      height: 0
    },
    orientation: {
      x: "normal",
      y: "normal"
    }
  };

  // Panel properties
  let panel = {
    isSpecified: false,
    width: 0,
    height: 0,
    ratio: {
      width: 0,
      height: 0
    }
  };

  // Cropped image properties
  let fileToDownload = {
    blob: "",
    name: "",
    dpi: ""
  };

  // Cropper properties
  let croppie = {
    instance: "",
    isInitialized: false,
    width: 600,
    height: 600
  };

  // Functions
  function loadingSpinner(showOrHide) {
    //changeVisibility(showOrHide, [getEl("#loadingSpinnerModal")]);
  }

  function validateAndSavePanelSizeValues() {
    panel.width = DOM.panelWidthInput.value;
    panel.height = DOM.panelHeightInput.value;
    if (panel.width === "") {
      alert("Paneelbreedte is onjuist ingevoerd! Gebruik een komma in plaats van een punt.");
    } else if (panel.height === "") {
      alert("Paneelhoogte is onjuist ingevoerd! Gebruik een komma in plaats van een punt.");
    } else if (isNaN(panel.width)) {
      alert("Ingevoerde paneelbreedte is geen getal!");
    } else if (isNaN(panel.height)) {
      alert("Ingevoerde paneelhoogte is geen getal!");
    } else if (panel.width <= 0) {
      alert("Paneelbreedte mag niet 0 of minder zijn!");
    } else if (panel.height <= 0) {
      alert("Paneelbreedte mag niet 0 of minder zijn!");
    } else {
      panel.width = panel.width.replace(",", ".");
      panel.height = panel.height.replace(",", ".");
      panel.width = Number(panel.width);
      panel.height = Number(panel.height);
      if (panel.width.countDecimals() > 1) {
        alert("Ingevoerde paneelbreedte heeft teveel decimalen! Het maximum is 1.");
      } else if (panel.height.countDecimals() > 1) {
        alert("Ingevoerde paneelhoogte heeft teveel decimalen! Het maximum is 1.");
      } else {
        calculateRatio(panel);
        showPanelRatio();
      }
    }
  }

  function calculateRatio(source) {
    let isWidthLonger = "";
    if (source.width > source.height) {
      isWidthLonger = true;
    } else if (source.width < source.height) {
      isWidthLonger = false;
    } else {
      isWidthLonger = true;
    }
    let biggerRatioPart = "";
    if (isWidthLonger) {
      biggerRatioPart = source.width / source.height;
    } else {
      biggerRatioPart = source.height / source.width;
    }
    biggerRatioPart = roundTo(2, biggerRatioPart);
    if (isWidthLonger) {
      source.ratio.width = biggerRatioPart;
      source.ratio.height = 1;
    } else {
      source.ratio.height = biggerRatioPart;
      source.ratio.width = 1;
    }
  }

  function showPanelRatio() {
    DOM.panelRatioLabel.innerHTML = `${panel.ratio.width} : ${panel.ratio.height}`;
    const panelWidthInches = panel.width / 2.54;
    const panelHeightInches = panel.height / 2.54;
    const panelPixelWidthDpi40 = roundTo(0, panelWidthInches * 40);
    const panelPixelHeightDpi40 = roundTo(0, panelHeightInches * 40);
    const panelPixelWidthDpi55 = roundTo(0, panelWidthInches * 55);
    const panelPixelHeightDpi55 = roundTo(0, panelHeightInches * 55);
    const panelPixelWidthDpi70 = roundTo(0, panelWidthInches * 70);
    const panelPixelHeightDpi70 = roundTo(0, panelHeightInches * 70);
    const panelPixelWidthDpi100 = roundTo(0, panelWidthInches * 100);
    const panelPixelHeightDpi100 = roundTo(0, panelHeightInches * 100);
    DOM.panelPixelRatioLabelDpi40.innerHTML = `${panelPixelWidthDpi40} x ${panelPixelHeightDpi40} pixels`;
    DOM.panelPixelRatioLabelDpi55.innerHTML = `${panelPixelWidthDpi55} x ${panelPixelHeightDpi55} pixels`;
    DOM.panelPixelRatioLabelDpi70.innerHTML = `${panelPixelWidthDpi70} x ${panelPixelHeightDpi70} pixels`;
    DOM.panelPixelRatioLabelDpi100.innerHTML = `${panelPixelWidthDpi100} x ${panelPixelHeightDpi100} pixels`;
    panel.isSpecified = true;
  }

  function checkUploadedFileFiletype(dataURL) {
    if (dataURL.substring(5, 15) === "image/jpeg") {
      return "jpeg";
    } else if (dataURL.substring(5, 14) === "image/png") {
      return "png";
    } else if (dataURL.substring(5, 20) === "application/pdf") {
      return "pdf";
    } else {
      return "other";
    }
  }

  function convertFromPdfToJpegAndPreview() {
    pdfjsLib.getDocument(uploadedFile.url).then(pdf => {
      const pdfCanvas = getEl("#pdfCanvas");
      pdf.getPage(1).then(page => {
        const renderContext = {
          canvasContext: pdfCanvas.getContext("2d"),
          viewport: page.getViewport(1)
        };
        pdfCanvas.width = renderContext.viewport.width;
        pdfCanvas.height = renderContext.viewport.height;
        page.render(renderContext).then(() => {
          const pdfToJpgUrl = pdfCanvas.toDataURL("image/jpeg");
          uploadedFile.url = pdfToJpgUrl;
          previewUploadedImg();
        });
      });
    });
  }

  function previewUploadedImg() {
    getEl(".file-uploaded-message").innerHTML = `${uploadInput.files[0].name}`;
    getEl(".file-uploaded-message").setAttribute("title", `${uploadInput.files[0].name}`);
    previewImg.setAttribute("src", uploadedFile.url);
    previewImg.onload = () => {
      uploadedFile.width = previewImg.naturalWidth;
      uploadedFile.height = previewImg.naturalHeight;
      calculateRatio(uploadedFile);
      getEl("#imgRatio").innerHTML = `${uploadedFile.ratio.width} : ${uploadedFile.ratio.height}`;
      getEl("#imgResolution").innerHTML = `${uploadedFile.width} x ${uploadedFile.height}`;
      getEl("#imgMaxSize40dpi").innerHTML =
        roundTo(1, (uploadedFile.width / 40) * 2.54) + " x " + roundTo(1, (uploadedFile.height / 40) * 2.54);
      getEl("#imgMaxSize55dpi").innerHTML =
        roundTo(1, (uploadedFile.width / 55) * 2.54) + " x " + roundTo(1, (uploadedFile.height / 55) * 2.54);
      getEl("#imgMaxSize70dpi").innerHTML =
        roundTo(1, (uploadedFile.width / 70) * 2.54) + " x " + roundTo(1, (uploadedFile.height / 70) * 2.54);
      getEl("#imgMaxSize100dpi").innerHTML =
        roundTo(1, (uploadedFile.width / 100) * 2.54) + " x " + roundTo(1, (uploadedFile.height / 100) * 2.54);
      uploadedFile.isUploaded = true;
      loadCropper();
    };
  }

  function loadCropper() {
    if (uploadedFile.isUploaded && panel.isSpecified) {
      loadingSpinner("show");
      changeVisibility("hide", [DOM.previewImg]);
      if (croppie.isInitialized) {
        croppieInstance.destroy();
        croppie.isInitialized = false;
      }
      if (!croppie.isInitialized) {
        croppieInstance = new Croppie(DOM.cropper, {
          enableExif: true,
          enableOrientation: true,
          viewport: { width: croppie.width / panel.ratio.height, height: croppie.height / panel.ratio.width },
          boundary: { width: croppie.width, height: croppie.height }
        });
        croppie.isInitialized = true;
      }
      croppieInstance.bind({ url: uploadedFile.url, zoom: 0 });
      DOM.cropper.addEventListener("update", e => {
        let liveCropWidth = Number(e.detail.points[2]) - Number(e.detail.points[0]);
        let liveCropHeight = Number(e.detail.points[3]) - Number(e.detail.points[1]);
        DOM.liveResolution.innerHTML = `${liveCropWidth} x ${liveCropHeight}`;
        let liveDpiValue = roundTo(0, liveCropWidth / (panel.width / 2.54));
        fileToDownload.dpi = liveDpiValue;
        DOM.liveDpi.innerHTML = liveDpiValue;
        if (liveDpiValue < 40) {
          DOM.dpiQualityIndicator.innerHTML =
            "<svg class='icon left error' aria-hidden='true' focusable='false'><use xlink:href='img/symbol-defs.svg#icon-alert-circle-outline'></use></svg>De dpi is minder dan 40 en is te laag, afbeelding wordt onscherp.";
        } else if (liveDpiValue < 55) {
          DOM.dpiQualityIndicator.innerHTML =
            "<svg class='icon left warning' aria-hidden='true' focusable='false'><use xlink:href='img/symbol-defs.svg#icon-alert-triangle-outline'></use></svg>De dpi is tussen de 41 en 55, afbeelding wordt enigszins onscherp van dichtbij.";
        } else if (liveDpiValue < 70) {
          DOM.dpiQualityIndicator.innerHTML =
            "<svg class='icon left success' aria-hidden='true' focusable='false'><use xlink:href='img/symbol-defs.svg#icon-checkmark-circle-2-outline'></use></svg>De dpi is tussen de 56 en 70, dit is een goede scherpte.";
        } else {
          DOM.dpiQualityIndicator.innerHTML =
            "<svg class='icon left perfect' aria-hidden='true' focusable='false'><use xlink:href='img/symbol-defs.svg#icon-checkmark-circle-2-outline'></use></svg>De dpi is boven de 70! De afbeelding wordt zeer scherp.";
        }
      });
      getEl(".cropper-rotate-button-left").addEventListener("click", () => {
        croppieInstance.rotate(90);
      });
      getEl(".cropper-rotate-button-right").addEventListener("click", () => {
        croppieInstance.rotate(-90);
      });
      loadingSpinner("hide");
      changeVisibility("show", [getEl(".cropper-rotate-buttons")]);
      changeVisibility("show", [DOM.cropButton]);
    }
  }

  function openCropModal() {
    changeVisibility("show", [DOM.cropModal]);
    croppieInstance.result({ type: "blob", size: "original", format: "jpeg", quality: 1 }).then(blob => {
      const filenameSplitFromExtension = uploadInput.files[0].name.split(".");
      fileToDownload.name = `${filenameSplitFromExtension[0]}_BxH-${panel.width}x${panel.height}_DPI-${
        fileToDownload.dpi
      }.jpg`;
      DOM.cropModalFileNameInput.value = fileToDownload.name;
      const croppedImageUrl = URL.createObjectURL(blob);
      DOM.cropModalImg.setAttribute("src", croppedImageUrl);
      /* changeDpiBlob(blob, fileToDownload.dpi).then(blob => {
        fileToDownload.blob = blob;
      }); */
      changeDpiBlob(blob, 300).then(blob => {
        fileToDownload.blob = blob;
      });
    });
  }

  function closeChangelogModal() {
    getEl("#changelogModal").classList.add("hidden");
    localStorage.setItem("lastReadChangelog", changelog.lastEntry);
  }

  function openChangeLogModal() {
    getEl("#changelogModal").classList.remove("hidden");
  }

  function closeColorConverterModal() {
    getEl("#colorConverterModal").classList.add("hidden");
  }

  function openColorConverterModal() {
    getEl("#colorConverterModal").classList.remove("hidden");
  }

  // Event listeners
  DOM.cropModalSaveButton.addEventListener("click", () => {
    if (DOM.cropModalFileNameInput.value !== "") {
      fileToDownload.name = DOM.cropModalFileNameInput.value;
      download(fileToDownload.blob, fileToDownload.name, "image/jpg");
    } else {
      alert("Bestandsnaam is niet correct ingevuld.");
    }
  });

  DOM.panelSizeConfirmButton.addEventListener("click", () => {
    validateAndSavePanelSizeValues();
    loadCropper();
  });

  DOM.panelHeightInput.addEventListener("keyup", e => {
    e.preventDefault();
    if (e.keyCode === 13) {
      validateAndSavePanelSizeValues();
      loadCropper();
    }
  });

  DOM.panelWidthInput.addEventListener("keyup", e => {
    e.preventDefault();
    if (e.keyCode === 13) {
      validateAndSavePanelSizeValues();
      loadCropper();
    }
  });

  uploadInput.addEventListener("change", () => {
    loadingSpinner("show");
    const fileReader = new FileReader();
    fileReader.onload = () => {
      uploadedFile.url = fileReader.result;
      uploadedFile.type = checkUploadedFileFiletype(uploadedFile.url);
      if (uploadedFile.type === "pdf") {
        convertFromPdfToJpegAndPreview();
      } else if (uploadedFile.type === "other") {
        alert("Bestand is geen jpeg/jpg, png of pdf.");
      } else {
        previewUploadedImg();
      }
    };
    fileReader.readAsDataURL(uploadInput.files[0]);
  });

  DOM.cropButton.addEventListener("click", () => {
    openCropModal();
  });

  DOM.closeCropModalButton.addEventListener("click", () => {
    changeVisibility("hide", [DOM.cropModal]);
  });

  DOM.cropperMirrorButtonHorizontal.addEventListener("click", () => {
    if (uploadedFile.orientation.x === "normal") {
      croppieInstance.bind({ url: uploadedFile.url, zoom: 0, orientation: 2 });
      uploadedFile.orientation.x = "flipped";
    } else {
      croppieInstance.bind({ url: uploadedFile.url, zoom: 0, orientation: 1 });
      uploadedFile.orientation.x = "normal";
    }
  });

  DOM.cropperMirrorButtonVertical.addEventListener("click", () => {
    if (uploadedFile.orientation.y === "normal") {
      croppieInstance.bind({ url: uploadedFile.url, zoom: 0, orientation: 4 });
      uploadedFile.orientation.y = "flipped";
    } else {
      croppieInstance.bind({ url: uploadedFile.url, zoom: 0, orientation: 1 });
      uploadedFile.orientation.y = "normal";
    }
  });

  getEl("#changelogReadButton").addEventListener("click", () => {
    closeChangelogModal();
  });

  getEl("#changelogCloseButton").addEventListener("click", () => {
    closeChangelogModal();
  });

  getEl("#openChangelogButton").addEventListener("click", () => {
    openChangeLogModal();
  });

  getEl("#colorConverterCloseButtonFooter").addEventListener("click", () => {
    closeColorConverterModal();
  });

  getEl("#colorConverterCloseButton").addEventListener("click", () => {
    closeColorConverterModal();
  });

  getEl("#openColorConverterButton").addEventListener("click", () => {
    openColorConverterModal();
  });

  // Common functions

  function changeVisibility(showOrHide, elementsList) {
    if (showOrHide === "show") {
      for (i = 0; i < elementsList.length; i++) {
        elementsList[i].classList.remove("hidden");
      }
    } else {
      for (i = 0; i < elementsList.length; i++) {
        elementsList[i].classList.add("hidden");
      }
    }
  }

  Number.prototype.countDecimals = function() {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
  };

  function roundTo(decimals, value) {
    return parseFloat(value.toFixed(decimals));
  }

  function getEl(selector) {
    const foundElements = document.querySelectorAll(selector);
    if (foundElements.length === 0) {
      throw new Error(`getEl(${selector}) returned no element(s)`);
    } else if (foundElements.length === 1) {
      const foundElement = foundElements[0];
      return foundElement;
    } else {
      return foundElements;
    }
  }
})();
