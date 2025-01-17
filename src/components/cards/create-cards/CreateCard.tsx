import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { BaseCard } from '../shared/BaseCard';
import { FormValuesMonitor } from '../shared/FormValuesMonitor';
import { SharedCardActions } from '../shared/SharedCardActions';
import { BaseCardProps, FormData } from '../shared/types';
import CardSection from '../shared/CardSection';

export const CreateCard: React.FC<BaseCardProps> = ({
  config,
  initialData,
  onSave,
  onCancel,
  customActions,
  isSubmitting = false,
  onChange
}) => {
  const methods = useForm<FormData>({ defaultValues: initialData });

  return (
    <FormProvider {...methods}>
      <BaseCard
        config={config}
        initialData={initialData}
        onSave={onSave}
        onCancel={onCancel}
        customActions={customActions}
        isSubmitting={isSubmitting}
        onChange={onChange}
        mode="create"
      >
        <FormValuesMonitor onChange={onChange} />
        {config.sections.map((section) => (
          <CardSection key={section.id} section={section} mode="create" />
        ))}
        <SharedCardActions
          onSave={onSave}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          methods={methods}
          customActions={customActions}
          t={(key) => key}
          type={config.type}
          mode="create"
        />
      </BaseCard>
    </FormProvider>
  );
};