import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function HelpTooltipButton({ button, label }) {
  let exCounter = 0;
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        <div>
          <p>{label.help}</p>
          {label.examples &&
            <div>
              <p className='mb-0'>Examples:</p>
              <ul>
                {label.examples.map((example) => {
                  return <li className='m-0' key={`ex-${label.keyStroke}-${exCounter++}`}>{example}</li>;
                })}
              </ul>
            </div>
          }
        </div>

    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="auto"
      delay={{ show: 1000, hide: 200 }}
      overlay={renderTooltip}
      trigger={['hover']}
    >
      {button}
    </OverlayTrigger>
  );
}
