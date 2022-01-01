import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableWithoutFeedback, View, StyleSheet, FlatList } from 'react-native';
import { ContactStackParamList } from '../ParamList';
import { Center } from '../Center';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Contact, ContactContext } from './ContactProvider';

interface ListContactsProps {
  navigation : NativeStackNavigationProp<ContactStackParamList, "CreateContact">
}



export const ListContacts: React.FC<ListContactsProps> = ({navigation}) => {
  const {getContacts, saveContacts} = useContext(ContactContext)
  const [currContacts, setCurrContacts] = useState<Contact[]>([])

  useEffect(() => {
      getContacts().then(items => setCurrContacts(items))
  }, [saveContacts])

    return (
      <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CreateContact") 
          }}>
              <View style={styles.contactButton}>
                  <Text style={{fontSize: 20}}>Create Contact</Text>
              </View>
          </TouchableWithoutFeedback>
          {currContacts.length > 0 ? 
            <FlatList
                data={currContacts}
                renderItem={({ item, index, separators }) => (
                  <View style={styles.contact}>
                        <Text>{item.Name}</Text>
                  </View>
                )}
                keyExtractor={(item : Contact) => item.Name}
          /> : null}
      </View>
    );
}

const styles = StyleSheet.create({
  container : {
      alignItems: "center",
      justifyContent: "center",
      flex:1,
      paddingTop: 50
  },
  contactButton : {
    marginBottom: 20,
    backgroundColor: "#a1cdf4",
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  contact : { 
      backgroundColor: '#a9afd1', 
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginVertical: 10,
      width: 300
  },
})