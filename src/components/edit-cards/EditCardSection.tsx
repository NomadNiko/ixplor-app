import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { SectionConfig } from './types';
import { EditCardField } from './EditCardField';
import { useTranslation } from 'react-i18next';

interface EditCardSectionProps {
  section: SectionConfig;
}

export const EditCardSection: React.FC<EditCardSectionProps> = ({ section }) => {
  const { t } = useTranslation();

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
            <EditCardField field={field} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};