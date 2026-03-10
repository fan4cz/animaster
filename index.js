addListeners();


function addListeners() {
    let fadeInAnimation;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeInAnimation = animaster().fadeIn(block, 5000);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
           if (fadeInAnimation) {
               fadeInAnimation.reset();
           }
        });
    let fadeOutAnimation;
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOutAnimation = animaster().fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            if (fadeOutAnimation) {
                fadeOutAnimation.reset();
            }
        });
    let movePlayAnimation;
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            movePlayAnimation = animaster().move(block, 1000, {x: 100, y: 10});
        });
    document.getElementById('movePlayReset')
        .addEventListener('click', function () {
            if (movePlayAnimation) {
                movePlayAnimation.reset();
            }
        });
    let scalePlayAnimation;
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scalePlayAnimation = animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            if (scalePlayAnimation) {
                scalePlayAnimation.reset();
            }
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
    let showAndHideAnimation;
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHideAnimation = animaster().showAndHide(block, 2000);
        });
    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            if (showAndHideAnimation) {
                showAndHideAnimation.reset();
            }
        });
    let heartBeatingAnimation;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster().heartBeating(block, 1000, 1.25);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
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

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})    
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('worryAnimationHandlerBlock')
        .addEventListener('click', worryAnimationHandler);
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
        play(element, cycled=false) {
            let delay = 0;
            const runSteps = () => {
                delay = 0;
                for (const step of this._steps) {
                    if (step.type === 'move') {
                        setTimeout(() => {
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(step.translation, null);
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
            };
            runSteps();
            const totalDuration = this._steps.reduce((sum, s) => sum + s.duration, 0);
            const interval = cycled ? setInterval(runSteps, totalDuration) : null;
            const self = this;
            return {
                stop() {
                    clearInterval(interval);
                },
                reset() {
                    clearInterval(interval);
                    for (const step of self._steps) {
                        if (step.type === 'fadeIn') {
                            self.resetFadeIn(element);
                        }
                        if (step.type === 'fadeOut') {
                            self.resetFadeOut(element);
                        }
                        if (step.type === 'move' || step.type === 'scale') {
                            self.resetMoveAndScale(element);
                        }
                    }
                }
            };
        },

        buildHandler() {
            return (event) => {
                this.play(event.currentTarget);
            };
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            return this.addFadeIn(duration).play(element);
        },

        /**
         * Блок плавно исчезает из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            return this.addFadeOut(duration).play(element);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            return this.addMove(duration, translation).play(element);
        },

        addMove(duration, translation) {
            this._steps.push({type: 'move', duration, translation});
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({type: 'scale', duration, params: ratio});
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({type: 'fadeIn', duration, params: null});
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({type: 'fadeOut', duration, params: null});
            return this;
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            return this.addScale(duration, ratio).play(element);
        },

        addDelay(duration) {
            this._steps.push({type: 'delay', duration});
            return this;
        },

        moveAndHide(element, duration) {
           return this
                .addMove(duration * 0.4, {x : 100, y: 20})
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        showAndHide(element, duration) {
            return this
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },


        heartBeating(element, duration) {
            return this
                .addScale(duration / 2, 1.4)
                .addScale(duration / 2, 1)
                .play(element, true);
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
            element.style.transform = getTransform({x: 0, y: 0}, null);
        },
    }
}
