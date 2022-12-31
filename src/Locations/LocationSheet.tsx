import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, useWindowDimensions, TouchableWithoutFeedback, ScrollView, TextInput} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { color, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LocationContext, Location } from './LocationProvider';
import { RootStackParamList } from '../ParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface LocationSheetProps {
  navigation : NativeStackNavigationProp<RootStackParamList, "AddLocation">
}

export const LocationSheet: React.FC<LocationSheetProps> = ({navigation}) => {
  const {inProgLocation, setInProgLocation, isSheetOpen, setSheetOpen, locationArray, saveLocations} = useContext(LocationContext)
  const [isSheetFullExpanded, setSheetFullExpanded] = useState(false);
  const [locationName, onChangeName] = useState("");
  
  const SHEET_FULL_EXPANDED = 5
  const SHEET_PEEKING = 1.4
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
        dimensions.height / SHEET_PEEKING,
        SPRING_CONFIG
      )
    } else {
      top.value = withSpring(
        dimensions.height,
        SPRING_CONFIG
      )
    }
  }, [isSheetOpen])

  const handleSheetFullExpanded = () => {
    if (isSheetFullExpanded) {
      top.value = withSpring(
        dimensions.height / SHEET_PEEKING,
        SPRING_CONFIG
        )
    }
    else {
      top.value = withSpring(
        dimensions.height / SHEET_FULL_EXPANDED,
        SPRING_CONFIG
        )
    }
  }

  const ExpandIcon = () => {
    const icon_name = isSheetFullExpanded ? "arrow-down-drop-circle-outline" : "arrow-up-drop-circle-outline"
    return <Icon name={icon_name} size={50} color={"#0A5999"}/>
  }

  const SaveButton = () => {
    
    return locationName.length > 1 && isSheetFullExpanded? (
      <TouchableWithoutFeedback
            onPress={() => {
              setInProgLocation({...inProgLocation, Name : locationName})
              saveLocations([...locationArray, {...inProgLocation, Name: locationName}])
              navigation.goBack()
            }}
          >
          <View style={styles.save_button}>
            <Text style={{fontSize: 20}}>SAVE</Text>
          </View>
      </TouchableWithoutFeedback>
    ) : null
  }

  const style = useAnimatedStyle(() => {
    return {
      top : withSpring(top.value, SPRING_CONFIG)
    }
  });
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart(_, context : any) { 
      context.startTop = top.value
    },
    onActive(event, context : any) {
      console.log(event)
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
          backgroundColor: '#EBEBEB',
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
        <Text style={{marginTop: 10}}>Radius: {inProgLocation.Radius.toFixed(1)} m</Text>
        <Slider
          style={{width: 400, height: 50, marginTop: 20}}
          minimumValue={10}
          maximumValue={1000}
          minimumTrackTintColor="#52ABF4"
          maximumTrackTintColor="#52ABF4"
          thumbTintColor="#f0c756"
          value={inProgLocation.Radius}
          onValueChange={(val) => {
            setInProgLocation({...inProgLocation, Radius : val})
          }}
        />
        {isSheetFullExpanded ? (
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={locationName}
            placeholder="Enter a Location Name"
            maxLength={20}
          />
        ): null}
        <SaveButton/>
        <TouchableWithoutFeedback
              onPress={() => {
                handleSheetFullExpanded()
                setSheetFullExpanded(!isSheetFullExpanded)
              }}>
              <View>
                <ExpandIcon/>
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
    left: 10,
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  save_button : {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 100,
    backgroundColor: "#0A5999",
    marginTop: 10,
    marginBottom: 30,
    fontSize: 30
  },
});