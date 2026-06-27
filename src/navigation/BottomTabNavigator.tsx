import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { SquareTabBar } from "./SquareTabBar";

const Tab =createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigator(){
    return(
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            tabBar={(props) => <SquareTabBar {...props} />}
        >
            <Tab.Screen name="Home" component ={HomeScreen}/>
            <Tab.Screen name="Profile" component ={ProfileScreen}/>

        </Tab.Navigator>
    )
}