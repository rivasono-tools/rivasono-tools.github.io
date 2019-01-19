const wysiwygContent = getEl("#wysiwygContent");
const iframeContainer = getEl("#iframeContainer");
const previewIframe = document.createElement("iframe");
let previewIframeDocument = "";
iframeContainer.appendChild(previewIframe);

document.addEventListener("DOMContentLoaded", () => {
  previewIframeDocument = previewIframe.contentWindow.document;
  initTinyMCE();
  initTabs();

  // EventListeners
});

// TinyMCE Init
function initTinyMCE() {
  tinymce.init({
    selector: "#wysiwygContent",
    height: 580,
    setup: editor => {
      editor.on("NodeChange", function() {
        editor.save();
        previewIframeDocument.close();
        previewIframeDocument.open();
        previewIframeDocument.write(wysiwygContent.value);
      });
    },
    theme: "modern",
    plugins: [
      "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
      "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
      "save table contextmenu directionality emoticons template paste textcolor"
    ],
    toolbar:
      "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | code"
  });
}

function initTabs() {
  const tabWrappers = document.querySelectorAll(".tabs");
  if (tabWrappers.length > 0) {
    tabWrappers.forEach(tabWrapper => {
      const tabWrapperUl = tabWrapper.children[0];
      const tabWrapperLiList = tabWrapperUl.children;
      const tabWrapperFirstLi = tabWrapperLiList[0];
      if (!tabWrapperFirstLi.classList.contains("is-active")) {
        tabWrapperFirstLi.classList.add("is-active");
      }

      const tabContent = tabWrapper.nextElementSibling;
      const tabContentTabList = tabContent.children;
      const tabContentFirstTab = tabContentTabList[0];
      if (!tabContentFirstTab.classList.contains("is-active")) {
        tabContentFirstTab.classList.add("is-active");
      }
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
