import * as Notifications from "expo-notifications";

export async function setupNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        console.log("Permissão de notificação negada");
    }

    await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
    });
}

export async function scheduleMedicationReminder(
    medicationName: string,
    hours: number,
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "💊 Hora do remédio",
            body: `Está na hora de tomar ${medicationName}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { 
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
            seconds: 3600, 
            repeats: true 
        }

    });
}

export async function cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
