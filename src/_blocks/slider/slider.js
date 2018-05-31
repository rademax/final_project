var timer;

let slider = {
    slides: document.getElementsByClassName('slider__item'),
    slider_items: document.getElementsByClassName('slider__buttons')[0],
    current: 0,
    init: function () {
        for(let i = 0; i < this.slides.length; i++) {
            let button = this.createButton(i);
            this.slider_items.appendChild(button);
        }
        this.buttons = this.slider_items.getElementsByTagName('li');
    },
    createButton: function (i) {
        let li = document.createElement('li');
        li.innerHTML = '' + i;
        (i === 0) ? li.className = 'active': '';
        li.id = 'slide' + i;
        li.onclick = function () {
            slider.set(i);
        };
        return li;
    },
    set: function (slideNumber) {
        this.remove();
        this.slides[slideNumber].classList.add('active');
        this.buttons[slideNumber].classList.add('active');
    },
    remove: function () {
        for(let slide of this.slides) {
            if(slide.classList.contains('active')) {
                slide.classList.remove('active');
            }
        }
        for(let button of this.buttons) {
            if(button.classList.contains('active')) {
                button.classList.remove('active');
            }
        }
    },
    left: function() {
        this.current--;
        if(this.current < 0) this.current = this.slides.length - 1;
        this.set(this.current);

        clearInterval(timer);
        timer = slideChange();

    },
    right: function() {
        this.current++;
        if(this.current === this.slides.length) this.current = 0;
        this.set(this.current);


      clearInterval(timer);
      timer = slideChange();
    }
};

window.onload = function() {
    slider.init();
    timer = slideChange();
};

function slideChange() {
  return setInterval(function() {
    slider.right();
  }, 10000)
}
