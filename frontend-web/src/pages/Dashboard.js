import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  People as PeopleIcon,
  PhotoCamera as PhotoCameraIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { constructionsAPI } from '../api/constructions';
import { usersAPI } from '../api/users';
import { useAuth } from '../contexts/AuthContext';
import ConstructionCard from '../components/Constructions/ConstructionCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {loading ? '...' : value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            borderRadius: 2,
            p: 1,
          }}
        >
          <Icon />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isSupervisor } = useAuth();
  const [stats, setStats] = useState({
    constructions: 0,
    users: 0,
    progress: 0,
    reports: 0,
  });
  const [recentConstructions, setRecentConstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load constructions
      const constructionsData = await constructionsAPI.list();
      setRecentConstructions(constructionsData.slice(0, 3));

      // Load stats
      const newStats = {
        constructions: constructionsData.length,
        users: 0,
        progress: 0,
        reports: 0,
      };

      // Load users count if supervisor
      if (isSupervisor()) {
        try {
          const usersData = await usersAPI.list();
          newStats.users = usersData.length;
        } catch (err) {
          console.error('Error loading users:', err);
        }
      }

      setStats(newStats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo, {user?.name}!
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Obras"
            value={stats.constructions}
            icon={ConstructionIcon}
            color="primary"
            loading={loading}
          />
        </Grid>
        {isSupervisor() && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Usuários"
              value={stats.users}
              icon={PeopleIcon}
              color="success"
              loading={loading}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Registros de Progresso"
            value={stats.progress}
            icon={PhotoCameraIcon}
            color="warning"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Relatórios"
            value={stats.reports}
            icon={AssessmentIcon}
            color="secondary"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Recent Constructions */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Obras Recentes
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/constructions')}
              endIcon={<TrendingUpIcon />}
            >
              Ver Todas
            </Button>
          </Box>

          {loading ? (
            <LoadingSpinner message="Carregando obras..." />
          ) : recentConstructions.length > 0 ? (
            <Grid container spacing={3}>
              {recentConstructions.map((construction) => (
                <Grid item xs={12} md={4} key={construction.id}>
                  <ConstructionCard construction={construction} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              Nenhuma obra cadastrada
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;

