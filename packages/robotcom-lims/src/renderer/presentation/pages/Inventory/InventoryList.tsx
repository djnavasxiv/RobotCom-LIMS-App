import React, { useState, useEffect } from 'react';
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
import { InventoryService } from '../../../application/services/InventoryService';
import { InventoryItem } from '../../../domain/entities/InventoryItem';
import InventoryForm from './InventoryForm';

const InventoryList: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const inventoryService = new InventoryService();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAllItems();
      setItems(data);
    } catch (err) {
      setError('Error al cargar el inventario.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    loadItems();
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
        <TableContainer component={Paper}>
          <Table>
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
              {items.map((item) => (
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
        </TableContainer>
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
