import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';

// Stub components simulating Descope SDK
const AuthProvider: React.FC<{ projectId: string; children?: React.ReactNode }> = ({ children }) => <>{children}</>;
const Descope: React.FC<{
  flowId: string;
  theme?: string;
  onSuccess?: (e: any) => void;
  onError?: (e: any) => void;
}> = ({ onSuccess }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
        Sign In to Neighborhood Help
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          const fakeEvent = {
            detail: {
              user: { email: 'user@example.com', name: 'User Example' },
              session: { token: 'fake-session-token' },
            },
          };
          onSuccess && onSuccess(fakeEvent);
        }}
        sx={{ px: 6, fontWeight: 'bold' }}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default function HelpSharingAgent() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  async function createEvent() {
    if (!user || !sessionToken) {
      setAlert({ severity: 'error', message: 'Please log in first' });
      return;
    }
    if (!message.trim() || !dateTime) {
      setAlert({ severity: 'error', message: 'Please enter a message and date/time' });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const event = {
        summary: 'Neighborhood Help Request',
        description: message.trim(),
        start: {
          dateTime: new Date(dateTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(new Date(dateTime).getTime() + 30 * 60000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: { useDefault: true },
      };
      const response = await axios.post(
        '/api/create-event',
        { event, email: user.email },
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      setAlert({
        severity: 'success',
        message: `Event created: ${response.data.summary} at ${new Date(
          response.data.start.dateTime
        ).toLocaleString()}`,
      });
      setMessage('');
      setDateTime('');
    } catch (err: any) {
      setAlert({ severity: 'error', message: 'Failed to create event. Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthProvider projectId="P321NcYgY3z0ACnbCyQyA3rWmY3V">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #83a4d4, #b6fbff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)',
            }}
          >
            {/* Left Side - Form */}
            <Box sx={{ flex: 1, p: 5, backgroundColor: 'white' }}>
              <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
                Neighborhood Help Coordinator
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" mb={4}>
                Connect with neighbors & share support easily. Post requests or offers to help around your community.
              </Typography>

              {!user ? (
                <Descope
                  flowId="help-agent-flow"
                  theme="light"
                  onSuccess={(e: any) => {
                    setUser(e.detail.user);
                    setSessionToken(e.detail.session.token);
                    setAlert(null);
                  }}
                  onError={(err: any) => {
                    setAlert({ severity: 'error', message: 'Authentication error. Please try again.' });
                    console.error('Descope error:', err);
                  }}
                />
              ) : (
                <>
                  {/* hCaptcha consent & auth success message snippet */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: '#e6f2ff',
                      borderRadius: 1,
                      border: '1px solid #99c2ff',
                      color: '#004a99',
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    <Typography fontWeight="bold" mb={1}>
                      Authentication and consent successful! You can now use the app.
                    </Typography>
                    <Typography>
                      This site is protected by hCaptcha and its{' '}
                      <Link href="https://www.hcaptcha.com/privacy" target="_blank" rel="noreferrer" underline="hover">
                        Privacy Policy
                      </Link>{' '}
                      and{' '}
                      <Link href="https://www.hcaptcha.com/terms" target="_blank" rel="noreferrer" underline="hover">
                        Terms of Service
                      </Link>{' '}
                      apply.
                    </Typography>
                  </Box>

                  {alert && (
                    <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ my: 3 }}>
                      {alert.message}
                    </Alert>
                  )}

                  <Typography variant="h6" gutterBottom>
                    Welcome, <strong>{user.name || user.email}</strong>! You’re signed in.
                  </Typography>

                  <TextField
                    label="Describe your help request or offer"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="Example: Need groceries delivery on Friday"
                  />

                  <TextField
                    label="Date and Time"
                    type="datetime-local"
                    fullWidth
                    variant="outlined"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 4 }}
                  />

                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      onClick={createEvent}
                      sx={{ fontWeight: 'bold' }}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {loading ? 'Creating Event...' : 'Create Help Event'}
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      onClick={() => {
                        setUser(null);
                        setSessionToken(null);
                        setMessage('');
                        setDateTime('');
                        setAlert(null);
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                </>
              )}
            </Box>

            {/* Right Side - Stock Image */}
            <Box
              sx={{
                flex: 1,
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'none', md: 'block' },
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
              }}
            />
          </Paper>
        </Container>
      </Box>
    </AuthProvider>
  );
}

