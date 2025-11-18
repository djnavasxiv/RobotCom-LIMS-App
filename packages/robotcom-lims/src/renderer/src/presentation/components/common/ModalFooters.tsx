import React from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import {
  FirstPageOutlined,
  NavigateBeforeOutlined,
  NavigateNextOutlined,
  LastPageOutlined,
  SaveOutlined,
  HelpOutlineOutlined,
  ExitToAppOutlined,
} from '@mui/icons-material';

interface NavigationFooterProps {
  onFirst?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onLast?: () => void;
  onSave?: () => void;
  onHelp?: () => void;
  onExit?: () => void;
  disableNavigation?: boolean;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({
  onFirst,
  onPrevious,
  onNext,
  onLast,
  onSave,
  onHelp,
  onExit,
  disableNavigation = false,
}: NavigationFooterProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
        marginTop: '12px',
        gap: '8px',
      }}
    >
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FirstPageOutlined />}
          onClick={onFirst}
          disabled={disableNavigation}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          &lt;&lt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<NavigateBeforeOutlined />}
          onClick={onPrevious}
          disabled={disableNavigation}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          &lt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<NavigateNextOutlined />}
          onClick={onNext}
          disabled={disableNavigation}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          &gt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LastPageOutlined />}
          onClick={onLast}
          disabled={disableNavigation}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          &gt;&gt;
        </Button>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveOutlined />}
          onClick={onSave}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          GUARD
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<HelpOutlineOutlined />}
          onClick={onHelp}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          AYUDA
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ExitToAppOutlined />}
          onClick={onExit}
          sx={{ textTransform: 'uppercase', fontSize: '10px', color: '#d32f2f', borderColor: '#d32f2f' }}
        >
          SALIR
        </Button>
      </Stack>
    </Box>
  );
};

interface BillingFooterProps {
  total: number | string;
  discount: number | string;
  toPay: number | string;
  observations: string;
  onObservationsChange: (value: string) => void;
  onAddTest?: () => void;
  onTotalChange?: (value: string) => void;
  onDiscountChange?: (value: string) => void;
  onToPayChange?: (value: string) => void;
}

export const BillingFooter: React.FC<BillingFooterProps> = ({
  total,
  discount,
  toPay,
  observations,
  onObservationsChange,
  onAddTest,
  onTotalChange,
  onDiscountChange,
  onToPayChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        marginTop: '12px',
      }}
    >
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <TextField
          label="TOTAL"
          size="small"
          value={total}
          onChange={(e) => onTotalChange?.(e.target.value)}
          type="number"
          sx={{ width: '150px' }}
        />
        <TextField
          label="DESCUENTO %"
          size="small"
          value={discount}
          onChange={(e) => onDiscountChange?.(e.target.value)}
          type="number"
          sx={{ width: '150px' }}
        />
        <TextField
          label="PAGAR"
          size="small"
          value={toPay}
          onChange={(e) => onToPayChange?.(e.target.value)}
          type="number"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={onAddTest}
          sx={{ textTransform: 'uppercase', fontSize: '10px' }}
        >
          ADD TEST
        </Button>
      </Box>
      <TextField
        label="OBSERVA."
        multiline
        rows={2}
        fullWidth
        size="small"
        value={observations}
        onChange={(e) => onObservationsChange(e.target.value)}
        placeholder="Enter observations..."
      />
    </Box>
  );
};

interface PrintButtonsProps {
  onPrint?: () => void;
  onAbout?: () => void;
  onPdf?: () => void;
  variant?: 'default' | 'compact';
}

export const PrintButtons: React.FC<PrintButtonsProps> = ({
  onPrint,
  onAbout,
  onPdf,
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button variant="outlined" size="small" onClick={onPrint} sx={{ fontSize: '10px', textTransform: 'uppercase' }}>
          IMPRIMIR
        </Button>
        <Button variant="outlined" size="small" onClick={onAbout} sx={{ fontSize: '10px', textTransform: 'uppercase' }}>
          SOBRE
        </Button>
        <Button variant="outlined" size="small" onClick={onPdf} sx={{ fontSize: '10px', textTransform: 'uppercase' }}>
          CMPLT. PDF
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderTop: '1px solid #ddd' }}>
      <Button
        variant="contained"
        size="small"
        onClick={onPrint}
        sx={{ textTransform: 'uppercase', fontSize: '10px' }}
      >
        IMPRIMIR
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={onAbout}
        sx={{ textTransform: 'uppercase', fontSize: '10px' }}
      >
        SOBRE
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={onPdf}
        sx={{ textTransform: 'uppercase', fontSize: '10px' }}
      >
        CMPLT. PDF
      </Button>
    </Box>
  );
};
