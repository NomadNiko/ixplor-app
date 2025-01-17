import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { SectionConfig } from '../shared/types';
import { CardField } from '../shared/CardField';
import { useTranslation } from 'react-i18next';

interface CreateCardSectionProps {
  section: SectionConfig;
}

export const CreateCardSection: React.FC<CreateCardSectionProps> = ({ section }) => {
  const { t } = useTranslation('tests');
  
  return (
    <div>
      {section.title && (
        <Typography variant="h6" gutterBottom>
          {t(section.title)}
        </Typography>
      )}
      <Grid container spacing={2}>
        {section.fields.map((field) => (
          <Grid 
            item 
            xs={12} 
            md={field.gridWidth || (field.fullWidth ? 12 : 6)} 
            key={field.name}
          >
            <CardField field={field} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};