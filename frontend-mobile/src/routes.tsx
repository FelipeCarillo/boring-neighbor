import { createNativeStackNavigator } from '@react-navigation/native-stack';
import app from '../App';
import inicio from './screens/inicio';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Camera: undefined;
};

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator initialRouteName='Inicio'>
      <Stack.Screen name="Inicio" component={inicio} options={{headerShown:false}} />
    </Stack.Navigator>
  );
}