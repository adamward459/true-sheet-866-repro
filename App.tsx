import { useRef, useState, type RefObject } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { DateTimePicker, Host } from '@expo/ui/jetpack-compose';

const { version: TRUE_SHEET_VERSION } = require('@lodev09/react-native-true-sheet/package.json');

const FALLBACK_HEIGHT = 480;

const MatchContentsPicker = () => (
  <Host matchContents={{ vertical: true }}>
    <DateTimePicker displayedComponents="date" variant="picker" />
  </Host>
);

// The workaround from the issue: an explicit height driven by onLayoutContent.
const ExplicitHeightPicker = () => {
  const [height, setHeight] = useState(FALLBACK_HEIGHT);

  return (
    <Host
      style={{ height }}
      onLayoutContent={({ nativeEvent }) => nativeEvent.height > 0 && setHeight(nativeEvent.height)}
    >
      <DateTimePicker displayedComponents="date" variant="picker" />
    </Host>
  );
};

const Footer = ({ sheet }: { sheet: RefObject<TrueSheet | null> }) => (
  <View style={styles.footer}>
    <Button title="Done" onPress={() => sheet.current?.dismiss()} />
  </View>
);

export default function App() {
  const matchSheet = useRef<TrueSheet>(null);
  const explicitSheet = useRef<TrueSheet>(null);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>TrueSheet #866 repro</Text>
      <Text>@lodev09/react-native-true-sheet {TRUE_SHEET_VERSION}</Text>
      <Text style={styles.body}>
        Android only. Both sheets use detents={"{['auto']}"} and a footer. "matchContents" is the
        snippet from the issue. "explicit height" is the workaround.
      </Text>
      <Button
        title="Present (matchContents)"
        onPress={() => matchSheet.current?.present()}
      />
      <Button
        title="Present (explicit height)"
        onPress={() => explicitSheet.current?.present()}
      />

      <TrueSheet
        ref={matchSheet}
        name="match-contents"
        detents={['auto']}
        footer={<Footer sheet={matchSheet} />}
      >
        <View style={styles.content}>
          <Text style={styles.label}>Date of birth</Text>
          <MatchContentsPicker />
        </View>
      </TrueSheet>

      <TrueSheet
        ref={explicitSheet}
        name="explicit-height"
        detents={['auto']}
        footer={<Footer sheet={explicitSheet} />}
      >
        <View style={styles.content}>
          <Text style={styles.label}>Date of birth</Text>
          <ExplicitHeightPicker />
        </View>
      </TrueSheet>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
    gap: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    color: '#555',
  },
  content: {
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 16,
  },
  footer: {
    padding: 16,
  },
});
