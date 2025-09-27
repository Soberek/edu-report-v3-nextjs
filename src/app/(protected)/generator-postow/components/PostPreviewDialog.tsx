import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  Chip,
  Card,
  CardContent,
  IconButton,
  Divider,
  Avatar,
  Stack
} from "@mui/material";
import { 
  Download, 
  Share, 
  Favorite, 
  Close,
  Instagram,
  Facebook,
  Twitter,
  LinkedIn
} from "@mui/icons-material";
import { PostPreviewDialogProps } from "../types";
import { getTemplateStyle } from "../utils";

/**
 * Component for previewing posts with enhanced design
 */
export function PostPreviewDialog({ open, post, onClose, onDownload }: PostPreviewDialogProps) {
  if (!post) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram />;
      case 'facebook': return <Facebook />;
      case 'twitter': return <Twitter />;
      case 'linkedin': return <LinkedIn />;
      default: return <Share />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return '#E4405F';
      case 'facebook': return '#1877F2';
      case 'twitter': return '#1DA1F2';
      case 'linkedin': return '#0A66C2';
      default: return '#1976d2';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: getPlatformColor(post.platform),
            width: 40,
            height: 40
          }}>
            {getPlatformIcon(post.platform)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Podgląd posta
            </Typography>
            <Chip 
              label={post.platform} 
              size="small" 
              sx={{ 
                bgcolor: getPlatformColor(post.platform),
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, background: 'transparent' }}>
        <Card sx={{ 
          m: 3,
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          background: 'white',
          ...getTemplateStyle(post.template)
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* Image Section */}
            {post.imageUrl && (
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={`${post.imageUrl}?w=800&h=400`}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    display: 'block'
                  }}
                />
                
                {/* Text Overlay */}
                {post.textOverlay.enabled && (
                  <Box
                    sx={{
                      position: "absolute",
                      [post.textOverlay.position]: "24px",
                      left: "24px",
                      right: "24px",
                      textAlign: "center",
                      color: post.textOverlay.color,
                      fontSize: post.textOverlay.fontSize,
                      fontWeight: post.textOverlay.fontWeight,
                      textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    {post.textOverlay.text}
                  </Box>
                )}

                {/* Gradient Overlay */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '100px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
                }} />
              </Box>
            )}

            {/* Content Section */}
            <Box sx={{ p: 4 }}>
              <Stack spacing={3}>
                {/* Title */}
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    lineHeight: 1.2,
                    textAlign: 'center'
                  }}
                >
                  {post.title}
                </Typography>

                <Divider sx={{ borderColor: '#e0e0e0' }} />

                {/* Description */}
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    textAlign: 'center',
                    fontStyle: 'italic',
                    lineHeight: 1.6
                  }}
                >
                  {post.description}
                </Typography>

                {/* Content */}
                <Box sx={{ 
                  p: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.8,
                      fontSize: '1.1rem',
                      color: '#495057'
                    }}
                  >
                    {post.content}
                  </Typography>
                </Box>

                {/* Tags and Metadata */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={post.tag} size="small" color="primary" variant="outlined" />
                    <Chip 
                      label={post.isFavorite ? 'Ulubiony' : 'Standardowy'} 
                      size="small" 
                      color={post.isFavorite ? 'error' : 'default'} 
                      variant="outlined"
                      icon={post.isFavorite ? <Favorite /> : undefined}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Utworzono: {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Zamknij
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Download />} 
          onClick={onDownload}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            }
          }}
        >
          Pobierz post
        </Button>
      </DialogActions>
    </Dialog>
  );
}
