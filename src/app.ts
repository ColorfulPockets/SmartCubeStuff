import { parse, BlockMove } from "cubing/alg";
import { BluetoothPuzzle, connect, MoveEvent, OrientationEvent, GoCube } from "cubing/bluetooth";
import { TwistyPlayer } from "cubing/twisty";
import { Vector3 } from "three";

export class BluetoothApp {
    private twisty: TwistyPlayer
    private puzzle: GoCube

    constructor() {
        window.addEventListener("DOMContentLoaded", this.setup.bind(this))
    }

    setup() {
        document.querySelector("#connect").addEventListener("click", this.onConnectButtonPress.bind(this))
        document.querySelector("#refresh").addEventListener("click", this.onRefreshButtonPress.bind(this))

        this.twisty = new TwistyPlayer({
            playerConfig: {
                experimentalCube3DViewConfig: {
                    experimentalInitialVantagePosition: new Vector3(0, 4, 4)
                }
            }
        })
        
        document.body.appendChild(this.twisty)
    }

    async onRefreshButtonPress() {
        this.puzzle.resetOrientation()
    }

    async onConnectButtonPress() {
        console.log(parse("[R, U]"))
        this.puzzle = await connect() as GoCube
        this.puzzle.addMoveListener(this.onMove.bind(this))
        this.puzzle.addOrientationListener(this.onOrient.bind(this))
    }

    async onMove(e: MoveEvent): Promise<void> {
        console.log(e.latestMove.family)
        console.log(e.latestMove.amount)
        var family: string = ""
        var amount = e.latestMove.amount * -1
        switch (e.latestMove.family) {
            case "R":
                family = "L"
                break;
            case "L":
                family = "R"
                break;
            case "U":
                family = "D"
                break;
            case "D":
                family = "U"
                break;
            case "F":
                family = "B"
                break;
            case "B":
                family = "F"
                break;
            default:
                break;
        }
        var newMove = new BlockMove(e.latestMove.outerLayer, e.latestMove.innerLayer, family, amount)
        this.twisty.experimentalAddMove(newMove)
    }

    async onOrient(e: OrientationEvent): Promise<void> {
        this.twisty.experimentalGetPlayer().cube3DView.experimentalSetOrientation(e.quaternion);
    }
}