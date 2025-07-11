const photos = [
  // "img/compressed/headshot-00003.jpeg",
  // "img/compressed/headshot-00004.jpeg",
  // "img/compressed/lifestyle-00001.jpeg",
  "img/compressed/landscape-00003.jpeg",
  "img/compressed/headshot-00005.jpeg",
  "img/compressed/abstract-00005.jpeg",
  "img/compressed/lifestyle-00002.jpeg",
  "img/compressed/lifestyle-00003.jpeg",
  "img/compressed/abstract-00003.jpeg",
  "img/compressed/abstract-00004.jpeg",
  "img/compressed/places-00003.jpeg",
  "img/compressed/editorial-00001.jpeg",
  "img/compressed/headshot-00001.jpeg",
  "img/compressed/places-00001.jpeg",
  "img/compressed/landscape-00001.jpeg",
  "img/compressed/lifestyle-00006.jpeg",
  "img/compressed/places-00006.jpeg",
  "img/compressed/places-00004.jpeg",
  "img/compressed/places-00005.jpeg",
  "img/compressed/headshot-00002.jpeg",
  "img/compressed/lifestyle-00004.jpeg",
  "img/compressed/lifestyle-00005.jpeg",
  "img/compressed/abstract-00001.jpeg",
  "img/compressed/places-00002.jpeg",
  "img/compressed/places-00007.jpeg",
  "img/compressed/headshot-00006.jpeg",
  "img/compressed/abstract-00002.jpeg",
  "img/compressed/places-00008.jpeg",
];

document.body.onload = LoadImage;
document.addEventListener("scroll", () => {
  LoadImage();
});

const photorollEl = document.getElementById("photoroll");

let photoIndex = 0;

function LoadImage() {
  if (
    photos[photoIndex] &&
    photorollEl.offsetTop + photorollEl.offsetHeight <
      window.innerHeight + window.scrollY
  ) {
    var img = new Image();
    img.src = photos[photoIndex];
    photorollEl.append(img);
    photoIndex++;

    img.onload = function () {
      LoadImage();
    };
  }
}
