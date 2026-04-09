import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  IconButton,
  alpha,
  Popover,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import emailjs from '@emailjs/browser';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/hero/HeroSection';
import ContextBanner from '@/components/sections/ContextBanner';
import ProcessSection from '@/components/sections/ProcessSection';
import StackSection from '@/components/sections/StackSection';
import MetricsRow from '@/components/sections/MetricsRow';
import TestimonialBlock from '@/components/sections/TestimonialBlock';
import ResumeStrip from '@/components/sections/ResumeStrip';
import ProjectCard from '@/components/projects/ProjectCard';
import CaseStudyPanel from '@/components/panel/CaseStudyPanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { AudienceProvider } from '@/context/AudienceContext';
import { projects, Project } from '@/data/projects';

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
  const [panelProject, setPanelProject] = useState<Project | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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

  const handleOpenCaseStudy = (project: Project) => {
    setPanelProject(project);
    setIsPanelOpen(true);
  };

  const handleCloseCaseStudy = () => {
    setIsPanelOpen(false);
    // Keep project data mounted during close animation, then clear
    setTimeout(() => setPanelProject(null), 600);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          px: { xs: 2, md: 4 },
          filter: isPanelOpen ? 'blur(3px) brightness(0.4)' : 'none',
          transform: isPanelOpen ? 'scale(0.97)' : 'scale(1)',
          transformOrigin: 'center top',
          transition: 'filter 0.5s ease, transform 0.5s ease',
        }}
      >
        <Navigation />
        <Container maxWidth="xl">
          <HeroSection />
          <ContextBanner />
          <Box
            component={motion.div}
            id="work"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, md: 4 },
              mt: 2,
            }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <ProjectCard
                  project={project}
                  onCaseStudyOpen={() => handleOpenCaseStudy(project)}
                />
              </motion.div>
            ))}
          </Box>
          <ProcessSection />
          <StackSection />
          <MetricsRow />
          <TestimonialBlock />
        </Container>
        <ResumeStrip />
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
      <CaseStudyPanel
        project={panelProject}
        isOpen={isPanelOpen}
        onClose={handleCloseCaseStudy}
      />
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
      <AudienceProvider>
        <AppContent />
      </AudienceProvider>
    </ThemeProvider>
  );
};

export default App;
