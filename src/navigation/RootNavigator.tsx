import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import BottomTabNavigator from "./BottomTabNavigator";
import DetailScreen from "../screens/DetailScreen";
import PlayerScreen from "../screens/PlayerScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Tabs" component={BottomTabNavigator} options={{headerShown:false}}/>
            <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Player" component={PlayerScreen} options={{headerShown: false, presentation: 'fullScreenModal'}}/>
        </Stack.Navigator>
    )
}