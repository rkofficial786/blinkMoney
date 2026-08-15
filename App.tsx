/**
 * BlinkMoney Wrapped
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LandingScreen } from './src/pages/landing';
import { WrappedScreen } from './src/pages/wrapped';
import { SquadScreen } from './src/pages/squad';
import { WrappedScenario } from './src/types/wrapped';
import { SquadScenario } from './src/types/squad';
import { colors } from './src/constants/colors';

type ActiveView =
  | { type: 'wrapped'; scenario: WrappedScenario }
  | { type: 'squad'; scenario: SquadScenario }
  | null;

function App() {
  const [activeView, setActiveView] = useState<ActiveView>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          {activeView?.type === 'wrapped' ? (
            <WrappedScreen scenario={activeView.scenario} onExit={() => setActiveView(null)} />
          ) : activeView?.type === 'squad' ? (
            <SquadScreen scenario={activeView.scenario} onExit={() => setActiveView(null)} />
          ) : (
            <LandingScreen
              onOpenWrapped={scenario => setActiveView({ type: 'wrapped', scenario })}
              onOpenSquad={scenario => setActiveView({ type: 'squad', scenario })}
            />
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

export default App;
