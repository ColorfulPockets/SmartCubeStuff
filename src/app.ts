import { parse } from "cubing/alg";
import { BluetoothPuzzle, connect, MoveEvent, OrientationEvent } from "cubing/bluetooth";
import { KPuzzle, Puzzles } from "cubing/kpuzzle";
import { Twisty } from "cubing/twisty";
import { Quaternion, Vector3 } from "three";

export class BluetoothApp {
    private twisty: Twisty

    constructor() {
        window.addEventListener("DOMContentLoaded", this.setup.bind(this))
    }

    setup() {
        document.querySelector("#connect").addEventListener("click", this.onConnectButtonPress.bind(this))

        // TODO update to new syntax
        const twistyElem = document.createElement("twisty")
        this.twisty = new Twisty(twistyElem, { 
            alg: parse("")
        })
        
        document.body.appendChild(twistyElem)

        setTimeout(this.hackInitialOrientation.bind(this), 100)
    }

    hackInitialOrientation() {
        const mainVantage = this.twisty.experimentalGetPlayer()
        .cube3DView.experimentalGetCube3D()
        .experimentalGetVantages()[0]

        mainVantage.camera.position.set(0,4,4)
        mainVantage.camera.lookAt(new Vector3(0,0,0))
        mainVantage.render()
    }

    async onConnectButtonPress() {
        console.log(parse("[R, U]"))
        const puzzle: BluetoothPuzzle = await connect()
        puzzle.addMoveListener(this.onMove.bind(this))
        puzzle.addOrientationListener(this.onOrient.bind(this))
    }

    async onMove(e: MoveEvent): Promise<void> {
        console.log(e.latestMove)
        this.twisty.experimentalAddMove(e.latestMove)
    }

    async onOrient(e: OrientationEvent): Promise<void> {
        const { x, y, z, w } = e.quaternion;
        const quat = new Quaternion(x, y, z, w);
        await this.setOrientation(quat)
    }

    async setOrientation(quat: Quaternion) {
        this.twisty
        .experimentalGetPlayer()
        .cube3DView.experimentalGetCube3D()
        .experimentalGetCube()
        .quaternion.copy(quat);
    
        this.twisty.experimentalGetPlayer().cube3DView.experimentalGetCube3D().experimentalGetVantages()[0].render()
    }
}