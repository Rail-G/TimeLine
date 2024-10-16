/* eslint max-len: 0 */
export default class TimeLine {
  constructor() {
    this.allNews;
    this.input;
  }

  static addNewsHtml(date, text, latitude, longitude) {
    return `
        <div class="news">
                <div class="news-data">
                    <span>${date}</span>
                </div>
                <div class="news-text">
                    <span>${text}</span>
                </div>
                <div class="news-geolocation">
                    <a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}">[${latitude}, ${longitude}]</a>
                </div>
            </div>
            `;
  }

  static addAlertHtml() {
    return `
        <div class="mask">
            <div class="alert-block">
                <div class="alert-head">
                    <h2 class="head-text">Что-то пошло не так</h2>
                </div>
                <div class="alert-body">
                    <p class="body-text">К сожалению, нам не удалось определить ваше местоположения, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
                </div>
                <div class="alert-input-header">
                    <span>Широта и долгота через запятую.
                    <br> Например: 55.55555, 55.55555 </span>
                </div>
                <div class="alert-input">
                    <input type="text">
                </div>
                <div class="alert-btn">
                    <button class="cancel">Cancel</button>
                    <button class="accept">Ok</button>
                </div>
            </div>
        </div>
        `;
  }

  init() {
    this.allNews = document.querySelector('.all-news');
    this.input = document.querySelector('.news-block input')
    this.input.addEventListener('keyup', async (e) => {
      if (e.code == 'Enter' && this.input.value != '') {
        const message = this.input.value;
        const date = this.getDate();
        const geo = await this.getGeolocation();
        if (!geo) return;
        this.input.value = '';
        this.addNews(date, message, geo.latitude, geo.longitude);
      }
    });
  }

  setGeoPositionBlock() {
    const html = TimeLine.addAlertHtml();
    document.querySelector('.news-block').insertAdjacentHTML('beforeend', html);
    const alertBlockInput = document.body.querySelector('.alert-block input');
    alertBlockInput.focus();
    const alertAcceptBtn = document.querySelector('.alert-btn .accept');
    const alertCancelBtn = document.querySelector('.alert-btn .cancel');
    const alertBlock = document.body.querySelector('.mask');
    this.onAccept = this.onAccept.bind(this);
    alertAcceptBtn.addEventListener('click', this.onAccept);
    const onCancel = () => {
      alertBlock.remove();
    };
    alertCancelBtn.addEventListener('click', onCancel);
  }

  validateGeoPosition(position) {
    const regex =
      /^\[?[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)\]?$/;
    return regex.test(position);
  }

  onAccept() {
    const alertBlockInput = document.body.querySelector('.alert-block input');
    const alertBlock = document.body.querySelector('.mask');
    if (alertBlockInput.value != '') {
      const value = alertBlockInput.value;
      const regexResult = this.validateGeoPosition(value);
      if (regexResult) {
        alertBlock.remove();
        const [latitude, longitude] = value.replace(/\[|\s|\]/g, '').split(',');
        const date = this.getDate();
        const message = this.input.value;
        this.input.value = '';
        this.addNews(date, message, latitude, longitude);
      } else {
        const span = document.createElement('span');
        span.classList.add('error-text');
        span.textContent = 'Неправильный формат данных';
        alertBlockInput.classList.add('error');
        alertBlockInput.insertAdjacentElement('beforebegin', span);
        alertBlockInput.onclick = () => {
          alertBlockInput.classList.remove('error');
          span.remove();
          alertBlockInput.onclick = '';
        };
      }
    }
  }

  getGeolocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              const geoData = {latitude, longitude};
              resolve(geoData);
            },
            () => {
              resolve(this.setGeoPositionBlock());
            },
            {enableHighAccuracy: true},
        );
      } else {
        reject(new Error('Geolocation is not supported'));
      }
    });
  }

  getDate() {
    const date = new Date();
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  addNews(date, text, latitude, longitude) {
    const result = TimeLine.addNewsHtml(date, text, latitude, longitude);
    this.allNews.insertAdjacentHTML('beforeend', result);
  }
}
