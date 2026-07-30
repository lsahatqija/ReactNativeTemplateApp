import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { AppText, Button, TextField } from '@/components/ui';
import { toUserMessage, type ApiError } from '@/api/errors';
import { useTheme } from '@/providers/ThemeProvider';

import { noteFormSchema, type NoteFormValues } from '../schemas/note';

export interface NoteFormProps {
  defaultValues?: NoteFormValues;
  submitLabel: string;
  onSubmit: (values: NoteFormValues) => Promise<void>;
  serverError?: ApiError | null;
}

export function NoteForm({ defaultValues, submitLabel, onSubmit, serverError }: NoteFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? { title: '', body: '' },
  });

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <TextField
            label="Title"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.title?.message}
            returnKeyType="next"
          />
        )}
      />
      <Controller
        control={control}
        name="body"
        render={({ field }) => (
          <TextField
            label="Body"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.body?.message}
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top', paddingTop: theme.spacing.sm }}
          />
        )}
      />
      {serverError ? (
        <AppText color={theme.colors.danger} accessibilityRole="alert">
          {toUserMessage(serverError)}
        </AppText>
      ) : null}
      <Button
        title={submitLabel}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      />
    </View>
  );
}
