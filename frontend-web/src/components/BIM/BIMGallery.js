import React, { useState } from 'react';
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Checkbox,
  Toolbar,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  SelectAll as SelectAllIcon,
  Visibility as VisibilityIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import EmptyState from '../Common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import BIMProgressView from './BIMProgressView';

const BIMGallery = ({ construction, onUploadBIM, onDeleteBIM, canDelete = false }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [progressViewOpen, setProgressViewOpen] = useState(false);
  const [selectedBimForProgress, setSelectedBimForProgress] = useState(null);
  const [selectedBimIndex, setSelectedBimIndex] = useState(0);

  const bimReferences = construction?.bim_references || [];

  const handleViewBIM = (bim) => {
    setSelectedItem({ type: 'bim', data: bim });
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleDeleteClick = (bim) => {
    setItemToDelete(bim);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete && onDeleteBIM) {
      if (itemToDelete.isMultiple) {
        // Deletar múltiplos itens
        for (const id of itemToDelete.ids) {
          await onDeleteBIM(id);
        }
        setSelectedItems([]);
        setSelectionMode(false);
      } else {
        // Deletar um único item
        await onDeleteBIM(itemToDelete.id);
        if (selectedItem?.data?.id === itemToDelete.id) {
          setSelectedItem(null);
        }
      }
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    setSelectedItems([]);
  };

  const handleToggleSelection = (bimId) => {
    setSelectedItems(prev => {
      if (prev.includes(bimId)) {
        return prev.filter(id => id !== bimId);
      } else {
        return [...prev, bimId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === bimReferences.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(bimReferences.map(bim => bim.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setItemToDelete({ ids: selectedItems, isMultiple: true });
      setDeleteConfirmOpen(true);
    }
  };

  const handleViewProgress = (bim, index) => {
    setSelectedBimForProgress(bim);
    setSelectedBimIndex(index);
    setProgressViewOpen(true);
  };

  const handleCloseProgressView = () => {
    setProgressViewOpen(false);
    setSelectedBimForProgress(null);
  };

  const isEmpty = bimReferences.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Nenhuma imagem BIM"
        description="Faça upload de imagens BIM de referência para esta obra"
        action={onUploadBIM}
        actionLabel="Upload Imagem BIM"
      />
    );
  }

  return (
    <Box>
      {/* Selection Toolbar */}
      {canDelete && bimReferences.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            mb: 2,
            bgcolor: selectionMode ? 'action.selected' : 'background.paper',
            borderRadius: 1,
            border: 1,
            borderColor: selectionMode ? 'primary.main' : 'divider',
          }}
        >
          {selectionMode ? (
            <>
              <Box sx={{ flex: '1 1 100%' }}>
                <Typography variant="subtitle1" component="div">
                  {selectedItems.length} selecionada{selectedItems.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Tooltip title="Selecionar todas">
                <IconButton onClick={handleSelectAll}>
                  <SelectAllIcon />
                </IconButton>
              </Tooltip>
              {selectedItems.length > 0 && (
                <Tooltip title={`Deletar ${selectedItems.length} imagem${selectedItems.length !== 1 ? 'ns' : ''}`}>
                  <IconButton color="error" onClick={handleDeleteSelected}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Cancelar seleção">
                <IconButton onClick={handleToggleSelectionMode}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Box sx={{ flex: '1 1 100%' }}>
                <Typography variant="subtitle1" component="div">
                  {bimReferences.length} imagem{bimReferences.length !== 1 ? 'ns' : ''}
                </Typography>
              </Box>
              <Tooltip title="Modo de seleção">
                <Button
                  startIcon={<CheckCircleIcon />}
                  onClick={handleToggleSelectionMode}
                  variant="outlined"
                  size="small"
                >
                  Selecionar
                </Button>
              </Tooltip>
            </>
          )}
        </Toolbar>
      )}

      <List sx={{ bgcolor: 'background.paper' }}>
        {bimReferences.map((bim, index) => {
          const isSelected = selectedItems.includes(bim.id);
          return (
            <React.Fragment key={bim.id}>
              <ListItem
                sx={{
                  py: 2,
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  cursor: selectionMode ? 'pointer' : 'default',
                  '&:hover': {
                    bgcolor: selectionMode ? 'action.hover' : 'action.hover',
                  },
                }}
                onClick={() => {
                  if (selectionMode) {
                    handleToggleSelection(bim.id);
                  }
                }}
                secondaryAction={
                  <Box display="flex" gap={1} alignItems="center">
                    {selectionMode ? (
                      <Checkbox
                        checked={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelection(bim.id);
                        }}
                      />
                    ) : (
                      <>
                        <Tooltip title="Ver evolução">
                          <IconButton
                            edge="end"
                            color="info"
                            onClick={() => handleViewProgress(bim, index)}
                          >
                            <TimelineIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver imagem">
                          <IconButton
                            edge="end"
                            color="primary"
                            onClick={() => handleViewBIM(bim)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {canDelete && (
                          <Tooltip title="Deletar">
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleDeleteClick(bim)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={bim.presigned_url || bim.s3_key}
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 2,
                      border: isSelected ? 3 : 0,
                      borderColor: 'primary.main',
                      opacity: isSelected ? 0.7 : 1,
                    }}
                  >
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      Imagem BIM #{bim.id.substring(0, 8)}
                    </Typography>
                  }
                  secondary={
                    <Box mt={0.5}>
                      {bim.description && (
                        <Typography variant="body2" color="text.secondary" component="div">
                          {bim.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" component="div" mt={0.5}>
                        Enviada em {formatDateTime(bim.created_at || bim.uploaded_at)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < bimReferences.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>

      {/* View Dialog */}
      <Dialog
        open={!!selectedItem}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    Imagem BIM
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(selectedItem.data.created_at || selectedItem.data.uploaded_at)}
                  </Typography>
                </Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box
                component="img"
                src={selectedItem.data.presigned_url || selectedItem.data.s3_key}
                alt="BIM"
                sx={{
                  width: '100%',
                  maxHeight: 600,
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />

              {selectedItem.data.description && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedItem.data.description}
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              {canDelete && (
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(selectedItem.data)}
                  sx={{ mr: 'auto' }}
                >
                  Deletar
                </Button>
              )}
              <Button onClick={handleClose}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          {itemToDelete?.isMultiple ? (
            <Typography>
              Tem certeza que deseja deletar <strong>{itemToDelete.ids.length} imagens BIM</strong>?
            </Typography>
          ) : (
            <>
              <Typography>
                Tem certeza que deseja deletar esta imagem BIM?
              </Typography>
              {itemToDelete?.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {itemToDelete.description}
                </Typography>
              )}
            </>
          )}
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {itemToDelete?.isMultiple ? `Deletar ${itemToDelete.ids.length}` : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress View Dialog */}
      <BIMProgressView
        open={progressViewOpen}
        onClose={handleCloseProgressView}
        bimReference={selectedBimForProgress}
        bimIndex={selectedBimIndex}
      />
    </Box>
  );
};

export default BIMGallery;

