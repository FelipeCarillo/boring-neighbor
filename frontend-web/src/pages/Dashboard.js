import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Fade,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { constructionsAPI } from '../api/constructions';
import { usersAPI } from '../api/users';
import { useAuth } from '../contexts/AuthContext';
import ConstructionCard from '../components/Constructions/ConstructionCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import EmptyState from '../components/Common/EmptyState';

const StatCard = ({ title, value, icon: Icon, color, loading, delay = 0 }) => (
  <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>
          </Box>
          <Typography 
            variant="h3" 
            fontWeight="700"
            sx={{
              letterSpacing: '-0.02em',
            }}
          >
            {loading ? '...' : value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isSupervisor } = useAuth();
  const [stats, setStats] = useState({
    constructions: 0,
    users: 0,
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

  const statsCards = [
    { title: 'Total de Obras', value: stats.constructions, icon: ConstructionIcon, color: '#0455BF', show: true },
    { title: 'Usuários', value: stats.users, icon: PeopleIcon, color: '#00903E', show: isSupervisor() },
  ].filter(card => card.show);

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={400}>
        <Box mb={5}>
          <Typography 
            variant="h3" 
            fontWeight="700"
            gutterBottom
            sx={{ 
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #0455BF 0%, #00903E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Bem-vindo, {user?.name}! 👋
          </Typography>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          mb: 5,
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        {statsCards.map((card, index) => (
          <Box 
            key={card.title}
            sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: '300px' },
              maxWidth: '400px',
            }}
          >
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              loading={loading}
              delay={index * 100}
            />
          </Box>
        ))}
      </Box>

      {/* Recent Constructions */}
      <Fade in timeout={800}>
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              mb={4}
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  Obras Recentes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe o andamento das suas obras
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => navigate('/constructions')}
                endIcon={<TrendingUpIcon />}
                sx={{ px: 3, py: 1.5 }}
              >
                Ver Todas
              </Button>
            </Box>

            {loading ? (
              <LoadingSpinner message="Carregando obras..." />
            ) : recentConstructions.length > 0 ? (
              <Grid container spacing={3}>
                {recentConstructions.map((construction, index) => (
                  <Grid item xs={12} md={4} key={construction.id}>
                    <Fade in timeout={600} style={{ transitionDelay: `${index * 150}ms` }}>
                      <Box>
                        <ConstructionCard construction={construction} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <EmptyState
                icon={ConstructionIcon}
                title="Nenhuma obra cadastrada"
                description="Comece criando sua primeira obra para acompanhar o progresso"
                action={() => navigate('/constructions')}
                actionLabel="Criar Obra"
              />
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Dashboard;

