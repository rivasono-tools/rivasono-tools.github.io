"use strict";

var wysiwygContent = getEl("#wysiwygContent");
var iframeContainer = getEl("#iframeContainer");
var previewIframe = document.createElement("iframe");
var previewIframeDocument = "";
iframeContainer.appendChild(previewIframe);

document.addEventListener("DOMContentLoaded", function () {
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
    setup: function setup(editor) {
      editor.on("NodeChange", function () {
        editor.save();
        previewIframeDocument.close();
        previewIframeDocument.open();
        previewIframeDocument.write(wysiwygContent.value);
      });
    },
    theme: "modern",
    plugins: ["advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker", "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking", "save table contextmenu directionality emoticons template paste textcolor"],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | code"
  });
}

function initTabs() {
  var tabWrappers = document.querySelectorAll(".tabs");
  if (tabWrappers.length > 0) {
    tabWrappers.forEach(function (tabWrapper) {
      var tabWrapperUl = tabWrapper.children[0];
      var tabWrapperLiList = tabWrapperUl.children;
      var tabWrapperFirstLi = tabWrapperLiList[0];
      if (!tabWrapperFirstLi.classList.contains("is-active")) {
        tabWrapperFirstLi.classList.add("is-active");
      }

      var tabContent = tabWrapper.nextElementSibling;
      var tabContentTabList = tabContent.children;
      var tabContentFirstTab = tabContentTabList[0];
      if (!tabContentFirstTab.classList.contains("is-active")) {
        tabContentFirstTab.classList.add("is-active");
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var tabWrapperLi = _step.value;

          tabWrapperLi.addEventListener("click", function () {
            if (!tabWrapperLi.classList.contains("is-active")) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = tabWrapperLiList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _tabWrapperLi = _step2.value;

                  _tabWrapperLi.classList.remove("is-active");
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              tabWrapperLi.classList.add("is-active");

              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = tabContentTabList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var tabContentTab = _step3.value;

                  tabContentTab.classList.remove("is-active");
                  if (tabWrapperLi.getAttribute("data-tab") == tabContentTab.getAttribute("data-tab")) {
                    tabContentTab.classList.add("is-active");
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            }
          });
        };

        for (var _iterator = tabWrapperLiList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  }
}

// Helper functions
function getEl(selector) {
  var foundElements = document.querySelectorAll(selector);
  if (foundElements.length === 0) {
    throw new Error("getEl(" + selector + ") returned no element(s)");
  } else if (foundElements.length === 1) {
    return foundElements[0];
  } else {
    return foundElements;
  }
}