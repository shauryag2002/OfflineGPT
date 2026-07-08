import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Host, Text } from '@expo/ui';

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <Host>

<Text textStyle={{color:"blue"}} style={{backgroundColor:"blue"}} >Welcome to OfflineGPT</Text>
    </Host>
  );
}
