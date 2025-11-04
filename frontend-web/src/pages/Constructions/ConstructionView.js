import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Divider,
  LinearProgress,
  Collapse,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  ViewInAr as ViewInArIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  PersonRemove as PersonRemoveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { constructionsAPI } from '../../api/constructions';
import { useAuth } from '../../contexts/AuthContext';
import AssignUsers from '../../components/Constructions/AssignUsers';
import ConstructionForm from '../../components/Constructions/ConstructionForm';
import ProgressGallery from '../../components/Progress/ProgressGallery';
import ProgressForm from '../../components/Progress/ProgressForm';
import BIMGallery from '../../components/BIM/BIMGallery';
import BIMUpload from '../../components/BIM/BIMUpload';
import OBJUpload from '../../components/BIM/IFCUpload';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';
import { formatDate } from '../../utils/formatters';
import { CONSTRUCTION_STATUS_LABELS, CONSTRUCTION_STATUS_COLORS } from '../../utils/constants';
import { progressAPI } from '../../api/progress';
import { reportsAPI } from '../../api/reports';
import Model3DViewer from '../../components/BIM/Model3DViewer';
import Model3DUpload from '../../components/BIM/Model3DUpload';
import CaptureModal from '../../components/BIM/CaptureModal';
import ReportsList from '../../components/Reports/ReportsList';
import ConstructionTimelineChart from '../../components/Charts/ConstructionTimelineChart';
 
const ConstructionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isSupervisor } = useAuth();

  const [construction, setConstruction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [assignUsersOpen, setAssignUsersOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [progressList, setProgressList] = useState([]);
  const [progressFormOpen, setProgressFormOpen] = useState(false);
  const [progressFormLoading, setProgressFormLoading] = useState(false);
  const [reportsList, setReportsList] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [bimUploadOpen, setBimUploadOpen] = useState(false);
  const [model3DUploadOpen, setModel3DUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userToRemove, setUserToRemove] = useState(null);
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const [viewerSettings, setViewerSettings] = useState({
    backgroundColor: '#f5f5f5',
    ambientLightIntensity: 0.6,
    directionalLightIntensity: 0.8,
    directionalLightColor: '#ffffff',
    wireframe: false,
    showGrid: true,
  });

  useEffect(() => {
    loadConstruction();
    loadProgress();
    loadReports();
    loadTimeline();
  }, [id]);

  const loadConstruction = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await constructionsAPI.getById(id);
      setConstruction(data);
    } catch (err) {
      setError('Erro ao carregar detalhes da obra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await progressAPI.listByConstruction(id);
      setProgressList(data);
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
    }
  };

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await reportsAPI.listByConstruction(id);
      setReportsList(data);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const loadTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const data = await constructionsAPI.getTimeline(id);
      setTimelineData(data);
    } catch (err) {
      console.error('Erro ao carregar evolução temporal:', err);
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await reportsAPI.generate(id);
      enqueueSnackbar('Relatório gerado com sucesso!', { variant: 'success' });
      await loadReports();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao gerar relatório',
        { variant: 'error' }
      );
    }
  };

  const handleAssignUsers = async (userIds) => {
    try {
      await constructionsAPI.assignUsers(id, userIds);
      enqueueSnackbar('Usuários atribuídos com sucesso!', { variant: 'success' });
      setAssignUsersOpen(false);
      loadConstruction();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao atribuir usuários',
        { variant: 'error' }
      );
    }
  };

  const handleEditConstruction = async (formData) => {
    setEditFormLoading(true);
    try {
      await constructionsAPI.update(id, formData);
      enqueueSnackbar('Obra atualizada com sucesso!', { variant: 'success' });
      setEditFormOpen(false);
      loadConstruction();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao atualizar obra',
        { variant: 'error' }
      );
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleProgressSubmit = async (formData, setUploadProgress) => {
    setProgressFormLoading(true);
    try {
      formData.append('construction_id', id);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await progressAPI.register(formData);
      
      clearInterval(interval);
      setUploadProgress(100);

      enqueueSnackbar('Progresso registrado com sucesso!', { variant: 'success' });
      setProgressFormOpen(false);
      loadProgress();
      loadConstruction();
      loadTimeline();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao registrar progresso',
        { variant: 'error' }
      );
    } finally {
      setProgressFormLoading(false);
    }
  };

  const handleBIMUpload = async (formData, setUploadProgress) => {
    setUploadLoading(true);
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await constructionsAPI.uploadBIM(id, formData);
      
      clearInterval(interval);
      setUploadProgress(100);

      enqueueSnackbar('Imagem BIM enviada com sucesso!', { variant: 'success' });
      setBimUploadOpen(false);
      loadConstruction();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao enviar imagem BIM',
        { variant: 'error' }
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleModel3DUpload = async (formData, setUploadProgress) => {
    setUploadLoading(true);
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await constructionsAPI.uploadModel3D(id, formData);
      
      clearInterval(interval);
      setUploadProgress(100);

      enqueueSnackbar('Modelo 3D enviado com sucesso!', { variant: 'success' });
      setModel3DUploadOpen(false);
      loadConstruction();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao enviar modelo 3D',
        { variant: 'error' }
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteModel3D = async () => {
    try {
      await constructionsAPI.deleteModel3D(id);
      enqueueSnackbar('Modelo 3D removido com sucesso!', { variant: 'success' });
      loadConstruction();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao remover modelo 3D',
        { variant: 'error' }
      );
    }
  };

  const handleOpenRemoveUserDialog = (user) => {
    setUserToRemove(user);
    setRemoveUserDialogOpen(true);
  };

  const handleCloseRemoveUserDialog = () => {
    setRemoveUserDialogOpen(false);
    setUserToRemove(null);
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) return;

    try {
      await constructionsAPI.removeUser(id, userToRemove.id);
      enqueueSnackbar('Usuário removido da obra com sucesso!', { variant: 'success' });
      handleCloseRemoveUserDialog();
      loadConstruction();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao remover usuário',
        { variant: 'error' }
      );
    }
  };

  const filteredUsers = construction?.assigned_users?.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.registro?.toLowerCase().includes(userSearchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes da obra..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorAlert error={error} onRetry={loadConstruction} />
      </Container>
    );
  }

  if (!construction) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/constructions')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {construction.name}
            </Typography>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <Chip
                label={CONSTRUCTION_STATUS_LABELS[construction.status] || construction.status}
                color={CONSTRUCTION_STATUS_COLORS[construction.status] || 'default'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>

               {isSupervisor() && (
                 <Tooltip title="Editar obra" arrow>
                   <IconButton 
                     color="primary" 
                     onClick={() => setEditFormOpen(true)}
                     sx={{
                       bgcolor: 'rgba(4, 85, 191, 0.08)',
                       '&:hover': {
                         bgcolor: 'rgba(4, 85, 191, 0.16)',
                       },
                     }}
                   >
                     <EditIcon />
                   </IconButton>
                 </Tooltip>
               )}
        </Box>
      </Box>

      {/* Progresso Total Card */}
      {construction.progress_percentage !== undefined && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" fontWeight="bold">
                Progresso Total da Obra
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {Math.round(construction.progress_percentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={construction.progress_percentage}
              sx={{ height: 12, borderRadius: 1 }}
              color={
                construction.progress_percentage === 100 ? 'success' :
                construction.progress_percentage >= 70 ? 'primary' :
                construction.progress_percentage >= 30 ? 'info' : 'warning'
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Modelo 3D Card - Renderização Automática */}
           {construction.model_3d_presigned_url && (
             <Card sx={{ mb: 3 }}>
               <CardContent>
                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                   <Box>
                     <Typography variant="h6" fontWeight="bold" gutterBottom>
                       Modelo 3D da Obra
                     </Typography>
                     {construction.model_3d_file_name && (
                       <Typography variant="body2" color="text.secondary">
                         {construction.model_3d_file_name}
                         {construction.model_3d_file_type && ` • ${construction.model_3d_file_type.toUpperCase()}`}
                       </Typography>
                     )}
                   </Box>
                   <Box display="flex" gap={1}>
                     {isSupervisor() && (
                       <>
                         <Button
                           variant="contained"
                           color="success"
                           size="small"
                           startIcon={<PhotoCameraIcon />}
                           onClick={() => setCaptureModalOpen(true)}
                         >
                           Captura Rápida
                         </Button>
                         <Button
                           variant="outlined"
                           color="error"
                           size="small"
                           startIcon={<DeleteIcon />}
                           onClick={handleDeleteModel3D}
                         >
                           Remover
                         </Button>
                       </>
                     )}
                   </Box>
                 </Box>
                 <Model3DViewer
                   modelUrl={construction.model_3d_presigned_url}
                   height={500}
                   autoLoad={true}
                   initialBackgroundColor={viewerSettings.backgroundColor}
                   initialAmbientLightIntensity={viewerSettings.ambientLightIntensity}
                   initialDirectionalLightIntensity={viewerSettings.directionalLightIntensity}
                   initialDirectionalLightColor={viewerSettings.directionalLightColor}
                   initialWireframe={viewerSettings.wireframe}
                   initialShowGrid={viewerSettings.showGrid}
                   onSettingsChange={(newSettings) => {
                     setViewerSettings(prev => ({ ...prev, ...newSettings }));
                   }}
                 />
               </CardContent>
             </Card>
           )}

      {/* Upload Modelo 3D Card (se não existe) */}
      {!construction.model_3d_presigned_url && isSupervisor() && (
        <Card sx={{ mb: 3, border: 2, borderStyle: 'dashed', borderColor: 'divider' }}>
          <CardContent>
            <Box textAlign="center" py={3}>
              <ViewInArIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum Modelo 3D Cadastrado
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Faça upload de um modelo 3D para visualização (OBJ, GLTF, GLB ou FBX)
              </Typography>
              <Button
                variant="contained"
                startIcon={<ViewInArIcon />}
                onClick={() => setModel3DUploadOpen(true)}
              >
                Upload Modelo 3D
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Descrição
              </Typography>
              <Typography variant="body1">
                {construction.description || 'Sem descrição'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Local
              </Typography>
              <Typography variant="body1">{construction.location}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Data de Início
              </Typography>
              <Typography variant="body1">{formatDate(construction.start_date)}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Data de Término
              </Typography>
              <Typography variant="body1">
                {construction.end_date ? formatDate(construction.end_date) : 'Não definida'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Criado por
              </Typography>
              <Typography variant="body1">{construction.created_by || 'N/A'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Criado em
              </Typography>
              <Typography variant="body1">{formatDate(construction.created_at)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
             <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
               <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                 <Tab label="Progresso" />
                 <Tab label="Imagens BIM" />
                 <Tab
                   label={
                     <Box display="flex" alignItems="center" gap={1}>
                       Relatórios
                       <Chip size="small" label={reportsList.length} />
                     </Box>
                   }
                 />
                 <Tab
                   label={
                     <Box display="flex" alignItems="center" gap={1}>
                       Usuários
                       <Chip size="small" label={construction.assigned_users?.length || 0} />
                     </Box>
                   }
                 />
               </Tabs>
             </Box>

      {/* Tab Content */}
      <Card>
        <CardContent>
          {/* Tab 0: Progresso */}
          {activeTab === 0 && (
            <Box>
              <Box mb={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Evolução Temporal da Obra
                  </Typography>
                </Box>
                {loadingTimeline ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <LinearProgress sx={{ width: '50%' }} />
                  </Box>
                ) : (
                  <ConstructionTimelineChart data={timelineData} />
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  Registro de Progresso ({progressList.length})
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setProgressFormOpen(true)}
                >
                  Registrar Progresso
                </Button>
              </Box>
              <ProgressGallery
                progressList={progressList}
                onRegisterProgress={() => setProgressFormOpen(true)}
                bimReferences={construction?.bim_references || []}
              />
            </Box>
          )}

                 {/* Tab 1: Imagens BIM */}
                 {activeTab === 1 && (
                   <Box>
                     <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
                       {isSupervisor() && (
                         <Button
                           variant="outlined"
                           onClick={() => setBimUploadOpen(true)}
                         >
                           Upload Imagem BIM
                         </Button>
                       )}
                     </Box>
                     <BIMGallery
                       construction={construction}
                       onUploadBIM={() => setBimUploadOpen(true)}
                       onDeleteBIM={async (bimId) => {
                         try {
                           await constructionsAPI.deleteBIM(id, bimId);
                           enqueueSnackbar('Imagem BIM deletada com sucesso!', { variant: 'success' });
                           await loadConstruction();
                         } catch (err) {
                           enqueueSnackbar(
                             err.response?.data?.detail || 'Erro ao deletar imagem BIM',
                             { variant: 'error' }
                           );
                         }
                       }}
                       canDelete={isSupervisor()}
                     />
                   </Box>
                 )}

                 {/* Tab 2: Relatórios */}
                 {activeTab === 2 && (
                   <Box>
                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                       <Typography variant="subtitle1">
                         Relatórios Gerados ({reportsList.length})
                       </Typography>
                       {isSupervisor() && (
                         <Button
                           variant="contained"
                           onClick={handleGenerateReport}
                           disabled={loadingReports}
                         >
                           {loadingReports ? 'Gerando...' : 'Gerar Novo Relatório'}
                         </Button>
                       )}
                     </Box>
                     <ReportsList
                       reports={reportsList}
                       loading={loadingReports}
                       constructionId={id}
                     />
                   </Box>
                 )}

                {/* Tab 3: Usuários */}
                {activeTab === 3 && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">
                        Usuários Atribuídos ({construction.assigned_users?.length || 0})
                      </Typography>
                      {isSupervisor() && (
                        <Button
                          variant="outlined"
                          startIcon={<PeopleIcon />}
                          onClick={() => setAssignUsersOpen(true)}
                        >
                          Adicionar Usuários
                        </Button>
                      )}
                    </Box>

                    {construction.assigned_users && construction.assigned_users.length > 0 && (
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por nome, email ou registro..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}

                    <Divider sx={{ mb: 2 }} />

                    {construction.assigned_users && construction.assigned_users.length > 0 ? (
                      filteredUsers.length > 0 ? (
                        <List sx={{ bgcolor: 'background.paper' }}>
                          {filteredUsers.map((user, index) => (
                          <React.Fragment key={user.id}>
                            <ListItem
                              secondaryAction={
                                isSupervisor() && (
                                  <Tooltip title="Remover usuário">
                                    <IconButton
                                      edge="end"
                                      color="error"
                                      onClick={() => handleOpenRemoveUserDialog(user)}
                                    >
                                      <PersonRemoveIcon />
                                    </IconButton>
                                  </Tooltip>
                                )
                              }
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                      {user.name}
                                    </Typography>
                                    <Chip
                                      label={
                                        user.role === 'ADMIN' ? 'Administrador' :
                                        user.role === 'SUPERVISOR' ? 'Supervisor' :
                                        'Operador'
                                      }
                                      size="small"
                                      color={
                                        user.role === 'ADMIN' ? 'error' :
                                        user.role === 'SUPERVISOR' ? 'primary' :
                                        'success'
                                      }
                                    />
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {user.email}
                                    </Typography>
                                    {user.registro && (
                                      <Typography variant="body2" color="text.secondary">
                                        Registro: {user.registro}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < filteredUsers.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                          Nenhum usuário encontrado com "{userSearchQuery}"
                        </Typography>
                      )
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                        Nenhum usuário atribuído
                      </Typography>
                    )}
                   </Box>
                 )}
               </CardContent>
             </Card>

      {/* Dialogs */}
      <AssignUsers
        open={assignUsersOpen}
        onClose={() => setAssignUsersOpen(false)}
        construction={construction}
        onAssign={handleAssignUsers}
      />

      <ProgressForm
        open={progressFormOpen}
        onClose={() => setProgressFormOpen(false)}
        onSubmit={handleProgressSubmit}
        construction={construction}
        loading={progressFormLoading}
      />

      <BIMUpload
        open={bimUploadOpen}
        onClose={() => setBimUploadOpen(false)}
        onSubmit={handleBIMUpload}
        construction={construction}
        loading={uploadLoading}
      />

       <Model3DUpload
         open={model3DUploadOpen}
         onClose={() => setModel3DUploadOpen(false)}
         onSubmit={handleModel3DUpload}
         construction={construction}
         loading={uploadLoading}
       />

      <CaptureModal
        open={captureModalOpen}
        onClose={() => setCaptureModalOpen(false)}
        modelUrl={construction?.model_3d_presigned_url}
        constructionId={id}
        viewerSettings={viewerSettings}
        onSettingsChange={(newSettings) => {
          setViewerSettings(prev => ({ ...prev, ...newSettings }));
        }}
        onBIMUpload={async (formData) => {
          try {
            await constructionsAPI.uploadBIM(id, formData);
            await loadConstruction();
          } catch (err) {
            enqueueSnackbar(
              err.response?.data?.detail || 'Erro ao salvar referência BIM',
              { variant: 'error' }
            );
            throw err;
          }
        }}
        onNotify={(message, variant) => enqueueSnackbar(message, { variant })}
      />

      {/* Dialog de Confirmação de Remoção de Usuário */}
      <Dialog
        open={removeUserDialogOpen}
        onClose={handleCloseRemoveUserDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remover Usuário</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover <strong>{userToRemove?.name}</strong> desta obra?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'warning.main' }}>
            O usuário perderá o acesso a esta obra.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveUserDialog}>Cancelar</Button>
          <Button onClick={handleRemoveUser} color="error" variant="contained">
            Remover
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form de Edição da Obra */}
      <ConstructionForm
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onSubmit={handleEditConstruction}
        construction={construction}
        loading={editFormLoading}
      />
    </Container>
  );
};

export default ConstructionView;

