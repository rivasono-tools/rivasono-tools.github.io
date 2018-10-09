(() => {
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
    panelPixelRatioLabelDpi50: getEl("#panel-pixel-ratio-label-dpi50"),
    panelPixelRatioLabelDpi100: getEl("#panel-pixel-ratio-label-dpi100"),
    cropperContainer: getEl(".cropper-container"),
    cropper: getEl(".cropper"),
    liveDpi: getEl("#liveDpi"),
    liveResolution: getEl("#liveResolution"),
    cropButton: getEl("#cropButton"),
    cropModal: getEl("#cropModal"),
    cropModalImg: getEl("#cropModalImg"),
    cropModalFileNameInput: getEl("#cropModalFileNameInput"),
    cropModalSaveButton: getEl("#cropModalSaveButton")
  };

  window.onload = () => {
    getEl(".header-title").style["padding-left"] = DOM.sideBar.clientWidth + "px";
    DOM.cropperContainer.style["padding-top"] = DOM.header.clientHeight + "px";
  };

  // Uploaded image properties
  let uploadedImg = {
    isUploaded: false,
    url: "",
    width: 0,
    height: 0,
    ratio: {
      width: 0,
      height: 0
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
  let croppedImg = {};

  // Cropper properties
  let croppie = {
    instance: "",
    isInitialized: false,
    width: 600,
    height: 600
  };

  // Global functions
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
    const panelPixelWidthDpi50 = roundTo(0, panelWidthInches * 50);
    const panelPixelHeightDpi50 = roundTo(0, panelHeightInches * 50);
    const panelPixelWidthDpi100 = roundTo(0, panelWidthInches * 100);
    const panelPixelHeightDpi100 = roundTo(0, panelHeightInches * 100);
    DOM.panelPixelRatioLabelDpi50.innerHTML = `${panelPixelWidthDpi50} x ${panelPixelHeightDpi50} pixels`;
    DOM.panelPixelRatioLabelDpi100.innerHTML = `${panelPixelWidthDpi100} x ${panelPixelHeightDpi100} pixels`;
    panel.isSpecified = true;
  }

  function loadCropper() {
    if (uploadedImg.isUploaded && panel.isSpecified) {
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
      croppieInstance.bind({ url: uploadedImg.url, zoom: 0 });
      DOM.cropper.addEventListener("update", e => {
        let liveCropWidth = Number(e.detail.points[2]) - Number(e.detail.points[0]);
        let liveCropHeight = Number(e.detail.points[3]) - Number(e.detail.points[1]);
        DOM.liveDpi.innerHTML = roundTo(0, liveCropWidth / (panel.width / 2.54));
        DOM.liveResolution.innerHTML = `${liveCropWidth} x ${liveCropHeight}`;
      });
      getEl(".cropper-rotate-button-left").addEventListener("click", () => {
        croppieInstance.rotate(90);
      });
      getEl(".cropper-rotate-button-right").addEventListener("click", () => {
        croppieInstance.rotate(-90);
      });
      changeVisibility("show", [getEl(".cropper-rotate-buttons")]);
      changeVisibility("show", [DOM.cropButton]);
    }
  }

  function openCropModal() {
    changeVisibility("show", [DOM.cropModal]);
    croppieInstance.result({ type: "blob", size: "original", format: "jpeg" }).then(blob => {
      const filenameSplitFromExtension = uploadInput.files[0].name.split(".");
      const newFileName = `${filenameSplitFromExtension[0]}-BxH${panel.width}x${panel.height}-cropped.jpg`;
      DOM.cropModalFileNameInput.value = newFileName;
      const croppedImageUrl = URL.createObjectURL(blob);
      DOM.cropModalImg.setAttribute("src", croppedImageUrl);
      DOM.cropModalSaveButton.addEventListener("click", () => {
        download(blob, newFileName, "image/jpg");
      });
    });

  }

  // Event listeners
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
    const reader = new FileReader();
    reader.onload = () => {
      uploadedImg.url = reader.result;
      getEl(".file-uploaded-message").innerHTML = `Geüpload: ${uploadInput.files[0].name}`;
      previewImg.setAttribute("src", uploadedImg.url);
      previewImg.onload = () => {
        uploadedImg.width = previewImg.naturalWidth;
        uploadedImg.height = previewImg.naturalHeight;
        calculateRatio(uploadedImg);
        getEl("#imgRatio").innerHTML = `${uploadedImg.ratio.width} : ${uploadedImg.ratio.height}`;
        getEl("#imgResolution").innerHTML = `${uploadedImg.width} x ${uploadedImg.height}`;
        getEl("#imgMaxSize50dpi").innerHTML =
          roundTo(1, (uploadedImg.width / 50) * 2.54) + " x " + roundTo(1, (uploadedImg.height / 50) * 2.54);
        getEl("#imgMaxSize100dpi").innerHTML =
          roundTo(1, (uploadedImg.width / 100) * 2.54) + " x " + roundTo(1, (uploadedImg.height / 100) * 2.54);
        uploadedImg.isUploaded = true;
        loadCropper();
      };
    };
    reader.readAsDataURL(uploadInput.files[0]);
  });

  DOM.cropButton.addEventListener("click", () => {
    openCropModal();
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
