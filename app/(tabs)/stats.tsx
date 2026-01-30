import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { Stats } from '@/components/Stats';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Stats />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
