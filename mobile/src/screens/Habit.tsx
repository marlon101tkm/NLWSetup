import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from '@react-navigation/native'
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { genereteProgressPercentage } from '../utils/generete-progress-percentage'
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}
interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setcompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;
  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date)
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');



  const habitsProgress = dayInfo?.possibleHabits.length ? genereteProgressPercentage(dayInfo.possibleHabits.length,completedHabits.length) : 0

  // console.log( dayInfo?.completedHabits.length + " + " + dayInfo?.possibleHabits.length +'+'+ habitsProgress  )

  async function fechHabits() {
    try {
      setLoading(true);
      const response = await api.get('/day', { params: { date } });
      setDayInfo(response.data);
      setcompletedHabits(response.data.completedHabits)

    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possivel carregar as informações dos hábitos');
    } finally {
      setLoading(false);
    }

  }

  async function handleToggleHabit(habitId: string) {
    try {

      await api.patch(`/habits/${habitId}/toggle`);
      
      if (completedHabits.includes(habitId)) {
        setcompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
      

      } else {
        setcompletedHabits(prevState => [...prevState, habitId]);
      

      }

      
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possivel atualizar o status do hábito')

    }

  }
  useEffect(() => {
    fechHabits()
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16" >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase" >
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl" >
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast
        })} >
          {
            dayInfo?.possibleHabits ?
              dayInfo.possibleHabits.map(habit => (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              ))
              : <HabitsEmpty />

          }
        </View>
        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar um hábitos de uma data passada

            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}