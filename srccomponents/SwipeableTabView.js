import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const SwipeableTabView = ({ children, activeTab, setActiveTab, tabCount }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy * 3);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        
        if (dx > SWIPE_THRESHOLD && activeTab > 0) {
          // Swipe right, go to previous tab
          setActiveTab(activeTab - 1);
        } else if (dx < -SWIPE_THRESHOLD && activeTab < tabCount - 1) {
          // Swipe left, go to next tab
          setActiveTab(activeTab + 1);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
});

export default SwipeableTabView;