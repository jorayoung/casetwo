const items = {

    "default": ["cr_goblin.png", "cr_heart.png", "cr_orange.png", "crc_dog.png", "crc_overblack.png", "crc_xd.png"],
    "rare": ["cr_mask.png", "cr_welder.png", "cr_cat.png", "cr_spiralns.png"],
    "secret": ["cr_ll.png", "cr_ballet.png", "cr_cool2.png"],
    "legendary": ["cr_crown.png", "crc_bigteeth.png"]

};

const chances = { // сумма всех чисел должна быть равна 100

    "default": 628,
    "rare": 330,
    "secret": 40,
    "legendary": 2

}

function getRolledItem() {
    let num = getRandomInt(1000) // 0 - 999

    if (num <= chances["default"]) { var quality = "default" }
    else if (num <= chances["default"] + chances["rare"]) { var quality = "rare" }
    else if (num <= chances["default"] + chances["rare"] + chances["secret"]) { var quality = "secret" }
    else if (num <= chances["default"] + chances["rare"] + chances["secret"] + chances["legendary"]) { var quality = "legendary" }

    return items[quality][getRandomInt(items[quality].length)]

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



class Roulette {

    constructor() {
        this.SIZE = 128;
        this.LENGTH = 45;
        this.DURATION = 10000;

        this.rouletteMembers = []
        for (var _ of Object.keys(items)) {
            this.rouletteMembers = this.rouletteMembers.concat(items[_])
        }

        this.progress = 0;

        this.startTime = 0;
        this.lastItem = 0;

        this.level = 0;
        
        this.roulette = document.getElementById("roulette");
        this.items = this.roulette.children;
    }

    init() {

        this.rouletteMembers.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        for (let i = 0; i < 6; i++) {

            const item = this.items[i];
            
            item.style.position = 'absolute';
            item.style.transform = `translateX(${i * this.SIZE}px)`;
            item.lastChild.src = this.getItem();
        }
    }

    start(lastItem) {
        this.level = 0;
        this.progress = 0;
        this.lastItem = lastItem;
        this.startTime = Date.now();

        for (let i = 0; i < 6; i++) {
            this.items[i].value = 0;
        }

        window.requestAnimationFrame(() => this.update());
    }

    update() {
        this.progress = (Date.now() - this.startTime) / this.DURATION;

        if (this.progress > 1) {
            this.progress = 1;
            this.render();
            return;
        }

        this.render();

        window.requestAnimationFrame(() => this.update());
    }

    render() {
        const off = this.interpolator(this.progress) * this.SIZE * this.LENGTH;
        const WIDTH = this.SIZE * 6;

        for (let i = 0; i < 6; i++) {
            const item = this.items[i];
            const base = (i + 1) * this.SIZE - off;
            const index = -Math.floor(base / WIDTH);
            const value = ((base % WIDTH) + WIDTH) % WIDTH - this.SIZE;
            
            item.style.transform = `translateX(${value}px)`;

            if (item.value != index) {
                this.level += index - item.value;

                item.value = index;
                item.lastChild.src = this.getItem();

                if (this.level == this.LENGTH - 3) {
                    item.lastChild.src = this.lastItem;
                    var skins = JSON.parse(localStorage.getItem("skins"))
                    if (skins.indexOf(this.lastItem) == -1) {
                        skins.push(this.lastItem)
                        localStorage.setItem("skins", JSON.stringify(skins))
                    }
                }
            }
        }
    }

    interpolator(val) {
        return Math.pow(Math.sin(val * Math.PI / 2), 2.6);
    }

    getItem(val) {
        val = typeof val !== "undefined" ? val : getRandomInt(this.rouletteMembers.length);
        return this.rouletteMembers[val];
    }

}

const roulette = new Roulette();
roulette.init(items);


const btnStart = document.getElementById("roulette-start");

btnStart.onclick = () => roulette.start(getRolledItem());

document.onkeydown = function(e) {
if(event.keyCode == 123) {
return false;
}
if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
return false;
}
if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){
return false;
}
if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)){
return false;
}
if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){
return false;
}
}
