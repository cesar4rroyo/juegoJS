const celeste = document.getElementById("celeste");
const violeta = document.getElementById("violeta");
const naranja = document.getElementById("naranja");
const verde = document.getElementById("verde");
const btnEmpezar = document.getElementById("btnEmpezar");
const ULTIMO_NIVEL = 9;
const labelNivel = document.getElementById("btn_level");
const labelTiempo = document.getElementById("lbl_tiempo");
let timer;
let counter = 15;

class Juego {
    constructor() {
        this.inicializar = this.inicializar.bind(this);
        this.siguienteNivel = this.siguienteNivel.bind(this);
        name = "";
        swal({
            title: "Welcome to the game",
            text: "Please, write your name",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Write your name",
                    type: "text"
                }
            }
        }).then(value => {
            if (value) {
                name = value;
                this.inicializar();
                this.generarSecuencia();
                labelNivel.classList.remove("hide");
                labelNivel.classList.add("btn", "btn-warning");
                setTimeout(this.siguienteNivel, 500);
                labelTiempo.classList.remove("hide");
                labelTiempo.classList.add("btn", "btn-success");
                labelTiempo.innerHTML = counter;
                this.temporizador();
            } else {
                this.empezarJuego();
            }
        });
    }

    temporizador() {
        timer = setInterval(() => {
            counter--;
            if (counter < 0) {
                clearInterval(timer);
                counter = 15;
                this.perdioElJuego();
            } else {
                labelTiempo.innerText = counter;
            }
        }, 1000);
    }

    inicializar() {
        this.siguienteNivel = this.siguienteNivel.bind(this);
        this.elegirColor = this.elegirColor.bind(this);
        this.toggleEmpezar();
        this.nivel = 1;
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        };
    }
    cambiarNivel(level) {
        labelNivel.innerHTML = "Nivel:  " + level;
    }

    toggleEmpezar() {
        if (btnEmpezar.classList.contains("hide")) {
            btnEmpezar.classList.remove("hide");
        } else {
            btnEmpezar.classList.add("hide");
        }
    }
    generarSecuencia() {
        this.secuencia = new Array(ULTIMO_NIVEL)
            .fill(0)
            .map(n => Math.floor(Math.random() * 4));
    }
    siguienteNivel() {
        this.subnivel = 0;
        this.iluminarSecuencia();
        this.agregarEventosClick();
    }
    transformarNumeroAColor(numero) {
        switch (numero) {
            case 0:
                return "celeste";
            case 1:
                return "violeta";
            case 2:
                return "naranja";
            case 3:
                return "verde";
        }
    }
    transformarColorANumero(color) {
        switch (color) {
            case "celeste":
                return 0;
            case "violeta":
                return 1;
            case "naranja":
                return 2;
            case "verde":
                return 3;
        }
    }
    iluminarSecuencia() {
        for (let i = 0; i < this.nivel; i++) {
            const color = this.transformarNumeroAColor(this.secuencia[i]);
            setTimeout(() => this.iluminarColor(color), 1000 * i);
        }
    }
    iluminarColor(color) {
        this.colores[color].classList.add("light");
        setTimeout(() => this.apagarColor(color), 350);
    }

    apagarColor(color) {
        this.colores[color].classList.remove("light");
    }
    eliminarEventosClick() {
        this.colores.celeste.removeEventListener("click", this.elegirColor);
        this.colores.verde.removeEventListener("click", this.elegirColor);
        this.colores.violeta.removeEventListener("click", this.elegirColor);
        this.colores.naranja.removeEventListener("click", this.elegirColor);
    }
    agregarEventosClick() {
        this.colores.celeste.addEventListener("click", this.elegirColor);
        this.colores.verde.addEventListener("click", this.elegirColor);
        this.colores.violeta.addEventListener("click", this.elegirColor);
        this.colores.naranja.addEventListener("click", this.elegirColor);
    }
    elegirColor(ev) {
        const nombreColor = ev.target.dataset.color;
        const numeroColor = this.transformarColorANumero(nombreColor);
        this.iluminarColor(nombreColor);
        if (numeroColor === this.secuencia[this.subnivel]) {
            this.subnivel++;
            if (this.subnivel === this.nivel) {
                this.nivel++;
                this.cambiarNivel(this.nivel);
                this.eliminarEventosClick();
                if (this.nivel === ULTIMO_NIVEL + 1) {
                    this.ganoElJuego();
                } else {
                    setTimeout(this.siguienteNivel, 1500);
                    clearInterval(timer);
                    counter = 15;
                    this.temporizador();
                }
            }
        } else {
            this.perdioElJuego();
            //perdio
        }
    }
    ganoElJuego() {
        labelNivel.classList.remove("btn", "btn-warning");
        labelNivel.classList.add("hide");
        this.cambiarNivel("1");
        swal(name, "Congrats!, you win", "success").then(this.inicializar);
    }
    perdioElJuego() {
        labelNivel.classList.remove("btn", "btn-warning");
        labelNivel.classList.add("hide");
        clearInterval(timer);
        counter = 15;
        labelTiempo.classList.remove("btn", "btn-success");
        labelTiempo.classList.add("hide");
        this.cambiarNivel("1");
        swal(name, "Sorry, you lose :(", "error").then(() => {
            this.eliminarEventosClick();
            this.inicializar();
        });
    }
}
function empezarJuego() {
    window.juego = new Juego();
}
