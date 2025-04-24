import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function FooterNav() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => router.push("/views/Home")}>
        <FontAwesome5 name="home" size={24} color="#3FA9F5" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/views/Home")}>
        <MaterialIcons name="settings" size={24} color="#ccc" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/views/Home")}>
        <Entypo name="text-document" size={24} color="#ccc" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/views/Home")}>
        <FontAwesome5 name="info-circle" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0D1B2A',
    paddingVertical: 10,
  },
});
