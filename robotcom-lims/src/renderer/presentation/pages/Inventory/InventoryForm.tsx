import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { InventoryItem } from '../../../domain/entities/InventoryItem';
import { InventoryService } from '../../../application/services/InventoryService';

interface InventoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  item?: InventoryItem | null;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ open, onClose, onSave, item }) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm();
  const inventoryService = new InventoryService();

  useEffect(() => {
    if (item) {
      reset(item);
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        category: '',
        quantity: 0,
        minQuantity: 0,
        unit: '',
        unitPrice: 0,
        supplier: '',
      });
    }
  }, [item, open, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (item) {
        await inventoryService.updateItem(item.id, data);
      } else {
        await inventoryService.createItem(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Editar Artículo de Inventario' : 'Añadir Artículo de Inventario'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller name="code" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Código del Artículo" fullWidth required />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Nombre del Artículo" fullWidth required />} />
            </Grid>
             <Grid item xs={12} >
              <Controller name="description" control={control} render={({ field }) => <TextField {...field} label="Descripción" fullWidth multiline rows={2} />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="category" control={control} render={({ field }) => <TextField {...field} label="Categoría" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="supplier" control={control} render={({ field }) => <TextField {...field} label="Proveedor" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="quantity" control={control} render={({ field }) => <TextField {...field} label="Cantidad" type="number" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="minQuantity" control={control} render={({ field }) => <TextField {...field} label="Cantidad Mínima" type="number" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="unit" control={control} render={({ field }) => <TextField {...field} label="Unidad (ej. caja, ml)" fullWidth />} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InventoryForm;
