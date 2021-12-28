import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ContactContext } from './ContactProvider';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Feather';
import { SheetContext } from './SheetProvider';

interface ContactSheetProps {}

export const ContactSheet: React.FC<ContactSheetProps> = ({}) => {
  const {inPContact, setInPContact, isSheetOpen, setSheetOpen} = useContext(SheetContext)
  const {contacts, modifyContact} = useContext(ContactContext)
  const [count, setCount] = useState(0);

  const dimensions = useWindowDimensions();
  const SPRING_CONFIG =  {
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500
  }
  const top = useSharedValue( dimensions.height )
  useEffect(() => {
    if (isSheetOpen) {
      top.value = withSpring(
        dimensions.height / 1.4,
        SPRING_CONFIG
      )
    } else {
      top.value = withSpring(
        dimensions.height,
        SPRING_CONFIG
      )
    }
  }, [isSheetOpen])
  const style = useAnimatedStyle(() => {
    return {
      top : withSpring(top.value, SPRING_CONFIG)
    }
  });
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart(_, context : any) { 
      setCount(count + 1)
      context.startTop = top.value
    },
    onActive(event, context : any) {
      console.log(event)
      setCount(count + 1)
      top.value = context.startTop + event.translationY;
    },
    onEnd() {
      if (top.value > dimensions.height / 5 + 200) {
        top.value = dimensions.height
      } else {
        top.value = dimensions.height / 5
      }
    }
  });
  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}>
      <Animated.View
        style={[{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          padding: 20, 
          alignItems: 'center',
          zIndex: 1
        },
      style]}
      >
        <TouchableWithoutFeedback
            onPress={() => {
              setSheetOpen(false)
            }}
          >
            <View style={styles.down_arrow}>
              <Icon name="chevron-down" size={25}/>
            </View>
        </TouchableWithoutFeedback>
        <Text style={{marginTop: 10}}>Radius: {inPContact.Radius.toFixed(1)} m</Text>
        <Slider
          style={{width: 400, height: 50, marginTop: 20}}
          minimumValue={5}
          maximumValue={1000}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
          value={inPContact.Radius}
          onValueChange={(val) => {
            setInPContact({...inPContact, Radius : val})
          }}
        />
        <TouchableWithoutFeedback
            onPress={() => {
              setSheetOpen(false)
            }}
          >
            <View style={styles.save_button}>
              <Text>Save</Text>
            </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
  );
}
  
const styles = StyleSheet.create({
  down_arrow: {
    alignItems: "center",
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    top: 5,
    left: 10
  },
  save_button : {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  }
});