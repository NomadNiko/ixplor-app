import { useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Printer, Receipt } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { InvoiceResponseDto } from '@/types/invoice';

interface InvoiceDetailModalProps {
  invoice: InvoiceResponseDto | null;
  open: boolean;
  onClose: () => void;
}

export default function InvoiceDetailModal({ 
  invoice, 
  open, 
  onClose 
}: InvoiceDetailModalProps) {
  const { t } = useTranslation("receipts");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${t('invoice')} #${invoice?._id.slice(-8)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .divider { border-top: 1px solid #eee; margin: 20px 0; }
            .total { font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!invoice) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt size={24} />
          <Typography variant="h6">
            {t('invoice')} #{invoice._id.slice(-8)}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box ref={printRef}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('receiptTitle')}
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                {t('billedTo')}
              </Typography>
              <Typography>{invoice.customerId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                {t('from')}
              </Typography>
              <Typography>{invoice.vendorId}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('description')}
            </Typography>
            <Typography>{invoice.description}</Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('paymentDetails')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="text.secondary">
                  {t('status')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{invoice.status}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">
                  {t('transactionId')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography 
                  sx={{ 
                    wordBreak: 'break-all',
                    fontSize: '0.875rem'
                  }}
                >
                  {invoice.stripeCheckoutSessionId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">
                  {t('items')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {invoice.productItemIds.length} {t('itemsCount')}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="h5">
              {t('total')}: ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t('close')}
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Printer />}
          onClick={handlePrint}
        >
          {t('print')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}