import React, { useContext, useEffect, useState } from 'react'
import { Text, View, Button, useWindowDimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ContactContext } from './ContactProvider';
import Slider from '@react-native-community/slider';
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
        dimensions.height / 1.5,
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
    <>
    {/* <View>
        <Button
          title="Open Bottom Sheet"
          onPress={() => {
            top.value = withSpring(
              dimensions.height / 5,
              SPRING_CONFIG
              )
          }}
        />
    </View> */}
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
          justifyContent: 'center',
          alignItems: 'center',
        },
      style]}
      >
        <Button title='Close' onPress={() => {
          setSheetOpen(false)
        }}/>
        <Text>Radius: {inPContact.Radius}</Text>
          <Slider
            style={{width: 400, height: 100}}
            minimumValue={5}
            maximumValue={1000}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            value={inPContact.Radius}
            onValueChange={(val) => {
              const tempContact = inPContact 
              tempContact['Radius'] = val
              setInPContact(tempContact)
            }}
          />
      </Animated.View>
    </PanGestureHandler>
    </>
  );
}