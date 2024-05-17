const popupClosers = Array.from(document.querySelectorAll('.popup__closer'));
const headerBtn = document.querySelector('.header__btn');
const popupForm = document.querySelector('.popup-form');
const hobbiInformationTitle = document.querySelector('.hobbi-information__title');
const popupMessage = document.querySelector('.popup-message');
const messageCloser = document.querySelector('.message__closer');
const photos = Array.from(document.querySelectorAll('.gallery__photo'));

popupClosers.forEach(item => item.addEventListener('click', event => closePopup(event.target.parentElement)));
messageCloser.addEventListener('click', () => closePopup(popupMessage));
headerBtn.addEventListener('click', () => openPopup(popupForm));

function closePopup(popup) {
    popup.classList.remove("popup_opened");
}

function openPopup(popup) {
    popup.classList.add('popup_opened');
}

window.addEventListener('scroll', function() {
    let header = document.querySelector('.header');
    
    let mainInformation = document.querySelector('.main-information');
    let mainInformationHeight = mainInformation.offsetHeight;
    let scrollPosition = document.documentElement.scrollTop;
    
    if (scrollPosition >= mainInformationHeight) {
      header.classList.add('header_fixed');
    } else {
      header.classList.remove('header_fixed');
    }
});

if (sessionStorage["popupWasClosed"] != 'yes') {
    setTimeout(function() {
        openPopup(popupMessage);
        sessionStorage["popupWasClosed"] = 'yes';
    }, 30000);
}

// таймер
let count = localStorage["curCount"] || 7860*60;  // в секундах
function startTimer() {
  const countdown = setInterval(function() {
    count--;

    let day = Math.floor(count / (60*60*24));
    let hour = Math.floor((count % (60*60*24)) / (60*60))
    let min = Math.floor((count % (60*60)) / (60));
    let sec = Math.floor( (count % (60)) );

    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    document.querySelector('.timer').innerHTML = day + ":" + hour + ":" + min + ":" + sec;

    if (count <= 0) {
      clearInterval(countdown);
      document.querySelector('.timer').innerHTML = "Удачи";
    }

    localStorage["curCount"] = count;
  }, 1000);
}

startTimer();

function openPhotoPopup(curPopup) {
    const leftArrow = curPopup.querySelector('.popup__left-arrow');
    const rightArrow = curPopup.querySelector('.popup__right-arrow');
    openPopup(curPopup);
    const curPhoto = curPopup.previousElementSibling;
    if (curPhoto.previousElementSibling === null) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = 'block';
    }
    if (curPhoto.nextElementSibling.nextElementSibling === null) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = 'block';
    }
    leftArrow.addEventListener('click', function () {
        closePopup(curPopup);
        openPhotoPopup(curPhoto.previousElementSibling);
    });
    rightArrow.addEventListener('click', function () {
        closePopup(curPopup);
        openPhotoPopup(curPopup.nextElementSibling.nextElementSibling);
    });
}

photos.forEach(function (item) {
    item.addEventListener('click', function(event) {
        const curPhoto = event.target;
        const curPopup = curPhoto.nextElementSibling;
        const leftArrow = curPopup.querySelector('.popup__left-arrow');
        const rightArrow = curPopup.querySelector('.popup__right-arrow');
        openPhotoPopup(curPopup);
        });
});
