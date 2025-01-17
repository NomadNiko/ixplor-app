import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import { CardSectionProps } from './types';
import { CardField } from './CardField';

export const CardSection: React.FC<CardSectionProps> = ({ 
  section,
  mode = 'edit'
}) => {
  const { t } = useTranslation('tests');
  
  return (
    <Box sx={{ mb: 4 }}>
      {section.title && (
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            mb: 3,
            mt: 2
          }}
        >
          {t(section.title)}
        </Typography>
      )}
      
      <Grid 
        container 
        spacing={2}
        sx={{
          mb: 2,
          mt: 1
        }}
      >
        {section.fields.map((field) => (
          <Grid 
            item 
            xs={12} 
            md={field.gridWidth || (field.fullWidth ? 12 : 6)} 
            key={field.name}
          >
            <CardField 
              field={field}
              mode={mode}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardSection;