import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  alpha,
  Popover,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Icon } from '@iconify/react';
import emailjs from '@emailjs/browser';
import Navigation from './components/Navigation';
import { ThemeProvider } from './context/ThemeContext';
import { projects } from './data/projects';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'portfolio-gmail';
const EMAILJS_TEMPLATE_ID = 'template_mzi5nzb';
// Add your EmailJS Public Key here (found in EmailJS dashboard under Integration)
// You can also set it as an environment variable: REACT_APP_EMAILJS_PUBLIC_KEY
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY_HERE';

const AppContent: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpenForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setAnchorEl(null);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({ name: '', email: '', subject: '', message: '' });
    setSendError('');
    setIsSending(false);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSend = async () => {
    // Validate all fields
    const newErrors = {
      name: formData.name.trim() === '' ? 'Name is required' : '',
      email: formData.email.trim() === '' ? 'Email is required' : '',
      subject: formData.subject.trim() === '' ? 'Subject is required' : '',
      message: formData.message.trim() === '' ? 'Message is required' : '',
    };

    setErrors(newErrors);
    setSendError('');

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (hasErrors) {
      return;
    }

    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE' || !EMAILJS_PUBLIC_KEY) {
      setSendError('Email service not configured. Please add your EmailJS Public Key to the .env file. Get it from: https://dashboard.emailjs.com/admin/integration');
      return;
    }

    setIsSending(true);
    setSendError('');

    try {
      // Initialize EmailJS if not already initialized
      if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      const subjectWithPrefix = `Portfolio: ${formData.subject}`;
      const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'jonathanferreiradev@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          subject: subjectWithPrefix,
          message: emailBody,
          name: formData.name,
          email: formData.email,
        }
      );

      // Success - show snackbar and close form
      setSnackbarOpen(true);
      handleCloseForm();
    } catch (error) {
      console.error('EmailJS error:', error);
      setSendError('Failed to send message. Please try again.');
      setIsSending(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          px: { xs: 2, md: 4 },
        }}
      >
        <Navigation />
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: "0px",
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                fontSize: { xs: '28px', md: '40px' },
                letterSpacing: '2px',
              }}
            >
              devign
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'text.primary',
                opacity: 0.5,
                fontWeight: 300,
                fontSize: { xs: '32px', md: '48px' },
                letterSpacing: '2px',
              }}
            >
              UX
            </Typography>
          </Box>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontSize: { xs: '18px', md: '28px' },
              opacity: 0.8,
              fontWeight: 500,
              letterSpacing: '1px',
              mt: 1,
              mb: 4,
            }}
          >
            Hi, I'm Jona. I design and engineer seamless, modern interfaces—bringing ideas from concept to production. My site is currently under construction, but you can explore some past work below. Let's connect if you'd like to talk ideas.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, md: 4 },
              mt: 6,
            }}
          >
            {projects.map((project) => (
              <Card
                key={project.id}
                elevation={0}
                className="project-card"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  backgroundColor: 'transparent',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: 'none',
                  '--Paper-shadow': 'none',
                  '--Paper-overlay': 'none',
                  '&::before': {
                    display: 'none',
                  },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    '& .image-overlay': {
                      opacity: 1,
                    },
                    '& .project-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '20px',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={project.image}
                    alt={project.title}
                    className="project-image"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: { xs: '200px', md: 'none' },
                      objectFit: 'cover',
                      borderRadius: { xs: '12px', md: '20px' },
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '20px',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                      pointerEvents: 'none',
                    }}
                  />
                  {project.link && (
                    <IconButton
                      onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
                      sx={{
                        position: 'absolute',
                        bottom: { xs: 12, md: 20 },
                        right: { xs: 12, md: 20 },
                        width: { xs: 36, md: 40 },
                        height: { xs: 36, md: 40 },
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        color: '#FFFFFF',
                        boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.16)',
                        transition: 'all 0.2s ease-in-out',
                        zIndex: 1,
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        },
                      }}
                      aria-label="view project"
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& svg': {
                            width: { xs: '18px', md: '24px' },
                            height: { xs: '18px', md: '24px' },
                          },
                        }}
                      >
                        <Icon icon="mdi:arrow-right" />
                      </Box>
                    </IconButton>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, backgroundColor: 'transparent'}}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: '1.1rem', md: '1.5rem' },
                    }}
                  >
                    {project.title}
                  </Typography>
                  {project.category && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 1,
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.65rem', md: '0.75rem' },
                        letterSpacing: '1px',
                      }}
                    >
                      {project.category}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      opacity: 0.8,
                      fontSize: { xs: '0.875rem', md: '0.875rem' },
                    }}
                  >
                    {project.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
      <IconButton
        onClick={handleOpenForm}
        sx={(theme) => ({
          position: 'fixed',
          bottom: { xs: 20, md: 32 },
          right: { xs: 20, md: 32 },
          width: { xs: 48, md: 56 },
          height: { xs: 48, md: 56 },
          backgroundColor: alpha(theme.palette.background.paper, .4),
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'text.primary',
          boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.4), 0 8px 24px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.25),
            border: `1px solid ${alpha(theme.palette.background.paper, 0.4)}`,
            transform: 'scale(1.1)',
            boxShadow: '0 24px 80px 0 rgba(0, 0, 0, 0.5), 0 12px 32px 0 rgba(0, 0, 0, 0.4)',
          },
          '& svg': {
            width: { xs: '22px', md: '28px' },
            height: { xs: '22px', md: '28px' },
          },
        })}
        aria-label="send message"
      >
        <Icon icon="solar:letter-bold" />
      </IconButton>
      <Popover
        open={formOpen}
        anchorEl={anchorEl}
        onClose={handleCloseForm}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          mt: -2,
        }}
        PaperProps={{
          sx: (theme) => ({
            backgroundColor: alpha(theme.palette.background.paper, 0.55),
            backgroundImage: 'none',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
            borderRadius: 3,
            boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            width: 400,
            maxWidth: '90vw',
          }),
        }}
      >
        <Box
          sx={(theme) => ({
            p: 4,
            backgroundColor: alpha(theme.palette.background.paper, 0.1),
          })}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Send Message
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              sx={(theme) => ({
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.3),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.7),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                },
              })}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              sx={(theme) => ({
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.3),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.7),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                },
              })}
            />
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              required
              value={formData.subject}
              onChange={handleInputChange('subject')}
              error={!!errors.subject}
              helperText={errors.subject}
              sx={(theme) => ({
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.3),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.7),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                },
              })}
            />
            <TextField
              label="Message"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.message}
              onChange={handleInputChange('message')}
              error={!!errors.message}
              helperText={errors.message}
              sx={(theme) => ({
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.3),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha(theme.palette.background.paper, 0.7),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                },
              })}
            />
            {sendError && (
              <Typography
                sx={{
                  color: 'error.main',
                  fontSize: '0.875rem',
                  mt: 1,
                }}
              >
                {sendError}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleCloseForm}
                disabled={isSending}
                sx={(theme) => ({
                  backgroundColor: alpha(theme.palette.background.paper, 0.2),
                  backdropFilter: 'blur(10px)',
                  color: 'text.primary',
                  border: `1px solid ${alpha(theme.palette.background.paper, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                  },
                })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                variant="contained"
                disabled={isSending}
                sx={(theme) => ({
                  backgroundColor: alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(10px)',
                  color: 'text.primary',
                  border: `1px solid ${alpha(theme.palette.background.paper, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                })}
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={(theme) => ({
            backgroundColor: theme.palette.success.main,
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#FFFFFF',
            },
          })}
        >
          Message sent successfully!
        </Alert>
      </Snackbar>
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 3,
          px: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            opacity: 0.6,
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          Made in{' '}
          <Icon
            icon="mdi:react"
            style={{
              width: '16px',
              height: '16px',
              margin: '0 4px',
              color: '#61DAFB',
            }}
          />
          REACT with{' '}
          <Icon
            icon="mdi:heart"
            style={{
              width: '16px',
              height: '16px',
              margin: '0 4px',
              color: '#ff0000',
            }}
          />
        </Typography>
      </Box>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
