import { Pressable } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useTheme } from '@/providers/ThemeProvider';

import type { Note } from '../types';

export interface NoteListItemProps {
  note: Note;
  onPress: () => void;
}

export function NoteListItem({ note, onPress }: NoteListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open note: ${note.title}`}
      style={{ marginBottom: theme.spacing.sm }}
    >
      <Card>
        <AppText weight="semibold">{note.title}</AppText>
        {note.body ? (
          <AppText muted numberOfLines={2} style={{ marginTop: theme.spacing.xs }}>
            {note.body}
          </AppText>
        ) : null}
      </Card>
    </Pressable>
  );
}
