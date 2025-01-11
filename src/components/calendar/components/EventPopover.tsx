import Popover  from '@mui/material/Popover';
import type { EventPopoverData } from '../types';
import { EventDetails } from './EventDetails';

interface EventPopoverProps {
  popoverData: EventPopoverData | null;
  onClose: () => void;
}

export function EventPopover({ popoverData, onClose }: EventPopoverProps) {
  if (!popoverData) return null;

  const { event, element } = popoverData;

  return (
    <Popover
      open={true}
      anchorEl={element}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <EventDetails event={event} />
    </Popover>
  );
}