import { parse } from "cubing/alg";
import { connect, BluetoothPuzzle, MoveEvent, OrientationEvent } from "cubing/bluetooth";

export class BluetoothApp {
    constructor() {
        this.setup()
    }

    setup() {
        document.querySelector("#connect").addEventListener("click", this.onConnectButtonPress.bind(this))
    }

    async onConnectButtonPress() {
        console.log(parse("[R, U]"))
        const puzzle: BluetoothPuzzle = await connect()
        puzzle.addMoveListener(this.onMove.bind(this))
        // puzzle.addOrientationListener( (e: OrientationEvent) => {
        //     console.log(e.quaternion)
        // } )
    }

    async onMove(e: MoveEvent): Promise<void> {
        console.log(e.latestMove)
    }
}