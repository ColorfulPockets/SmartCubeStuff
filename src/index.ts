import { parse } from "cubing/alg";
import { connect, BluetoothPuzzle, MoveEvent, OrientationEvent } from "cubing/bluetooth";

document.querySelector("#connect").addEventListener("click", async () => {
    console.log(parse("[R, U]"))
    const puzzle: BluetoothPuzzle = await connect()
    puzzle.addMoveListener( (e: MoveEvent) => {
        console.log(e.latestMove)
    })
    puzzle.addOrientationListener( (e: OrientationEvent) => {
        console.log(e.quaternion)
    } )
})