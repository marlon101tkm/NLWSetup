import { TouchableOpacity, TouchableOpacityProps, View, Text } from 'react-native'
import { Feather } from "@expo/vector-icons";
import colors from 'tailwindcss/colors';
import Animated, { ZoomIn ,ZoomOut } from 'react-native-reanimated';
 


interface Props extends TouchableOpacityProps {
  checked?: boolean;
  title: string;
}


export function Checkbox({ title, checked = false, ...rest }: Props) {
  return (
    <TouchableOpacity
      className='flex-row mb-2 items-center'
      activeOpacity={0.7}
      {...rest}
    >
      {
        checked
          ?
          <Animated.View className='h-8 w-8 bg-green-500 rounded-lg items-center justify-center'
          entering={ZoomIn}
          exiting={ZoomOut}
           >
            <Feather
              color={colors.white}
              size={20}
              name='check'
            />
          </Animated.View>
          :
          <View className='h-8 w-8 bg-zinc-900 rounded-lg ' />
      }
      <Text className='text-white text-base ml-3' >
        {title}
      </Text>

    </TouchableOpacity>

  )
}