import React, { useState, useMemo } from "react";
import { 
  Box, 
  TextField, 
  InputAdornment, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Chip,
  Grid,
  Paper,
  Divider
} from "@mui/material";
import { 
  Search, 
  Person, 
  Email, 
  Phone,
  Clear
} from "@mui/icons-material";
import { Contact } from "@/types";

interface ContactSearchProps {
  contacts: Contact[];
}

export default function ContactSearch({ contacts }: ContactSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    
    const term = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(term) ||
      contact.lastName.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term) ||
      contact.phone?.includes(term) ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
        Wyszukaj kontakty
      </Typography>

      {/* Search Input */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '1px solid #e0e0e0'
        }}
      >
        <TextField
          fullWidth
          placeholder="Szukaj po imieniu, nazwisku, emailu lub telefonie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#666' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Clear 
                  sx={{ 
                    color: '#666', 
                    cursor: 'pointer',
                    '&:hover': { color: '#1976d2' }
                  }}
                  onClick={() => setSearchTerm('')}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'white',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
              },
            },
          }}
        />
      </Paper>

      {/* Results */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="text.secondary">
          {searchTerm ? `Znaleziono ${filteredContacts.length} kontaktów` : `Wszystkie kontakty (${contacts.length})`}
        </Typography>
      </Box>

      {/* Contact Cards */}
      {filteredContacts.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Person sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'Nie znaleziono kontaktów' : 'Brak kontaktów'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Spróbuj zmienić kryteria wyszukiwania' : 'Dodaj swój pierwszy kontakt'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredContacts.map((contact) => (
            <Grid item xs={12} sm={6} md={4} key={contact.id}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48,
                        background: getRandomColor(contact.firstName),
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {getInitials(contact.firstName, contact.lastName)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        lineHeight: 1.2
                      }}>
                        {contact.firstName} {contact.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Dodano: {new Date(contact.createdAt).toLocaleDateString('pl-PL')}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {contact.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ color: '#666', fontSize: 20 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          component="a"
                          href={`mailto:${contact.email}`}
                        >
                          {contact.email}
                        </Typography>
                      </Box>
                    )}
                    
                    {contact.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: '#666', fontSize: 20 }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#1976d2',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          component="a"
                          href={`tel:${contact.phone}`}
                        >
                          {contact.phone}
                        </Typography>
                      </Box>
                    )}

                    {!contact.email && !contact.phone && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Brak dodatkowych informacji kontaktowych
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {contact.email && (
                      <Chip 
                        label="Email" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                    {contact.phone && (
                      <Chip 
                        label="Telefon" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
