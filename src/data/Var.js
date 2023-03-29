import nominalImg from '@img/table/scaleNominal.png';
import continuesImg from '@img/table/scaleContinues.png';
import binaryImg from '@img/table/scaleBinary.png';
import rangImg from '@img/table/scaleRang.png';

export default class Var {
    static Binary = new Var('binary', binaryImg);
    static Nominal = new Var('nominal', nominalImg);
    static Continues = new Var('continues', continuesImg);
    static Rang = new Var('rang', rangImg);

    #name;
    #img;

    constructor(name, img) {
        this.#name = name;
        this.#img = img;
    }

    getName() {
        return this.#name;
    }

    getImg() {
        return this.#img;
    }
}