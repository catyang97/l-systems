import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Turtle from './Turtle';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';

export default class LSystem {
    turtle: Turtle;
    turtleStack: Turtle[];
    grammar: string;
    iterations: number;
    expRules: Map<string, ExpansionRule> = new Map();
    drawRules: Map<string, DrawingRule> = new Map();
    transforms: mat4[] = [];
    fishTransforms: mat4[] = [];

    drawForward : DrawingRule;
    drawSave : DrawingRule;
    drawReset : DrawingRule;
    drawRotPosX : DrawingRule;
    drawRotNegX : DrawingRule;
    drawRotPosY : DrawingRule;
    drawRotNegY : DrawingRule;
    drawRotPosZ : DrawingRule;
    drawRotNegZ : DrawingRule;
    drawEnd : DrawingRule;
    drawB : DrawingRule;

    constructor(axiom: string, iterations: number) {
        this.turtle = new Turtle(vec3.fromValues(0.0, -4.0, 0.0), quat.create(), iterations);
        this.grammar = axiom;
        this.turtleStack = [];
        this.setExpansionRules();
        this.setDrawRules();
        this.iterations = iterations;
        // this.expandGrammar();
        console.log(this.grammar);
    }

    setExpansionRules() {
        let expansions: Map<string, number> = new Map();
        expansions.set("Ae[eAB[fbA]A]f[aA[bA]bA]", 0.7);
        expansions.set("Af[fA[aA]bA]A[eA]", 0.3);
        this.expRules.set("A", new ExpansionRule("A", expansions));

        let expansions2: Map<string, number> = new Map();
        expansions2.set("A", 1.0);
        this.expRules.set("B", new ExpansionRule("B", expansions2));

        let expansionsSave: Map<string, number> = new Map();
        expansionsSave.set("[", 1.0);
        this.expRules.set("[", new ExpansionRule("[", expansionsSave));

        let expansionsReset: Map<string, number> = new Map();
        expansionsReset.set("]", 1.0);
        this.expRules.set("]", new ExpansionRule("]", expansionsReset));

        let expansionsa: Map<string, number> = new Map();
        expansionsa.set("a", 1.0);
        this.expRules.set("a", new ExpansionRule("a", expansionsa));

        let expansionsb: Map<string, number> = new Map();
        expansionsb.set("b", 1.0);
        this.expRules.set("b", new ExpansionRule("b", expansionsb));

        let expansionsc: Map<string, number> = new Map();
        expansionsc.set("c", 1.0);
        this.expRules.set("c", new ExpansionRule("c", expansionsc));

        let expansionsd: Map<string, number> = new Map();
        expansionsd.set("d", 1.0);
        this.expRules.set("d", new ExpansionRule("d", expansionsd));

        let expansionse: Map<string, number> = new Map();
        expansionse.set("e", 1.0);
        this.expRules.set("e", new ExpansionRule("e", expansionse));

        let expansionsf: Map<string, number> = new Map();
        expansionsf.set("f", 1.0);
        this.expRules.set("f", new ExpansionRule("f", expansionsf));
    }

    expandGrammar() : string {
        let out = this.grammar;
        for (let i = 0; i < this.iterations; i++) {
            let exp = "";
            for (let char of out) {
                let expansion = this.expRules.get(char).getExp();
                // TODO: error check??
                exp += expansion;
            }
            out = exp;
        }
        this.grammar = out;
        return out;
    }

    line() {
        this.transforms.push(this.turtle.getTransformMatrix());
        this.turtle.moveForward(1.5);
    }

    save() {
        let pos: vec3 = vec3.create();
        let orient: quat = quat.create();
        vec3.copy(pos, this.turtle.position);
        quat.copy(orient, this.turtle.orientation);
        let newTurt: Turtle = new Turtle(pos, orient, this.iterations);
        this.turtleStack.push(newTurt);
        // this.turtleStack.push(this.turtle);
    }

    reset() {
        var turt: Turtle = this.turtleStack.pop();
        this.turtle.position = turt.position;
        this.turtle.orientation = turt.orientation;
        // this.turtle = this.turtleStack.pop();
    }

    rotatePosX() {
        this.turtle.rotate(20, 0, 0);
        this.turtle.moveForward(1.0);
    }

    rotateNegX() {
        this.turtle.rotate(-20, 0, 0);
        this.turtle.moveForward(1.0);
    }

    rotatePosY() {
        this.turtle.rotate(0, 20, 0);
        this.turtle.moveForward(1.0);
    }

    rotateNegY() {
        this.turtle.rotate(0, -20, 0);
        this.turtle.moveForward(1.0);
    }

    rotatePosZ() {
        this.turtle.rotate(0, 0, 20);
        this.turtle.moveForward(1.0);
    }

    rotateNegZ() {
        this.turtle.rotate(0, 0, -20);
        this.turtle.moveForward(1.0);
    }

    end() {
        
    }

    blankB() {
    }

    setDrawRules() {
        let mapForward: Map<string, number> = new Map();
        mapForward.set(this.line.bind(this), 1.0);
        this.drawForward = new DrawingRule("A", mapForward);
        this.drawRules.set("A", this.drawForward);

        let mapSave: Map<string, number> = new Map();
        mapSave.set(this.save.bind(this), 1.0);
        this.drawSave = new DrawingRule("[", mapSave);
        this.drawRules.set("[", this.drawSave);

        let mapReset: Map<string, number> = new Map();
        mapReset.set(this.reset.bind(this), 1.0);
        this.drawReset = new DrawingRule("]", mapReset);
        this.drawRules.set("]", this.drawReset);

        let mapRotX1: Map<string, number> = new Map();
        mapRotX1.set(this.rotatePosX.bind(this), 1.0);
        this.drawRotPosX = new DrawingRule("a", mapRotX1);
        this.drawRules.set("a", this.drawRotPosX);

        let mapRotX2: Map<string, number> = new Map();
        mapRotX2.set(this.rotateNegX.bind(this), 1.0);
        this.drawRotNegX = new DrawingRule("b", mapRotX2);
        this.drawRules.set("b", this.drawRotNegX);

        let mapRotY1: Map<string, number> = new Map();
        mapRotY1.set(this.rotatePosY.bind(this), 1.0);
        this.drawRotPosY = new DrawingRule("c", mapRotY1);
        this.drawRules.set("c", this.drawRotPosY);

        let mapRotY2: Map<string, number> = new Map();
        mapRotY2.set(this.rotateNegY.bind(this), 1.0);
        this.drawRotNegY = new DrawingRule("d", mapRotY2);
        this.drawRules.set("d", this.drawRotNegY);

        let mapRotZ1: Map<string, number> = new Map();
        mapRotZ1.set(this.rotatePosZ.bind(this), 1.0);
        this.drawRotPosZ= new DrawingRule("e", mapRotZ1);
        this.drawRules.set("e", this.drawRotPosZ);

        let mapRotZ2: Map<string, number> = new Map();
        mapRotZ2.set(this.rotateNegZ.bind(this), 1.0);
        this.drawRotNegZ = new DrawingRule("f", mapRotZ2);
        this.drawRules.set("f", this.drawRotNegZ);

        let mapEnd: Map<string, number> = new Map();
        mapEnd.set(this.end.bind(this), 1.0);
        this.drawEnd = new DrawingRule("x", mapEnd);
        this.drawRules.set("x", this.drawEnd);

        let mapBlank: Map<string, number> = new Map();
        mapBlank.set(this.blankB.bind(this), 1.0);
        this.drawB = new DrawingRule("B", mapBlank);
        this.drawRules.set("B", this.drawB);
    }

    turtlePop() {

    }

    turtlePush() {

    }

    draw() {
        for (let i = 0; i < this.grammar.length; i++) {
            let curr = this.grammar.charAt(i);
            let rule = this.drawRules.get(curr).getDraw();
            if (rule) {
                rule();
            }
            let rand: number = Math.random();
            if (rand < 0.08) {
                this.fishTransforms.push(this.turtle.getFishTransformMatrix());
            }
        }
    }
}