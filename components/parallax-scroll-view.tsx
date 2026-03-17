import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type Props = {
  children: ReactNode;
  headerImage?: ReactNode;
  headerBackgroundColor?: {
    dark: string;
    light: string;
  };
};

export default function ParallaxScrollView({
  children,
  headerImage,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      {headerImage ? <View style={styles.header}>{headerImage}</View> : null}
      <View style={styles.body}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  body: {
    padding: 16,
  },
});