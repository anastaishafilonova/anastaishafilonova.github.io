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
function startTimer() {
  const countdown = setInterval(function() {
    let final_time = new Date("May 23, 2024 09:00:00");
    let cur_time = new Date();

    count = (final_time - cur_time) / 1000;

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


//валидация формы
const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = errorMessage;
    errorElement.classList.add('edit-form__error_active');
};
  
const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.classList.remove('edit-form__error_active');
    errorElement.textContent = '';
};
  
const checkInputValidity = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(formElement, inputElement);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((input => {
      return !input.validity.valid;
    }));
};
const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add('edit-form__save-btn_inactive');
      buttonElement.setAttribute('disabled', true);
    } else {
      buttonElement.classList.remove('edit-form__save-btn_inactive');
      buttonElement.removeAttribute('disabled');
    }
};
  
const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll('.form__input'));
    const buttonElement = formElement.querySelector('.form__submit');
    toggleButtonState(inputList, buttonElement);
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputList, buttonElement);
      });
    });
};
  

const editForm = document.querySelector('.edit-form');
editForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitForm(editForm);
});

setEventListeners(editForm);
const inputTel = editForm.querySelector('#form-tel');
inputTel.addEventListener('keypress', (evt) => {
    if (isNaN(Number(evt.key))) {
        evt.preventDefault();
    }
});


// отправка формы
function submitForm(form) {
    const btn = form.querySelector('.form__submit');
    btn.value = "Отправляем";
    btn.classList.add("button-loading");
    btn.disabled = true;
    document.body.style.cursor = 'wait';

    fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: ''
    }).then((response) => {
        if (response.ok) {
          btn.value = "Успешно отправлено";
          btn.classList.remove("button-loading");
          btn.classList.add("button-success");
          document.body.style.cursor = 'default';
          let inputList = Array.from(form.querySelectorAll('.form__input'));
          inputList.forEach(input => input.value='');
          setTimeout(closePopup(form.parentElement.parentElement), 5000)
        } else {
          btn.value = "Ошибка!";
          btn.classList.remove("button-loading");
          btn.classList.add("button-failure");
          document.body.style.cursor = 'default';
        }
      })
}