import { secondsToHms } from '../util/time';



export default function Utterance({utterance}) {

  return (
    <div className="Utterance table">
        <table>
            <tr>
                <td>{utterance && secondsToHms(utterance.start)}</td>
                <td>{utterance && secondsToHms(utterance.end)}</td>
                <td>{utterance && utterance.speaker}</td>
                <th>{utterance && utterance.text} </th>
            </tr>
        </table>
    </div>

  );
}