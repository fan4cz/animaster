addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    let moveAndHideAnimation;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideAnimation = animaster().moveAndHide(block, 1000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideAnimation) {
                moveAndHideAnimation.reset();
            }
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });
    let heartBeatingAnimation;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster().heartBeating(block, 1000, 1.25);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
           if (heartBeatingAnimation){
               heartBeatingAnimation.stop();
           }
        });
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}


function animaster() {
    return {
        _steps: [],

        play(element) {
            let delay = 0;
                for (const step of this._steps) {
                    if (step.type === 'move') {
                        setTimeout(() => {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(step.params, null);
                        }, delay);
                    }

                    if (step.type === 'scale') {
                        setTimeout(() => {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(null, step.params);
                        }, delay);
                    }

                    if (step.type === 'fadeIn') {
                        setTimeout(() => {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.classList.remove('hide');
                            element.classList.add('show');
                        }, delay);
                    }

                    if (step.type === 'fadeOut') {
                        setTimeout(() => {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.classList.remove('show');
                            element.classList.add('hide');
                        }, delay);
                    }
                    delay += step.duration;
                }
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },

        /**
         * Блок плавно исчезает из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },

        addMove( duration, translation) {
            this._steps.push({ type: 'move', duration, params: translation });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({ type: 'scale', duration, params: ratio });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({ type: 'fadeIn', duration, params: null });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({ type: 'fadeOut', duration, params: null });
            return this;
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },

        moveAndHide (element, duration) {
            move(element, duration * 0.4, {x: 100, y: 20});
            const timeout = setTimeout(() => {
                fadeOut(element, duration * 0.6);
            }, duration * 0.4);
            return {
                reset () {
                    clearTimeout(timeout);
                    resetFadeOut(element);
                    move(element, 0, {x: 0, y: 0});
                }
            }
        },

        showAndHide  (element, duration) {
            fadeIn(element, duration / 3);
            setTimeout(() => {
                    setTimeout(() => {
                        fadeOut(element, duration / 3);
                    }, duration / 3);
                }, duration / 3);
        },

        
        heartBeating(element, duration) {
            const beat = () => {
                scale(element, duration / 2, 1.4);
                setTimeout(() => {
                    scale(element, duration / 2, 1);
                }, duration / 2);
            };
            beat();
            const interval =  setInterval(beat, duration);
            return {
                stop() {
                    clearInterval(interval);
                }
            };
        },
        
        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = getTransform({ x: 0, y: 0 }, null);
        },
}
}
