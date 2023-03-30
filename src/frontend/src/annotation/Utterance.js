import { secondsToHms } from '../util/time';



export default function Utterance({utterance}) {

  return (
    <div className="Utterance table">
        <table>
          <tbody>
          <tr>
                <td>{utterance && secondsToHms(utterance.start)}</td>
                <td>{utterance && secondsToHms(utterance.end)}</td>
                <td>{utterance && utterance.speaker}</td>
                <th>{utterance && utterance.text} </th>
            </tr>
          </tbody>

        </table>
    </div>

  );
}