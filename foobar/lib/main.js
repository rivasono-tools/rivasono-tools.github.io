"use strict";

var wysiwygContent = getEl("#wysiwygContent");
var akoestiekDirectCssButton = getEl("#akoestiekDirectCssButton");

document.addEventListener("DOMContentLoaded", function () {
  initTinyMCE();

  akoestiekDirectCssButton.addEventListener("click", () => {
    initTinyMCE(
      [
        "https://cdn.shopify.com/s/files/1/0528/8227/6515/t/4/assets/theme.css?v=" +
        makeid(10),
        "https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&family=Rubik:wght@400;500;600;700&display=swap"
      ],
      `
        body {
          background-color: unset;
          color: unset;
          font-family: unset;
          font-size: unset;
          line-height: unset;
          scrollbar-3dlight-color: #F0F0EE;
          scrollbar-arrow-color: #676662;
          scrollbar-base-color: #F0F0EE;
          scrollbar-darkshadow-color: #DDDDDD;
          scrollbar-face-color: #E0E0DD;
          scrollbar-highlight-color: #F0F0EE;
          scrollbar-shadow-color: #F0F0EE;
          scrollbar-track-color: #F5F5F5;
        }

        td,
        th {
          font-family: unset;
          font-size: unset;
        }

        :root {
          --default-text-font-size : 15px;
          --base-text-font-size    : 15px;
          --heading-font-family    : Oxygen, sans-serif;
          --heading-font-weight    : 700;
          --heading-font-style     : normal;
          --text-font-family       : Rubik, sans-serif;
          --text-font-weight       : 400;
          --text-font-style        : normal;
          --text-font-bolder-weight: 500;
          --text-link-decoration   : underline;

          --text-color               : #132a40;
          --text-color-rgb           : 19, 42, 64;
          --heading-color            : #1c3f61;
          --border-color             : #e8e8e8;
          --border-color-rgb         : 232, 232, 232;
          --form-border-color        : #dbdbdb;
          --accent-color             : #ea580d;
          --accent-color-rgb         : 234, 88, 13;
          --link-color               : #ea580d;
          --link-color-hover         : #a23d09;
          --background               : #f5f5f5;
          --secondary-background     : #ffffff;
          --secondary-background-rgb : 255, 255, 255;
          --accent-background        : rgba(234, 88, 13, 0.08);

          --input-background: #ffffff;

          --error-color       : #ea580d;
          --error-background  : rgba(234, 88, 13, 0.07);
          --success-color     : #1c7b36;
          --success-background: rgba(28, 123, 54, 0.11);

          --primary-button-background      : #ea580d;
          --primary-button-background-rgb  : 234, 88, 13;
          --primary-button-text-color      : #ffffff;
          --secondary-button-background    : #1c3f61;
          --secondary-button-background-rgb: 28, 63, 97;
          --secondary-button-text-color    : #ffffff;

          --header-background      : #1c3f61;
          --header-text-color      : #ffffff;
          --header-light-text-color: #e8e8e8;
          --header-border-color    : rgba(232, 232, 232, 0.3);
          --header-accent-color    : #ea580d;

          --footer-background-color:    #1c3f61;
          --footer-heading-text-color:  #ffffff;
          --footer-body-text-color:     #ffffff;
          --footer-body-text-color-rgb: 255, 255, 255;
          --footer-accent-color:        #ea580d;
          --footer-accent-color-rgb:    234, 88, 13;
          --footer-border:              none;

          --flickity-arrow-color: #b5b5b5;--product-on-sale-accent           : #ea580d;
          --product-on-sale-accent-rgb       : 234, 88, 13;
          --product-on-sale-color            : #ffffff;
          --product-in-stock-color           : #1c7b36;
          --product-low-stock-color          : #ea580d;
          --product-sold-out-color           : #8a9297;
          --product-custom-label-1-background: #3f6ab1;
          --product-custom-label-1-color     : #ffffff;
          --product-custom-label-2-background: #8a44ae;
          --product-custom-label-2-color     : #ffffff;
          --product-review-star-color        : #ffbd00;

          --mobile-container-gutter : 20px;
          --desktop-container-gutter: 40px;
        }
      `
    );
  });
});

function applyCss() {
  var cssUrls = wysiwygCssUrls.value.split(",");
  var cssRaw = wysiwygCssRaw.value;
  initTinyMCE(cssUrls, cssRaw);
}

// TinyMCE Init
function initTinyMCE(contentCSS, contentStyle) {
  console.log("initting");
  tinymce.remove();
  tinymce.init({
    selector: "#wysiwygContent",
    height: "100%",
    setup: function setup(editor) {
      editor.on("NodeChange", function () {
        editor.save();
      });
    },
    content_css: contentCSS,
    content_style: contentStyle,
    theme: "silver",
    plugins: [
      "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
      "searchreplace wordcount visualblocks visualchars fullscreen insertdatetime media nonbreaking imagetools",
      "save table contextmenu directionality emoticons template paste textcolor code"
    ],
    toolbar:
      "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | fontsizeselect | code",
    image_advtab: true
  });
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

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
