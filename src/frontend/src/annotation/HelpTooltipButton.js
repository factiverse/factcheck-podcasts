import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function TriggerExample({button, text}) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="auto"
      delay={{ show: 1000, hide: 200 }}
      overlay={renderTooltip}
    >
      {button}
    </OverlayTrigger>
  );
}
