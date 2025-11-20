import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useInventory } from '../../hooks/useInventory';
import { InventoryItem } from '../../../domain/entities/InventoryItem';
import InventoryForm from './InventoryForm';

const InventoryList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const { inventory, loading, error, refetch } = useInventory();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este artículo?')) {
      return;
    }
    try {
      await inventoryService.deleteItem(id);
      loadItems();
    } catch (err) {
      setError('Error al eliminar el artículo.');
      console.error(err);
    }
  };

  const handleOpenForm = (item: InventoryItem | null = null) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    refetch();
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4">Gestión de Inventario</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Añadir Artículo
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>
                    {item.isBelowMinimum() ? <Chip label="Stock Bajo" color="warning" size="small" /> : <Chip label="En Stock" color="success" size="small" />}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenForm(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <InventoryForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        item={selectedItem}
      />
    </Box>
  );
};

export default InventoryList;
