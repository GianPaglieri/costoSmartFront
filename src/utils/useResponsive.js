import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isCompact = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return useMemo(
    () => ({
      isMobile,
      isCompact,
      isDesktop,
    }),
    [isMobile, isCompact, isDesktop]
  );
};

export default useResponsive;
