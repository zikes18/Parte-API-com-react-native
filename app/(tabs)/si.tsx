import { Platform, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RobotMonitorScreen() {
  const isOnline = true;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1E1E1E' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#00A2FF"
          name="robot-outline"
          style={styles.headerImage}
        />
      }
    >
      {/* Título */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Monitoramento do Robô
        </ThemedText>
      </ThemedView>

      {/* Estado Visual do Robô */}
      <ThemedView style={styles.statusCircleContainer}>
        <LinearGradient colors={['#00C6FF', '#0072FF']} style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <MaterialCommunityIcons name="robot-outline" size={80} color="#00C6FF" />
          </View>
        </LinearGradient>
      </ThemedView>

      {/* Caixas de Status */}
      <Collapsible title="Status de movimentação">
        <ThemedView style={styles.statusBox}>
          <ThemedText style={styles.statusBoxText}>
            O ROBÔ ESTÁ ANDANDO.
          </ThemedText>
        </ThemedView>
      </Collapsible>

      <Collapsible title="Sensores">
        <ThemedView style={[styles.statusBox, styles.obstacleBox]}>
          <ThemedText style={styles.statusBoxTextSecondary}>
            O ROBÔ IDENTIFICOU UM OBSTÁCULO
          </ThemedText>
        </ThemedView>
      </Collapsible>

      <Collapsible title="Status da Conexão">
        <ThemedView style={styles.connectionStatusBox}>
          <ThemedText style={styles.connectionText}>Conexão: </ThemedText>
          <ThemedText
            style={[
              styles.connectionText,
              { color: isOnline ? '#39FF14' : '#FF3131' },
            ]}
          >
            {isOnline ? 'Online' : 'Offline'}
          </ThemedText>
          <View
            style={[
              styles.connectionDot,
              { backgroundColor: isOnline ? '#39FF14' : '#FF3131' },
            ]}
          />
        </ThemedView>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statusCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBox: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  obstacleBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  statusBoxText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBoxTextSecondary: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  connectionStatusBox: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  connectionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});
