import { useCallback, useState } from 'react';

/**
 * Maneja el estado básico de un diálogo (open/close) evitando estado repetido.
 */
const useDialogState = (initialOpen = false) => {
  const [open, setOpen] = useState(initialOpen);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return { open, handleOpen, handleClose, toggle, setOpen };
};

export default useDialogState;
