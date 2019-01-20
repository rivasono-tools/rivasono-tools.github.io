const wysiwygContent = getEl("#wysiwygContent");
const iframeContainer = getEl("#iframeContainer");
const previewIframe = document.createElement("iframe");
let previewIframeDocument = "";
iframeContainer.appendChild(previewIframe);
const wysiwygCssUrls = getEl("#wysiwygCssUrls");
const wysiwygCssRaw = getEl("#wysiwygCssRaw");
const wysiwygCssSaveButton = getEl("#wysiwygCssSaveButton");

document.addEventListener("DOMContentLoaded", () => {
  previewIframeDocument = previewIframe.contentWindow.document;
  initTinyMCE();
  initTabs();

  // EventListeners
  wysiwygCssSaveButton.addEventListener("click", () => {
    updateIframe();
  });
});

function applyCss() {
  const cssUrls = wysiwygCssUrls.value;
  const cssRaw = wysiwygCssRaw.value;
  let cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";
  cssLink.href = cssUrls;
  let cssStyle = document.createElement("link");
  cssStyle.rel = "stylesheet";
  cssStyle.type = "text/css";
  cssStyle.href = "data:text/css;charset=UTF-8," + encodeURIComponent(cssRaw);
  if (cssUrls != "" && !cssStyle != "") {
  } else {
    console.log("hi");
    if (wysiwygContent.value == "") {
      previewIframeDocument.close();
      previewIframeDocument.open();
      previewIframeDocument.write("<span>&nbsp;</span>");
    }
    previewIframeDocument.head.appendChild(cssLink);
    previewIframeDocument.head.appendChild(cssStyle);
  }
}

function updateIframe() {
  previewIframeDocument.close();
  previewIframeDocument.open();
  previewIframeDocument.write(wysiwygContent.value);
  console.log(previewIframeDocument);
  applyCss();
}

// TinyMCE Init
function initTinyMCE() {
  tinymce.init({
    selector: "#wysiwygContent",
    height: 580,
    setup: editor => {
      editor.on("NodeChange", function() {
        editor.save();
        if (!wysiwygContent.value == "") {
          updateIframe();
        }
      });
    },
    theme: "modern",
    plugins: [
      "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
      "searchreplace wordcount visualblocks visualchars fullscreen insertdatetime media mediaembed nonbreaking imagetools",
      "save table contextmenu directionality emoticons template paste textcolor code"
    ],
    toolbar:
      "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | fontsizeselect | code",
    image_advtab: true
  });
}

function initTabs() {
  const tabWrappers = document.querySelectorAll(".tabs");
  if (tabWrappers.length > 0) {
    tabWrappers.forEach(tabWrapper => {
      const tabWrapperUl = tabWrapper.children[0];
      const tabWrapperLiList = tabWrapperUl.children;

      const tabContent = tabWrapper.nextElementSibling;
      const tabContentTabList = tabContent.children;
      for (let tabWrapperLi of tabWrapperLiList) {
        tabWrapperLi.addEventListener("click", () => {
          if (!tabWrapperLi.classList.contains("is-active")) {
            for (let tabWrapperLi of tabWrapperLiList) {
              tabWrapperLi.classList.remove("is-active");
            }
            tabWrapperLi.classList.add("is-active");

            for (let tabContentTab of tabContentTabList) {
              tabContentTab.classList.remove("is-active");
              if (tabWrapperLi.getAttribute("data-tab") == tabContentTab.getAttribute("data-tab")) {
                tabContentTab.classList.add("is-active");
              }
            }
          }
        });
      }
    });
  }
}

// Helper functions
function getEl(selector) {
  const foundElements = document.querySelectorAll(selector);
  if (foundElements.length === 0) {
    throw new Error(`getEl(${selector}) returned no element(s)`);
  } else if (foundElements.length === 1) {
    return foundElements[0];
  } else {
    return foundElements;
  }
}
