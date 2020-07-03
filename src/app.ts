import { parse } from "cubing/alg";
import { connect, BluetoothPuzzle, MoveEvent, OrientationEvent } from "cubing/bluetooth";
import { Twisty } from "cubing/twisty";
import { Quaternion } from "three";

export class BluetoothApp {
    private twisty: Twisty

    constructor() {
        this.setup()
    }

    setup() {
        document.querySelector("#connect").addEventListener("click", this.onConnectButtonPress.bind(this))

        // TODO update to new syntax
        const twistyElem = document.createElement("twisty")
        this.twisty = new Twisty(twistyElem, {alg: parse("")})
        document.body.appendChild(twistyElem)
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