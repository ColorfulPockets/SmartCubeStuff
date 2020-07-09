import { parse } from "cubing/alg";
import { BluetoothPuzzle, connect, MoveEvent, OrientationEvent } from "cubing/bluetooth";
import { TwistyPlayer } from "cubing/twisty";
import { Vector3 } from "three";

export class BluetoothApp {
    private twisty: TwistyPlayer

    constructor() {
        window.addEventListener("DOMContentLoaded", this.setup.bind(this))
    }

    setup() {
        document.querySelector("#connect").addEventListener("click", this.onConnectButtonPress.bind(this))

        this.twisty = new TwistyPlayer({
            playerConfig: {
                experimentalCube3DViewConfig: {
                    experimentalInitialVantagePosition: new Vector3(0, 4, 4)
                }
            }
        })
        
        document.body.appendChild(this.twisty)
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
        this.twisty.experimentalGetPlayer().cube3DView.experimentalSetOrientation(e.quaternion);
    }
}
