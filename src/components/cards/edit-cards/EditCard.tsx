import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { BaseCard } from '../shared/BaseCard';
import { FormValuesMonitor } from '../shared/FormValuesMonitor';
import { SharedCardActions } from '../shared/SharedCardActions';
import { BaseCardProps, FormData, SectionConfig } from '../shared/types';
import CardSection from '../shared/CardSection';

export const EditCard: React.FC<BaseCardProps> = ({
  config,
  initialData,
  onSave,
  onCancel,
  onDelete,
  customActions,
  isSubmitting = false,
  onChange
}) => {
  const methods = useForm<FormData>({ defaultValues: initialData });

  return (
    <FormProvider {...methods}>
      <BaseCard
        config={{ ...config, type: config.type }}
        initialData={initialData}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
        customActions={customActions}
        isSubmitting={isSubmitting}
        onChange={onChange}
        mode="edit"
      >
        <FormValuesMonitor onChange={onChange} />
        {config.sections.map((section: SectionConfig) => (
          <CardSection key={section.id} section={section} mode="edit" />
        ))}
        <SharedCardActions
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          methods={methods}
          customActions={customActions}
          t={(key) => key}
          type={config.type}
          mode="edit"
        />
      </BaseCard>
    </FormProvider>
  );
};